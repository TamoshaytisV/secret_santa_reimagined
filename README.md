## Secret santa (typescript + React + firebase)
### Install and run
    yarn install
    yarn start
    
### Design inspired by
- https://codepen.io/lution/pen/VqbLjq
- https://codemyui.com/css-only-bon-bons-or-christmas-cracker/
- https://codemyui.com/pure-css-3d-christmas-tree-animation/
- https://codemyui.com/christmas-lights-pure-css/

### Firebase
In this project i used the Firebase Auth and Firestore as a backend part.

Setup the new project in the firebase console and copy a config which firebase suggests.

Create `.env` file in the project root and assign appropriate variables values
```shell script
FIREBASE_PROJECT_ID=
FIREBASE_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_API_KEY=

GOOGLE_DOMAIN=
```

You also migt want to set security rules for the firestore so please reffer to the official docs https://firebase.google.com/docs/firestore/security/rules-conditions

I used the following config to restrict access only to users from my organization

    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
          function isValidEmail() {
            return (request.auth.token.email.matches('.*@mydomain[.]com$') && 
            request.auth.token.email_verified);
          }
        match /{document=**} {
          allow read, write: if isValidEmail();
        }
      }
    }
    
#### Authentication
I used google authentication as a way for users to authorize. You can use any firebase backend listed in https://console.firebase.google.com/project/%your-project%/authentication/providers and supported by [firebase](https://github.com/firebase/firebase-js-sdk/tree/2ac31a1dbadbaf1d158b7c664567efd7a651bf81/packages-exp/auth-exp/src/core/providers)

Pass the provider class of your choice to the props of `FirebaseAuthProvider` component in `index.tsx` file
```jsx
<FirebaseAuthProvider
    provider={TwitterAuthProvider}
    options={{...}}
    scope={[...]}
>
    <App/>
</FirebaseAuthProvider>
```

#### Event
Each year you might have different users and they should definitelly choose different presentees on each new event.

In order to achieve this, some manual work should be done in firebase console:

- Create new collection named `event` in Firestore
- Add the new document with ID equalsto the next year, e.g. 2021
- Add the following fields in the document with values
```js
active (boolean) true
started (boolean) false
```

Each year you should create new event and make it active as well as set inactive previous event. Having multiple events active will result in error.

`started` param allows you to restrict users from selecting presentees. Users will only be able to resister and wait for the event to start. This can be helpful to ensure you have some minimal number of participants before they start selection process.

You can start the event by manually changing `started` value from `false` to `true`. Users' iterface will react immediatelly with no need to refresh the page.

#### Admin
To make any user to see event stats, just add `isAdmin (boolean) true` to the /event/{year}/users/{userId} profile data

### useSound
I use this great lib fork https://github.com/joshwcomeau/use-sound to play sounds. I needed to make small adjustments so that's why i keep its copy until my PRs will be accepted.

### Screenshots
![login](screenshots/login.png?raw=true)
![become santa](screenshots/before_cracker.png?raw=true)
![cracker](screenshots/cracker_cracked.png?raw=true)
![presentee](screenshots/presentee_selected.png?raw=true)
![presentee wishlist](screenshots/presentee_wishlist.png?raw=true)
![my wishlist](screenshots/my_wishlist.png?raw=true)
![admin](screenshots/admin.png?raw=true)
