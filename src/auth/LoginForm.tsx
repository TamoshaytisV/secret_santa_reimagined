import React, {useContext, useEffect, useState} from "react";
import {Zoom} from "react-awesome-reveal";
import {Container} from "../ui/components/Container";
import {Title} from "../ui/components/Title";
import {Button} from "../ui/components/Button";

import styles from "./styles.scss";
import {FirebaseAuthContext} from "../firebase";


export const LoginForm = ({onError}: { onError: { (error: ErrorEvent): void } }) => {
    const [inProgress, setInProgress] = useState<boolean>(false);
    const firebaseCtx = useContext(FirebaseAuthContext);
    const {client, loginCallback} = firebaseCtx;

    const login = async () => {
        setInProgress(true);
        try {
            const result = await client.authenticate();
            setInProgress(false);
            loginCallback(result);
        } catch (error) {
            onError(error)
        }
    };

    useEffect(() => () => setInProgress(false));

    return <Zoom>
        <Container>
            <div className={styles.instructions}>
                <Title text='Secret Santa Sign Up!'/>
                <p>Hello, Raccoon! Please authenticate with your RG account.</p>
                <div className={styles.buttonContainer}>
                    <Button disabled={inProgress} onClick={login}>
                        Sign in with Google
                    </Button>
                </div>
            </div>
        </Container>
    </Zoom>;
}
