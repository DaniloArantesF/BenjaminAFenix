import React, { useEffect, useState } from 'react';
import { ReactComponent as BackIcon } from '../../assets/back.svg';
import { ReactComponent as SkipIcon } from '../../assets/skip.svg';
import { ReactComponent as PlayIcon } from '../../assets/play.svg';
import { ReactComponent as RepeatIcon } from '../../assets/repeat.svg';
import { ReactComponent as ShuffleIcon } from '../../assets/shuffle.svg';
import { ReactComponent as SoundIcon } from '../../assets/sound.svg';
import { ReactComponent as PauseIcon } from '../../assets/pause.svg';
import classes from './PlayerController.module.css';
import { selectStatus } from '../../app/playerSlice';
import { useAppSelector } from '../../app/hooks';
import Slider from '../Slider/Slider';

const PlayerController = () => {
  const status = useAppSelector(selectStatus);
  return (
    <div className={classes.player_container}>
      <ShuffleIcon />
      <BackIcon />
      {status === 'playing' ? <PauseIcon /> : <PlayIcon />}
      <SkipIcon />
      <RepeatIcon />
      <div className={classes.sound_controller}>
        <SoundIcon />
        <Slider />
      </div>
    </div>
  );
};

export default PlayerController;