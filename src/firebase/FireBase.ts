import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';
import Firestore = firebase.firestore.Firestore;
import QuerySnapshot = firebase.firestore.QuerySnapshot;
import DocumentData = firebase.firestore.DocumentData;
import Fireapp = firebase.app.App;
import Fireauth = firebase.auth.Auth;
import UserCredentials = firebase.auth.UserCredential;
import bind from "bind-decorator";
import {Providers} from "./types";
import {Presentee} from "../user/Provider";


class FireBase {
    db: Firestore;
    auth: Fireauth;
    provider: Providers;
    event: any;
    eventRef: any;

    constructor(app: Fireapp, authProvider: Providers) {
        this.db = app.firestore();
        this.auth = app.auth();
        this.provider = authProvider;
        this.event = null;
        this.eventRef = null;
    }

    private snapshot2array(snapshot: QuerySnapshot): DocumentData[] {
        const ret: DocumentData[] = [];
        snapshot.forEach(doc => {
            ret.push(doc);
        });
        return ret;
    }

    @bind
    async authenticate(cb?: { (result: UserCredentials): void }) {
        const result = await firebase.auth().signInWithPopup(this.provider);
        const profileData = result.additionalUserInfo?.profile;
        const profile = Object.assign({}, profileData || {}, {has_santa: false});
        await this.createProfile(result.user?.uid, profile);
        if (cb) {
            await cb(result);
        }
    }

    @bind
    async signOut() {
        await this.auth.signOut();
    }

    @bind
    async getActiveEvent() {
        if (this.event) return this.event;

        const event = await this.db.collection('event')
            .where('active', '==', true)
            .get();

        if (event.empty) {
            throw Error('No active event found!');
        }
        if (event.size > 1) {
            throw Error('Found multiple active events!');
        }

        this.event = this.snapshot2array(event)[0];
        this.eventRef = this.db.doc(`event/${this.event.id}`);
        return this.event;
    }

    @bind
    createProfile(uid: string | undefined, profile: Object | null | undefined) {
        if (!uid) throw Error('createProfile: User ID is ' + typeof uid);
        if (!profile) return;
        return this.eventRef.collection('users').doc(uid).set(profile, {merge: true});
    }

    @bind
    listUsers() {
        return this.eventRef.collection('users').get();
    }

    @bind
    async assignPresentee(santaUid: string) {
        const usersList = await this.eventRef.collection('users')
            // get list of users who was has not being selected as a presentee
            .where('has_santa', '==', false).get()
        const users: Presentee[] = [];

        usersList.forEach((doc: any) => {
            if (santaUid !== doc.id) {
                const data = doc.data();
                users.push({name: data.name, uid: doc.id, picture: data.picture});
            }
        });

        const presentee = users[Math.floor(Math.random() * users.length)];

        const santaRef = this.eventRef.collection('santa').doc(santaUid);
        const presenteeRef = this.eventRef.collection('users').doc(presentee.uid);
        try {
            await this.db.runTransaction(async (t) => {
                const wasChoosen = await this.eventRef.collection('santa')
                    .where('presentee', '==', presentee.uid).get();
                if (!wasChoosen.empty) return;
                await t.set(santaRef, {presentee: presentee.uid});
                await t.update(presenteeRef, {'has_santa': true});
            });
        } catch (e) {
            console.log('Transaction failure:', e);
        }
    }

    @bind
    async getPresentee(santaUid: string) {
        const santa = await this.eventRef.collection('santa').doc(santaUid).get()
            .catch((e: ErrorEvent) => console.log(e));
        if (santa.empty || !santa.data()) {
            return [null, null];
        }
        const presenteeUid = santa.data().presentee;
        const presenteeProfile = await this.eventRef.collection('users').doc(presenteeUid).get();
        return [presenteeUid, presenteeProfile.data()];
    }

    @bind
    saveWishList(santaUid: string, value: string) {
        return this.eventRef.collection('wishlist').doc(santaUid).set({text: value});
    }

    @bind
    getWishList(santaUid: string) {
        return this.eventRef.collection('wishlist').doc(santaUid).get();
    }
}

export default FireBase;
