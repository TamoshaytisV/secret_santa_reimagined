import React, {ChangeEvent, useContext, useEffect, useRef, useState} from "react";
import {Button} from "../ui/components/Button";
import {FirebaseAuthContext} from "../firebase";
import Send from '../ui/components/Icon/assets/send.svg';
import Done from '../ui/components/Icon/assets/done.svg';
import Error from '../ui/components/Icon/assets/error.svg';
import Close from './assets/close.svg';
import {Zoom} from "react-awesome-reveal";
import {SantaContext} from "./Provider";
import {Icon, Status} from "../ui/components/Icon";
import {ProfileImage} from "./UserProfile";

import styles from './styles.scss';


const WishList = () => {
    const ref = useRef<HTMLTextAreaElement>(null);
    const firebaseCtx = useContext(FirebaseAuthContext);
    const [value, setValue] = useState('');
    const [status, setStatus] = useState<Status | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const saveHanler = () => {
        firebaseCtx.client.saveWishList(firebaseCtx.user.uid, value).then(() =>
            setStatus(Status.OK)
        ).catch(() => setStatus(Status.ERROR));
        setTimeout(() => setStatus(null), 3000);
    };

    const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    };

    useEffect(() => {
        if (!firebaseCtx.wishlist) {
            setValue('Dear Santa, ...');
            return;
        }

        setValue(firebaseCtx.wishlist);
        setIsLoading(false);
    }, [firebaseCtx.wishlist]);

    return <div className={styles.form}>
        <div>Leave message to your Santa ;)</div>
        <textarea rows={4} ref={ref}
                  onChange={onChange}
                  value={value}
                  placeholder={isLoading ? 'Loading your wishlist...' : undefined}/>
        <div className={styles.buttonWrapper}>
            <Button onClick={saveHanler} disabled={!value}>
                <span>Send</span>
                <Icon comp={!status ? Send : (status === Status.OK ? Done : Error)}/>
            </Button>
        </div>
    </div>;
};


const PresenteeWishList = ({value, onClose}: { value: string, onClose: () => void }) => {
    const profile = useContext(SantaContext);

    return value ?
        <div className={styles.presenteeWishlistWrapper}>
            <Zoom>
                <div className={styles.close}><Close onClick={onClose}/></div>
                <div className={styles.presenteeWishlist}>
                    <p>
                        <span className={styles.avatarWrapper}>
                            <ProfileImage url={profile.presentee!.picture}/>
                        </span>
                        {profile.presentee?.name}
                    </p>
                    <p dangerouslySetInnerHTML={{__html: value}}/>
                </div>
            </Zoom>
        </div> :
        null;
};


export {WishList, PresenteeWishList};
