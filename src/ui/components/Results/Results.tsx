import {useContext, useEffect} from "react";
import {SantaContext} from "../../../user/Provider";

import styles from './styles.scss';
import sound from '../../../assets/sounds/bells.wav';
import useSound from "use-sound";


const Light = ({idx}: { idx: number }) => {
    const extraClass = `light-wrapper-${idx}`;
    // @ts-ignore
    const classes = [styles['light-wrapper'], styles[extraClass]];

    return <li className={classes.join(' ')}>
        <div className={styles.stabilise}>
            <div className={styles.light}/>
        </div>
    </li>;
};


const Results = () => {
    const profile = useContext(SantaContext);
    const [play] = useSound(sound);

    if (!profile.presentee) {
        return <div>Something went wrong... We couldn't find presentee for you.</div>;
    }

    useEffect(() => {
        play();
    }, []);

    return <div className={styles['main-wrapper']}>
        <div className={styles['tree-container']}>
            <div className={styles.star} />
            <div className={styles['spiral-container']}>
                <ul className={[styles.spiral, styles.one].join(' ')}>
                    {Array(42).fill(null).map((__, idx) =>
                        <Light key={idx} idx={idx + 1}/>
                    )}
                </ul>
                <ul className={[styles.spiral, styles.two].join(' ')}>
                    {Array(42).fill(null).map((__, idx) =>
                        <Light key={idx} idx={idx}/>
                    )}
                </ul>
                <ul className={[styles.spiral, styles.three].join(' ')}>
                    {Array(42).fill(null).map((__, idx) =>
                        <Light key={idx} idx={idx}/>
                    )}
                </ul>
            </div>
        </div>
        <div className={styles['text-container']}>
            <p>Your presentee is</p>
            <h2 className={styles.happy}>{profile.presentee.name}</h2>
            <img src={profile.presentee.picture} />
        </div>
    </div>;
};

export {Results};
