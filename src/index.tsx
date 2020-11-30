import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {FirebaseAuthProvider} from "./firebase";
import firebase from "firebase/app";
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;


ReactDOM.render(
    <React.StrictMode>
        <FirebaseAuthProvider
            provider={GoogleAuthProvider}
            options={{hd: 'raccoongang.com'}}
            scope={['https://www.googleapis.com/auth/userinfo.profile']}
        >
            <App/>
        </FirebaseAuthProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
