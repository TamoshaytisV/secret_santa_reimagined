import React, {ChangeEvent, useContext, useRef, useState} from "react";
import {FirebaseAuthContext} from "../firebase";
import {Button} from "../ui/components/Button";
import Send from '../ui/components/Icon/assets/send.svg';
import Done from '../ui/components/Icon/assets/done.svg';
import Error from '../ui/components/Icon/assets/error.svg';
import {Icon, Status} from "../ui/components/Icon";

import styles from './styles.scss';


const FeedbackForm = () => {
    const ref = useRef<HTMLTextAreaElement>(null);
    const firebaseCtx = useContext(FirebaseAuthContext);
    const [value, setValue] = useState('');
    const [status, setStatus] = useState<Status | null>(null);

    const saveHanler = () => {
        firebaseCtx.client.saveFeedback(firebaseCtx.user.uid, value).then(() => {
            setStatus(Status.OK);
            setValue('');
        }).catch(() => setStatus(Status.ERROR));
        setTimeout(() => setStatus(null), 3000);
    };

    const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    };

    return <div className={styles.form}>
        <div>Please share your experience or how we can improve</div>
        <textarea rows={4} ref={ref}
                  onChange={onChange}
                  value={value}
                  placeholder='Anything on your mind?'/>
        <div className={styles.buttonWrapper}>
            <Button onClick={saveHanler} disabled={!value}>
                <span>Send</span>
                <Icon comp={!status ? Send : (status === Status.OK ? Done : Error)}/>
            </Button>
        </div>
    </div>;
};

export {FeedbackForm}
