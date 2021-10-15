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

const CurrentlyPlaying = () => {
  const { currentTrack } = useAppSelector(selectPlayerState);
  if (!currentTrack) return <div></div>;

  return (
    <div className={classes.currently_playing}>
      <div className={classes.track__thumbnail}>
        <img src={currentTrack.thumbnail} />
      </div>
      <div className={classes.track__info}>
        <h1>{currentTrack.title}</h1>
        <h2>{currentTrack.channelTitle}</h2>
      </div>
    </div>
  );
};

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

  return (
    <>
      <CurrentlyPlaying />
      <div className={classes.player_container}>
        <button>
          <ShuffleIcon onClick={toggleShuffle} />
        </button>
        <button>
          <BackIcon onClick={prevTrack} />
        </button>
        {status === 'playing' ? (
          <button>
            <PauseIcon onClick={pausePlayer} />
          </button>
        ) : (
          <button>
            <PlayIcon onClick={unpausePlayer} />
          </button>
        )}
        <button>
          <SkipIcon onClick={nextTrack} />
        </button>
        <button>
          <RepeatIcon onClick={toggleRepeat} />
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