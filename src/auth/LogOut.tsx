import styles from './styles.scss';


const LogOut = (
    {logoutHandler}: {logoutHandler: {(): void}}
) => {
    return <div className={styles.logout} onClick={logoutHandler}>
        Sign Out
    </div>;
};

export {LogOut}
