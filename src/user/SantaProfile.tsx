import React, {useContext, useEffect, useState} from "react";
import firebase from "firebase/app";
import DocumentData = firebase.firestore.DocumentData;
import {Presentee, SantaContext} from "./Provider";
import {Button} from "../ui/components/Button";
import {Cracker} from "../ui/components/Cracker/Cracker";
import {Results} from "../ui/components/Results/Results";
import {FirebaseAuthContext} from "../firebase";
import {PresenteeWishList} from "./WishList";

import styles from "./styles.scss";
import Message from './assets/email.svg';
import {Bounce, Fade} from "react-awesome-reveal";
import {Title} from "../ui/components/Title";


const SantaProfile = () => {
    const profile = useContext(SantaContext);
    const {presentee} = profile;
    const [cracked, setCracked] = useState<boolean>(!Boolean(presentee));
    const [showWishlist, setShowWishlist] = useState<boolean>(false);
    const firebaseCtx = useContext(FirebaseAuthContext);

    const crackHandler = () => {
        setCracked(true);
    };

    const onWishlistUpdate = (snapshot: DocumentData) => {
        if (!snapshot) return;
        console.log(presentee?.name + ' wishlist changed: ' + snapshot.data().text);
        profile.update!({
            presentee: Object.assign({}, presentee, {wishlist: snapshot.data().text})
        });
    };

    const clickCallback = async () => {
        const users = firebaseCtx.presenteeOptions;
        let presentee: Presentee | null;
        if (users.length === 0) {
            presentee = null;
        } else {
            presentee = users[Math.floor(Math.random() * users.length)];
        }

        if (!presentee) {
            profile.update({
                error: 'Unfortunatelly, we failed to find presentee for you. ' +
                    'Please try again, maybe more people have joined. ' +
                    'Otherwise, please contact HR person for help.'
            });
            return;
        }

        await firebaseCtx.client.assignPresentee(firebaseCtx.user.uid, presentee.uid)
        const {name, picture, wishlist, uid} = presentee;
        profile.update!({presentee: {name, picture, wishlist: wishlist || '', uid} || null});
    };

    useEffect(() => {
        if (profile.isSanta) {
            setCracked(true);
        }
    }, []);

     useEffect(() => {
        if (presentee) {
            console.log('subscribed to presentee wishlist updates');
            firebaseCtx.client.watchWishList(presentee.uid, onWishlistUpdate);
        }
    }, [JSON.stringify(presentee)]);

    if (profile.error) {
        return <Fade>
            <div className={styles.error}>
                <Title text={`> Error`} size={1} />
                <p>{profile.error}</p>
            </div>
        </Fade>;
    }

    return <React.Fragment>
        {!profile.isSanta && <div className={styles.wannaBe}>
            <Button onClick={() => profile.update!({isSanta: true})}>
                Become Santa
            </Button>
        </div>}
        {profile.isSanta && <React.Fragment>
            {(!profile.presentee || !cracked) && <div>
                <Cracker hidden={'Click Me!'}
                         clickHandler={clickCallback}
                         crackHandler={crackHandler}/>
            </div>}
            {profile.presentee && <React.Fragment>
                {showWishlist ?
                    <PresenteeWishList value={profile.presentee.wishlist} onClose={() => setShowWishlist(false)}/> :
                    <React.Fragment>
                        <Results/>
                        {profile.presentee.wishlist &&
                            <div className={styles.wishlistMsg} onClick={() => setShowWishlist(true)}>
                                <Bounce delay={1300}>
                                    <span title={'Dear Santa ...'}><Message/></span>
                                </Bounce>
                            </div>
                        }
                    </React.Fragment>
                }
            </React.Fragment>}
        </React.Fragment>}
    </React.Fragment>;
};

export {SantaProfile};
