import { useEffect } from "react";
import useSound from 'use-sound';

import styles from './styles.scss';
import PlayImg from './assets/play.svg';
import PauseImg from './assets/pause.svg';
import {HowlOptions} from "howler";


interface PlayerProps {
  url: string;
  autoPlay?: boolean;
  volume?: number;
}


const Player = ({url, autoPlay, volume}: PlayerProps) => {
  const [play, {isPlaying, pause}] = useSound<HowlOptions>(url, {
    volume: volume,
    loop: true,
  });

  useEffect(() => {
    if (autoPlay) play();
  }, []);

  return <div className={styles.player}>
    {isPlaying ?
        <PauseImg onClick={() => pause()}/> :
        <PlayImg onClick={() => play()} />
    }
  </div>
};

export {Player};
