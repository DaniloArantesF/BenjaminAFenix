import React, { useEffect, useRef, useState } from 'react';
import classes from './YoutubeEmbed.module.css';
import { YoutubeProps } from '../../../types/youtube';
import Youtube, { YouTubeEvent } from 'react-youtube';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  selectPlayerState,
  selectStatus,
  updatePlaybackState,
} from '../../../app/playerSlice';
import PlayerStates from 'youtube-player/dist/constants/PlayerStates';
import { next, previous, selectPosition, selectQueueLength } from '../../../app/queueSlice';

const YoutubeEmbed = ({ embedId }: YoutubeProps) => {
  const qLength = useAppSelector(selectQueueLength);
  const position = useAppSelector(selectPosition);
  const dispatch = useAppDispatch();
  const playing = useAppSelector(selectStatus);
  const playerRef = useRef<Youtube>(null);
  const [youtubePlayerState, setYoutubePlayerState] = useState<
    'playing' | 'idle' | 'paused'
  >('idle');
  const playerStoreState = useAppSelector(selectPlayerState);

  useEffect(() => {
    // Add media key handlers
    document.addEventListener('keydown', handleMediaKeys);
    return () => {
      document.removeEventListener('keydown', handleMediaKeys);
    }
  }, []);

  // TODO: needs some work ?
  function handleMediaKeys(event: KeyboardEvent) {
    if (event.key === 'MediaPlayPause' && qLength > 0) {
      dispatch(updatePlaybackState({ status: playing === 'playing' ? 'paused' : 'playing' }));
    } else if (event.key === 'MediaTrackPrevious' && position > 0) {
      dispatch(previous());
    } else if (event.key === 'MediaTrackNext' && qLength - position > 1) {
      dispatch(next());
    }
  }

  // Updates coming from player store
  useEffect(() => {
    updateYoutubePlayer();
  }, [playing]);

  function updateYoutubePlayer() {
    if (playing === 'playing' && youtubePlayerState !== 'playing') {
      playerRef.current?.getInternalPlayer()?.playVideo();
    } else if (playing === 'paused' && youtubePlayerState !== 'paused') {
      playerRef.current?.getInternalPlayer()?.pauseVideo();
    }
    else if (playing === 'idle') {
      playerRef.current?.getInternalPlayer()?.pauseVideo();
      setYoutubePlayerState('idle');
    }
  }

  // Event handler for youtube player api
  // Updates the internal state of this component to match iframe
  function updateComponentState(state: PlayerStates) {
    switch (state) {
      case PlayerStates.PLAYING:
        setYoutubePlayerState('playing');
        break;
      case PlayerStates.PAUSED:
        setYoutubePlayerState('paused');
        break;
      default:
        setYoutubePlayerState('idle');
        break;
    }
  }

  // Update player store based on iframe events
  useEffect(() => {
    if (youtubePlayerState !== 'idle') {
      dispatch(
        updatePlaybackState({ ...playerStoreState, status: youtubePlayerState })
      );
    } else {
      // Player updated from changing track
      // Sync it with store state
      if (playerStoreState.status === 'playing') {
        playerRef.current
          ?.getInternalPlayer()
          ?.setVolume(playerStoreState.volume * 100);
        playerRef.current?.getInternalPlayer()?.playVideo();
      }
    }
  }, [youtubePlayerState]);

  // update volume of youtube player
  useEffect(() => {
    playerRef.current
      ?.getInternalPlayer()
      ?.setVolume(playerStoreState.volume * 100);
  }, [playerStoreState.volume]);


  function handleEnd(event: YouTubeEvent) {
    // TODO: handle repeat
    dispatch(next());
    if (position + 1 >= qLength) {
      dispatch(updatePlaybackState({ progress: 0, status: 'idle', }))
    } else {
      setYoutubePlayerState('playing');
    }
  }

  return (
    <div className={classes.video_container}>
      {embedId && (
        <Youtube
          ref={playerRef}
          videoId={embedId}
          opts={{
            playerVars: {
              autoplay: 0,
              enablejsapi: 1,
              modestbranding: 1,
              controls: 1,
              playsinline: 1,
            },
          }}
          onStateChange={({ data }) => updateComponentState(data)}
          onEnd={handleEnd}
        />
      )}
    </div>
  );
};

export default YoutubeEmbed;
