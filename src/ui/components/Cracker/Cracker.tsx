import React, {useEffect, useRef, useState} from 'react';
import {AttentionSeeker, Fade} from "react-awesome-reveal";
import useSound from "use-sound";

import styles from './styles.scss';
import sound from '../../../assets/sounds/crack.wav';


const HIT_LIMIT = 4;


interface CrackerHandlers {
    clickHandler?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void | Promise<any>;
    crackHandler?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void | Promise<any>;
}


interface CrackerProps extends CrackerHandlers{
    hidden: string;
}

interface CrackerMessageProps extends CrackerHandlers {
    children: string;
}


const Message = ({clickHandler, children}: CrackerMessageProps) => {
    return <div className={styles['cracker-message']} onClick={clickHandler}>
        <div className={styles['cracker-message__inner']} dangerouslySetInnerHTML={{
            __html: children
        }}>
        </div>
    </div>;
};


const Cracker = ({clickHandler, crackHandler, hidden}: CrackerProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [play, {stop}] = useSound(sound, {volume: 0.5});
    const [hideMsg, setHideMsg] = useState<boolean>(false);
    const [msgDelay, setMsgDelay] = useState<number>(250);
    let [hits, setHits] = useState<number>(0);

    const hoverHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (hits >= HIT_LIMIT - 1)
            !hideMsg && setHideMsg(true);
        msgDelay !== 10 && setMsgDelay(10);
        setHits(++hits);
        play();

        if (hits === HIT_LIMIT && crackHandler) {
            crackHandler(e);
        }
    };

    const mouseOutHandler = () => {
        hideMsg && setHideMsg(false);
        stop()
    };

    useEffect(() => {
        if (hits >= HIT_LIMIT && !ref.current?.classList.contains(styles.crack)) {
            ref.current?.classList.add(styles.crack);
        }
    }, [hits]);

    return <React.Fragment>
        {hits > 0 && hits < HIT_LIMIT &&
            <div className={styles.cracksBg} style={{
                height: `${22 * hits}px`,
                transform: `rotate(${Math.random() < 0.5 ?'-' : ''}${Math.ceil(Math.random() * 35)}deg)`
            }} />
        }
        <AttentionSeeker delay={500} effect={'swing'}>
            <div onMouseEnter={hoverHandler}
                 onMouseLeave={mouseOutHandler}
                 ref={ref}
                 className={styles.cracker} id="cracker"
            >
                <Message clickHandler={clickHandler}>
                    {hidden}
                </Message>
                <div className={styles['cracker-left']}>
                    <div className={styles['cracker-left-inner']}>
                        <div className={styles['cracker-left__mask-top']}/>
                        <div className={styles['cracker-left__mask-bottom']}/>
                        <div className={styles['cracker-left__tail']}/>
                        <div className={styles['cracker-left__end']}/>
                        <div className={styles['cracker-left__body']}/>
                        <div className={styles['cracker-left-zigzag']}>
                            {Array(5).fill(null).map((__, idx) =>
                                <div key={idx} className={styles['cracker-left-zigzag__item']}/>
                            )}
                        </div>
                    </div>
                </div>
                <div className={styles['cracker-right']}>
                    <div className={styles['cracker-right-inner']}>
                        <div className={styles['cracker-right__mask-top']}/>
                        <div className={styles['cracker-right__mask-bottom']}/>
                        <div className={styles['cracker-right__tail']}/>
                        <div className={styles['cracker-right__end']}/>
                        <div className={styles['cracker-right__body']}/>
                        <div className={styles['cracker-right-zigzag']}>
                            {Array(5).fill(null).map((__, idx) =>
                                <div key={idx} className={styles['cracker-right-zigzag__item']}/>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AttentionSeeker>
        <Fade delay={msgDelay} reverse={hideMsg}>
            <p className={styles['hover-me-text']}>
                Break the christmas cracker to get to know your presentee!
            </p>
        </Fade>
    </React.Fragment>
};


export {Cracker};
