import React from "react";
import {Fade} from "react-awesome-reveal";
import {Container} from "../Container";
import {Title} from "../Title";
import {Button} from "../Button";

import styles from './styles.scss';


export const Error = ({error, reset}: {error: ErrorEvent, reset: {(val: any): void}}) => <Fade>
    <Container>
        <div className={styles.errorWrapper}>
            <Title text={'> Error'}/>
            <p>{error!.message}</p>
            <Button onClick={() => reset(null)}>
                Back
            </Button>
        </div>
    </Container>
</Fade>
