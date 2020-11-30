import styles from './styles.scss';

interface TabProps {
    label: string;
    active?: boolean;
    onClick?: () => void;
}


const Tab = ({label, active, onClick}: TabProps) => {
    const classes = [styles.tab];
    if (active) classes.push(styles.active);
    return <div className={classes.length > 1 ? classes.join(' ') : styles.tab}
                onClick={onClick}>
        {label}
    </div>;
};

export {Tab};
