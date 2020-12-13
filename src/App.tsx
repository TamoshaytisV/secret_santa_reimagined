import React, {useContext} from "react";
import {SnowFlake} from "./ui/components/SnowFlake/SnowFlake";
import {PreoaderContext} from "./preloaders/Preoader";
import {FirebaseAuthContext} from "./firebase";
import {Loader} from "./ui/components/Loader";
import {LoginForm} from "./auth";
import {UserProfile} from "./user/UserProfile";
import {LightRope} from "./ui/components/LightRope/LightRope";
import {Player} from "./ui/components/BackgroundMusic/Player";
import SantaProfileProvider, {SantaContext} from "./user/Provider";

import styles from "./App.scss";
import soundfile from './assets/sounds/x-mas.mp3';
import {Error} from "./ui/components/Error/Error";


function App() {
    const fontsCtx = useContext(PreoaderContext);
    const firebaseCtx = useContext(FirebaseAuthContext);
    const {isLoading, isSignedIn, profile, error} = firebaseCtx;

    return (
        <div className={styles.app}>
            <Player url={soundfile} volume={0.3}/>
            <LightRope className={styles.lightrope} num={35} />
            <div className='content'>
                <div className="snowflakes" aria-hidden="true">
                    {Array(10).fill(0).map((__, idx) => (
                        <SnowFlake key={idx}/>
                    ))}
                </div>

                <SantaProfileProvider firebaseCtx={firebaseCtx}>
                    <SantaContext.Consumer>
                        {santaProfile => {
                            const loading = isLoading || fontsCtx.isLoading || santaProfile.isLoading;
                            return !isLoading && error ?
                                <Error error={error} reset={firebaseCtx.signOut}/> :
                                <React.Fragment>
                                    {loading && <Loader />}
                                    {!loading && !isSignedIn && <LoginForm onError={firebaseCtx.onLoginError}/>}
                                    {!loading && isSignedIn && profile &&
                                        <UserProfile {...profile}/>
                                    }
                                </React.Fragment>
                        }}
                    </SantaContext.Consumer>
                </SantaProfileProvider>
            </div>
        </div>
    );
}

export default App;
