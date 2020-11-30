import React, {useContext} from "react";
import {SnowFlake} from "./ui/components/SnowFlake/SnowFlake";
import {FirebaseAuthContext} from "./firebase";
import {Loader} from "./ui/components/Loader";
import {Login} from "./auth";
import {UserProfile} from "./user/UserProfile";
import {LightRope} from "./ui/components/LightRope/LightRope";
import {Player} from "./ui/components/BackgroundMusic/Player";
import SantaProfileProvider, {SantaContext} from "./user/Provider";

import styles from "./App.scss";
import soundfile from './assets/sounds/x-mas.ogg';


function App() {
    const firebaseCtx = useContext(FirebaseAuthContext);
    const {isLoading, isSignedIn, profile} = firebaseCtx;

    return (
        <div className={styles.app}>
            <Player url={soundfile} volume={0.2}/>
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
                            const loading = isLoading || santaProfile.isLoading;
                            return <React.Fragment>
                                {loading && <Loader />}
                                {!loading && !isSignedIn && <Login/>}
                                {isSignedIn && profile &&
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
