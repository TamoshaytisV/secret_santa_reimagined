import React, {useContext, useEffect, useState} from "react";
import {Presentee, SantaContext} from "./Provider";
import {Button} from "../ui/components/Button";
import {Cracker} from "../ui/components/Cracker/Cracker";
import {Results} from "../ui/components/Results/Results";
import styles from "./styles.scss";
import {FirebaseAuthContext} from "../firebase";


const SantaProfile = () => {
    const profile = useContext(SantaContext);
    const [cracked, setCracked] = useState<boolean>(!Boolean(profile.presentee));
    const firebaseCtx = useContext(FirebaseAuthContext);

    const crackHandler = () => {
        setCracked(true);
    };

    const clickCallback = async () => {
        const response = await firebaseCtx.client.listUsers();
        const users: Presentee[] = [];

        response.forEach((doc: any) => {
            if (firebaseCtx.user.uid !== doc.id) {
                const data = doc.data();
                users.push({name: data.name, uid: doc.id, picture: data.picture});
            }
        });

        const presentee = users.length > 1 ?
            users[Math.floor(Math.random() * users.length)] :
            users[0];

        await firebaseCtx.client.assignPresentee(firebaseCtx.user.uid, presentee.uid);

        profile.update!({presentee: presentee || null});
    };

    useEffect(() => {
        if (profile.isSanta) {
            setCracked(true);
        }
    }, []);

    return <React.Fragment>
        {!profile.isSanta && <div className={styles.wannaBe}>
            <Button onClick={() => profile.update!({isSanta: true})}>
                Become Santa
            </Button>
        </div>}
        {profile.isSanta && (!profile.presentee || !cracked) && <div>
            <Cracker hidden={'Click Me!'}
                     clickHandler={clickCallback}
                     crackHandler={crackHandler} />
        </div>}
        {profile.isSanta && profile.presentee && <Results />}
    </React.Fragment>;
};

export {SantaProfile};
