import styles from "./styles.scss";

const SantaHat = () => (
    <img src={require('../../../assets/images/hat.png').default} className={styles.santahat} alt='santa hat' />
);

export {SantaHat};
