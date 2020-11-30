import React, {useEffect, useState} from "react";
import {app, FirebaseAuthContext} from "./context";
import FireBase from "./FireBase";
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';
import UserCredentials = firebase.auth.UserCredential;
import {Providers} from "./types";
import {useMergeState} from "./utils";
import {useFirebaseAuthentication} from "./hooks";


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
    profile?: Object | null;
}


const FirebaseAuthProvider = ({provider, options, scope, children}: FirebaseAuthProviderProps) => {
    const [state, setState] = useMergeState<FirebaseAuthProviderState>({
        isLoading: true,
        authenticated: false,
        user: null,
        profile: null
    });

    // Provider config
    const authProvider = new provider();
    if (options) authProvider.setCustomParameters(options);
    if (scope?.length) scope.map(s => authProvider.addScope(s));

    // Handlers
    const loginCallback = async (result: UserCredentials) => {
        const {profile: profileData} = result.additionalUserInfo!;
        const profile = Object.assign({}, profileData, {has_santa: false});
        const user = result.user;
        setState({user, profile, authenticated: true});
    };

    const authCompleted = () => {setState({isLoading: false})};

    const signOut = async () => {
        await api.signOut();
        setState({
            user: null, profile: null, authenticated: false, isLoading: false
        });
    };

    // Firebase
    const [api] = useState(new FireBase(app, authProvider));
    const [user, profile] = useFirebaseAuthentication(api.auth, authCompleted);

    useEffect(() => {
        if (!state.user && user) {
            setState({
                user,
                profile,
                authenticated: true,
                isLoading: false
            });
        }
    }, [JSON.stringify(user)]);

    useEffect(() => {
        api.getActiveEvent().then(event => {
            console.log("Active event - ", event.id);
            // Hack! We want to trigger component redraw one more time
            // for underlying child components to redraw in a new context
            setState({isLoading: false});
        });
    }, [])

    return <FirebaseAuthContext.Provider value={{
        app: app,
        client: api,
        authProvider: authProvider,
        isLoading: state.isLoading,
        isSignedIn: state.authenticated,
        user: state.user,
        profile: state.profile,

        loginCallback,
        signOut
    }}>
        {children}
    </FirebaseAuthContext.Provider>
};

export {FirebaseAuthProvider}
