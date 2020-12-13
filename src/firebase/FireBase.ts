import firebase from "firebase/app";
import bind from "bind-decorator";
import 'firebase/auth';
import 'firebase/firestore';
import Firestore = firebase.firestore.Firestore;
import QuerySnapshot = firebase.firestore.QuerySnapshot;
import DocumentData = firebase.firestore.DocumentData;
import FirestoreError = firebase.firestore.FirestoreError;
import FieldPath = firebase.firestore.FieldPath;
import Fireapp = firebase.app.App;
import Fireauth = firebase.auth.Auth;
import {Providers} from "./types";
import {Presentee} from "../user/Provider";


class FireBase {
    db: Firestore;
    auth: Fireauth;
    provider: Providers;
    event: any;
    eventRef: any;
    callbacks: Function[];

    constructor(app: Fireapp, authProvider: Providers) {
        this.db = app.firestore();
        this.auth = app.auth();
        this.provider = authProvider;
        this.event = null;
        this.eventRef = null;
        this.callbacks = [];
    }

    private getFirst(snapshot: QuerySnapshot): DocumentData {
        const ret: DocumentData[] = [];
        snapshot.forEach(doc => {
            ret.push(doc);
        });
        return ret[0];
    }

    @bind
    async authenticate() {
        return await firebase.auth().signInWithPopup(this.provider);
    }

    @bind
    async signOut() {
        await this.auth.signOut();
    }

    @bind
    getActiveEvent(onEventUpdate: (e: any) => void, onEventError?: (e: any) => void) {
        if (this.event) return this.event;

        return this.db.collection('event')
            .where('active', '==', true)
            .onSnapshot((docSnapshot: QuerySnapshot<DocumentData>) => {
                if (docSnapshot.empty) {
                    throw Error('No active event found!');
                }
                if (docSnapshot.size > 1) {
                    throw Error('Found multiple active events!');
                }

                this.event = this.getFirst(docSnapshot);
                this.eventRef = this.db.doc(`event/${this.event.id}`);
                onEventUpdate(this.event);
            }, (err: FirestoreError) => {
                if (onEventError)
                    onEventError(err);
            });
    }

    @bind
    async createProfile(uid: string | undefined, profile: Object | null | undefined) {
        if (!uid) throw Error('createProfile: User ID is ' + typeof uid);
        if (!profile) return;
        return await this.eventRef.collection('users').doc(uid).set(profile, {merge: true});
    }

    @bind
    async getProfile(uid: string) {
        return await this.eventRef.collection('users').doc(uid).get();
    }

    @bind
    async isMySanta(myUid: string, otherUid: string) {
        const mySanta = await this.eventRef.collection('santa').doc(otherUid).get();
        if (mySanta.exists) {
            return mySanta.data().presentee === myUid;
        }
        return false;
    }

    @bind
    watchPresentees(uid: string, callback: (w: Presentee[]) => void) {
        return this.eventRef.collection('users')
            .where('has_santa', '==', false)  // get list of users who was has not being selected as a presentee
            .where(FieldPath.documentId(), 'not-in', [uid])  // do not select myself
            .onSnapshot((docSnapshot: QuerySnapshot<DocumentData>) => {
                const users: Presentee[] = [];
                docSnapshot.forEach((doc: any) => {
                    this.isMySanta(uid, doc.id).then((result: boolean) => {
                        if (result) return;

                        const data = doc.data();
                        users.push({name: data.name, uid: doc.id, picture: data.picture});
                    });
                });
                callback(users);
            });
    }

    @bind
    async assignPresentee(santaUid: string, presenteeUid: string) {
        const santaRef = this.eventRef.collection('santa').doc(santaUid);
        const presenteeRef = this.eventRef.collection('users').doc(presenteeUid);
        try {
            await this.db.runTransaction(async (t) => {
                t.set(santaRef, {presentee: presenteeUid});
                t.update(presenteeRef, {'has_santa': true});
            });
         } catch (e) {
            console.log('Transaction failure:', e);
        }
    }

    @bind
    async getPresentee(santaUid: string) {
        const santa = await this.eventRef.collection('santa').doc(santaUid).get()
            .catch((e: ErrorEvent) => console.log(e));
        if (!santa.exists || !santa.data()) {
            return [null, null];
        }
        const presenteeUid = santa.data().presentee;
        const presenteeProfile = await this.eventRef.collection('users').doc(presenteeUid).get();
        return [presenteeUid, presenteeProfile.data()];
    }

    @bind
    async saveWishList(uid: string, value: string) {
        return await this.db.collection('wishlist').doc(uid).set({text: value});
    }

    @bind
    watchWishList(uid: string, callback: (w: DocumentData) => void) {
        return this.db.collection('wishlist')
            .where(FieldPath.documentId(), 'in', [uid])
            .onSnapshot((docSnapshot: QuerySnapshot<DocumentData>) => {
                if (docSnapshot.empty) {
                    console.log('No wishlist found for ' + uid);
                }
                const wishlist = this.getFirst(docSnapshot);
                callback(wishlist);
            });
    }

    @bind
    async saveFeedback(uid: string, value: string) {
        return await this.eventRef.collection('feedback').doc(uid).collection('messages').doc().set({text: value});
    }
}

export default FireBase;
