import styles from "./styles.scss";
import {SantaHat} from "../SantaHat/SantaHat";
import React from "react";


const Container = ({children}: {children: any}) => (
    <div className={styles.container}>
        <SantaHat/>
        {children}
    </div>
);

export {Container};
