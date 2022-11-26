import React, { BaseSyntheticEvent, useEffect } from 'react';
import { ReactComponent as BackIcon } from '../../../assets/back.svg';
import { ReactComponent as SkipIcon } from '../../../assets/skip.svg';
import { ReactComponent as PlayIcon } from '../../../assets/play.svg';
import { ReactComponent as RepeatIcon } from '../../../assets/repeat.svg';
import { ReactComponent as ShuffleIcon } from '../../../assets/shuffle.svg';
import { ReactComponent as SoundIcon } from '../../../assets/sound.svg';
import { ReactComponent as PauseIcon } from '../../../assets/pause.svg';
import classes from './PlayerController.module.css';
import { selectStatus, updatePlaybackState } from '../../../app/playerSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import Slider from '../../ui/Slider/Slider';
import {
  next,
  previous,
  selectPosition,
  selectQueueLength,
  selectRepeat,
  selectShuffle,
} from '../../../app/queueSlice';

const PlayerController: React.FC = (props) => {
  const qLength = useAppSelector(selectQueueLength);
  const position = useAppSelector(selectPosition);
  const status = useAppSelector(selectStatus);
  const shuffle = useAppSelector(selectShuffle);
  const repeat = useAppSelector(selectRepeat);
  const dispatch = useAppDispatch();

  // Used to blur icons, allowing animations to run again
  const interceptClick = (event: BaseSyntheticEvent, next: () => void) => {
    event.currentTarget.blur();
    next();
  };

  function resumePlayer() {
    dispatch(updatePlaybackState({ status: 'playing' }));
  }
  function pausePlayer() {
    dispatch(updatePlaybackState({ status: 'paused' }));
  }

  function nextTrack() {
    dispatch(next());
  }

  function prevTrack() {
    dispatch(previous());
  }

  function toggleRepeat() {
    console.log('todo');
  }

  function toggleShuffle() {
    console.log('todo');
  }

  function setVolume(value: number) {
    dispatch(updatePlaybackState({ volume: value / 100 }));
  }

  return (
    <div className={classes.player_container}>
      <button
        id="shuffle"
        className={shuffle ? classes.btn_active : classes.btn_inactive}
        onClick={(event) => interceptClick(event, toggleShuffle)}
      >
        <ShuffleIcon />
      </button>
      <button
        id="back"
        className={position == 0 ? classes.btn_inactive : ''}
        onClick={(event) => position > 0 && interceptClick(event, prevTrack)}
      >
        <BackIcon />
      </button>
      {status === 'playing' ? (
        <button
          id="pause"
          onClick={(event) => interceptClick(event, pausePlayer)}
        >
          <PauseIcon />
        </button>
      ) : (
        <button
          id="play"
          onClick={(event) => interceptClick(event, resumePlayer)}
        >
          <PlayIcon />
        </button>
      )}
      <button
        id="skip"
        className={position == qLength - 1 ? classes.btn_inactive : ''}
        onClick={(event) =>
          position < qLength - 1 && interceptClick(event, nextTrack)
        }
      >
        <SkipIcon />
      </button>
      <button
        id="repeat"
        className={repeat ? classes.btn_active : classes.btn_inactive}
        onClick={(event) => interceptClick(event, toggleRepeat)}
      >
        <RepeatIcon />
      </button>
      <div className={classes.sound_controller}>
        <button>
          <SoundIcon />
        </button>
        <Slider changeCb={setVolume} />
      </div>
    </div>
  );
};

export default PlayerController;
