import {useEffect, useState} from "react";
import firebase from "firebase/app";
import {profileFromUserObj} from "../user/utils";


type FirebaseAuthHook =
    | firebase.User
    | null;


function useFirebaseAuthentication(auth: firebase.auth.Auth, cb?: {(): void}): [FirebaseAuthHook, Object | null] {
    const [authUser, setAuthUser] = useState<FirebaseAuthHook>(null);

    useEffect(() => {
        const unlisten = auth.onAuthStateChanged(
            (authUser: FirebaseAuthHook): any => {
                authUser
                    ? setAuthUser(authUser)
                    : setAuthUser(null);
                if (cb) cb();
            },
        );
        return () => unlisten();
    }, []);

    return [authUser, profileFromUserObj(authUser)]
}

export {useFirebaseAuthentication};
