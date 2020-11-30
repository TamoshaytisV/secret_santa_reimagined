import styles from './styles.scss';

const LightRope = (
    {num, className}: {num: number, className?: string}
) => {
    const classes = [styles.lightrope];
    if (className)
        classes.push(className);

    return <ul className={classes.length > 1 ? classes.join(' ') : styles.lightrope}>
        {Array(num).fill(null).map((__, idx) => <li key={idx}/>)}
    </ul>
};

export {LightRope};
