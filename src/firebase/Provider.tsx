import React, {useEffect, useState} from "react";
import {useMergeState} from "./utils";
import {app, FirebaseAuthContext} from "./context";
import FireBase from "./FireBase";
import firebase from 'firebase/app';
import 'firebase/firestore';
import UserCredentials = firebase.auth.UserCredential;
import DocumentData = firebase.firestore.DocumentData;
import {Providers} from "./types";
import {Presentee} from "../user/Provider";


interface FirebaseAuthProviderProps {
    provider: Providers;
    options?: Object;  // https://goo.gl/Xo01Jm
    scope?: string[];
    children: any;
}

interface FirebaseAuthProviderState {
    isLoading?: boolean;
    authenticated?: boolean;
    user?: firebase.User | null;
    profile?: {[key: string]: any} | null;
    wishlist?: string | null;
    event?: any;
    error?: {message: string} | null;
}


const FirebaseAuthProvider = ({provider, options, scope, children}: FirebaseAuthProviderProps) => {
    const initialState = {
        isLoading: true,
        authenticated: false,
        user: null,
        profile: null,
        wishlist: '',
        event: null,
        error: null
    };
    const [state, setState] = useMergeState<FirebaseAuthProviderState>(initialState);
    const [firebaseListeners, setListeners] = useState<Function[]>([]);
    const [presenteeOptions, setPresenteeOptions] = useState<Presentee[]>([]);
    const {event, profile, isLoading, user, authenticated} = state;

    // ==== Provider config
    const authProvider = new provider();
    if (options) authProvider.setCustomParameters(options);
    if (scope?.length) scope.map(s => authProvider.addScope(s));

    // ==== Handlers
    const loginCallback = async (result: UserCredentials) => {
        const profileData = result.additionalUserInfo?.profile;
        let profile = Object.assign({}, profileData || {}, {has_santa: false});

        setState({
            user: result.user,
            profile: profile,
            isLoading: true,
        });
    };

    const onError = (err: any) => {
        setState({error: {message: err}, isLoading: false, authenticated: false});
    };

    const getOrCreateProfile = async (userProfile: DocumentData) => {
        if (!userProfile.exists) {
            if (user && !profile) onError('User profile was not found');
            api.createProfile(state.user?.uid, profile)
                .catch((e: any) => onError(`Error during profile creation: ${e}`));
        } else {
            if (!profile) {
                setState({profile: userProfile.data()});
            }
        }
    };

     const onEventUpdate = async (event: any) => {
        if (!event.exists) {
            onError('Active event was not found');
            return;
        }
        console.log("Active event updated:", event.id);
        setState({event: event.data()});
    };

    const unsubscribe = () => {
        firebaseListeners.map(listener => listener());
        setListeners([]);
    };

    const signOut = async () => {
        unsubscribe();
        await api.signOut();
        setState({...initialState, isLoading: false});
    };

    const onWishlistUpdate = (snapshot: DocumentData) => {
        if (!snapshot) return;
        setState({wishlist: snapshot.data().text});
    };
    // ==== Handlers end

    // ==== Firebase API
    const [api] = useState(new FireBase(app, authProvider));

    useEffect(() => {
        // Subscribe to the Firebase auth callback on mount
        const authListener = api.auth.onAuthStateChanged(
            (authUser: firebase.User | null): any => {
               if (authUser && !user) {
                   setState({user: authUser, isLoading: false});
                   return;
               }
               setState({isLoading: false});
            }
        );
        setListeners([...firebaseListeners, authListener])
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!event && user) {
            setState({isLoading: true});
            const eventListenerRef = api.getActiveEvent(onEventUpdate, (err: any) => {onError(`Encountered event error: ${err}`);});
            const wishlistListenerRef = api.watchWishList(user.uid, onWishlistUpdate);
            setListeners([...firebaseListeners, eventListenerRef, wishlistListenerRef]);
        }
    }, [JSON.stringify(user)]);

    useEffect(() => {
        // event should be {active: true, started: true}
        const isActiveEvent = event && event.active;
        const isStartedEvent = event && event.started;
        if (isActiveEvent && user && !authenticated) {
            api.getProfile(user.uid).then(getOrCreateProfile);
        }

        if (isStartedEvent && user) {
            const presenteeListenerRef = api.watchPresentees(user.uid, setPresenteeOptions);
            setListeners([...firebaseListeners, presenteeListenerRef]);
        }
    }, [JSON.stringify(event)]);

    useEffect(() => {
        if (isLoading && user && profile && event) {
            setState({
                isLoading: false,
                authenticated: true
            });
        }
    });

    return <FirebaseAuthContext.Provider value={{
        client: api,
        isSignedIn: state.authenticated,
        wishlist: state.wishlist,
        error: state.error,
        app,
        authProvider,
        isLoading,
        user,
        profile,
        event,
        presenteeOptions,

        loginCallback,
        onLoginError: onError,
        signOut
    }}>
        {children}
    </FirebaseAuthContext.Provider>
};

export {FirebaseAuthProvider}
