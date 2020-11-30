import React, {ChangeEvent, useContext, useEffect, useRef, useState} from "react";
import firebase from "firebase/app";
import DocumentData = firebase.firestore.DocumentData;
import {Button} from "../ui/components/Button";
import {FirebaseAuthContext} from "../firebase";

import styles from './styles.scss';
import Send from './assets/send.svg';
import Done from './assets/done.svg';
import Error from './assets/error.svg';



enum Status {
    ERROR = 'error',
    OK = 'ok'
}


const Icon = ({comp, ...props}: {comp: typeof Send | typeof Done | typeof Error}) => {
    return <div className={styles.bounce}>{comp(props)}</div>;
};


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
        firebaseCtx.client.getWishList(firebaseCtx.user.uid).then((data: DocumentData) => {
            if (!data.data()) {
                ref.current!.placeholder = 'No letters to Santa found :( Go and add one';
                setTimeout(() => {
                    setValue( 'Dear Santa, ...');
                }, 2500);

                return;
            }
            setTimeout(() => {
                setValue(data.data().text);
                setIsLoading(false);
            }, 1000);
        });
    }, []);

    return <div className={styles.wishlist}>
        <div>Leave your message to Santa ;)</div>
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

export {WishList};
