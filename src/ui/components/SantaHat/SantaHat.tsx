import styles from "./styles.scss";
import {useContext} from "react";
import {PreoaderContext} from "../../../preloaders";


const SantaHat = () => {
    const loader = useContext(PreoaderContext);

    return <img src={loader.cache['hat.png']} className={styles.santahat} alt='santa hat'/>;
};

export {SantaHat};
