import React from 'react';
import ReactDOM from 'react-dom';
import firebase from "firebase/app";
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import App from './App';
import reportWebVitals from './reportWebVitals';
import {FirebaseAuthProvider} from "./firebase";
import {PreloaderProvider} from "./preloaders";


ReactDOM.render(
    <React.StrictMode>
        <PreloaderProvider fonts={['SnowyXMass', 'Josefin Sans']}
                           images={['hat.png']}>
            <FirebaseAuthProvider
                provider={GoogleAuthProvider}
                options={{hd: process.env.GOOGLE_DOMAIN}}
                scope={['https://www.googleapis.com/auth/userinfo.profile']}
            >
                <App/>
            </FirebaseAuthProvider>
        </PreloaderProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
