import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import { ReactComponent as BackIcon } from '../../assets/back.svg';
import { ReactComponent as SkipIcon } from '../../assets/skip.svg';
import { ReactComponent as PlayIcon } from '../../assets/play.svg';
import { ReactComponent as RepeatIcon } from '../../assets/repeat.svg';
import { ReactComponent as ShuffleIcon } from '../../assets/shuffle.svg';
import { ReactComponent as SoundIcon } from '../../assets/sound.svg';
import { ReactComponent as PauseIcon } from '../../assets/pause.svg';
import classes from './PlayerController.module.css';
import { selectPlayerState, selectStatus } from '../../app/playerSlice';
import { useAppSelector } from '../../app/hooks';
import Slider from '../Slider/Slider';

interface PlayerControllerProps {
  unpausePlayer: () => void;
  pausePlayer: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  setVolume: (vol: number) => void;
}

const PlayerController = (props: PlayerControllerProps) => {
  const {
    unpausePlayer,
    pausePlayer,
    nextTrack,
    prevTrack,
    toggleRepeat,
    toggleShuffle,
    setVolume,
  } = props;
  const status = useAppSelector(selectStatus);

  // Used to blur icons, allowing animations to run again
  const interceptClick = (event: BaseSyntheticEvent, next: () => void) => {
    event.currentTarget.blur();
    next();
  }

  return (
    <>
      <div className={classes.player_container}>
        <button  onClick={(event) => interceptClick(event, toggleShuffle)} >
          <ShuffleIcon/>
        </button>
        <button onClick={(event) => interceptClick(event, prevTrack)}>
          <BackIcon />
        </button>
        {status === 'playing' ? (
          <button onClick={(event) => interceptClick(event, pausePlayer)}>
            <PauseIcon />
          </button>
        ) : (
          <button onClick={(event) => interceptClick(event, unpausePlayer)}>
            <PlayIcon />
          </button>
        )}
        <button onClick={(event) => interceptClick(event, nextTrack)}>
          <SkipIcon />
        </button>
        <button onClick={(event) => interceptClick(event, toggleRepeat)}>
          <RepeatIcon />
        </button>
        <div className={classes.sound_controller}>
          <button>
            <SoundIcon />
          </button>
          <Slider changeCb={setVolume} />
        </div>
      </div>
    </>
  );
};

export default PlayerController;
