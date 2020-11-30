import React from "react";
import firebase from "firebase/app";
import config from "./config";

export const app = firebase.initializeApp(config);

export const FirebaseAuthContext = React.createContext<any>({} as any);
