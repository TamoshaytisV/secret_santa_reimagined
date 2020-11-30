import {Fade} from "react-awesome-reveal";
import {Container} from "../ui/components/Container";
import styles from "./styles.scss";
import {Title} from "../ui/components/Title";
import {Button} from "../ui/components/Button";
import React from "react";


export const LoginError = ({error, reset}: {error: ErrorEvent, reset: {(val: any): void}}) => <Fade>
    <Container>
        <div className={styles.instructions}>
            <Title text={'> Error'}/>
            <p>{error!.message}</p>
            <Button onClick={() => reset(null)}>
                Back
            </Button>
        </div>
    </Container>
</Fade>
