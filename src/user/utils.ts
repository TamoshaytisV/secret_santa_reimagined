import firebase from "firebase/app";
import {UserProfileProps} from "../auth/types";

export const profileFromUserObj = (user: firebase.User | null): UserProfileProps | null => {
    if (!user) return null;

    const [given_name, family_name] = user.displayName!.split(' ');
    return {
        given_name: given_name,
        family_name: family_name,
        picture: user.photoURL!,
        name: user.displayName!,
        email: user.email!
    };
};
