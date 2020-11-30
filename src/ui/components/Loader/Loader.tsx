import styles from './styles.scss';

const Loader = () => {
    return <div className={styles['loading-container']}>
        <div id="loader">Loading...</div>
    </div>
};

export {Loader};
