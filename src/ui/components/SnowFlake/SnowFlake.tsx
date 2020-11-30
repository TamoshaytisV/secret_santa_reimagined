import styles from './styles.scss';

const SnowFlake = () => {
    return <div className={styles.snowflake}>
        <img src={require('../../../assets/images/snowflake.png').default} alt='snowflake'/>
    </div>
};

export {SnowFlake};
