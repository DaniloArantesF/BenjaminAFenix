import React, { useEffect, useRef, useState } from 'react';
import classes from './YoutubeEmbed.module.css';
import { YoutubeProps } from '../../../types/youtube';
import Youtube from 'react-youtube';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  selectPlayerState,
  selectStatus,
  updatePlaybackState,
} from '../../../app/playerSlice';
import PlayerStates from 'youtube-player/dist/constants/PlayerStates';

const YoutubeEmbed = ({ embedId }: YoutubeProps) => {
  const dispatch = useAppDispatch();
  const playing = useAppSelector(selectStatus);
  const playerRef = useRef<Youtube>(null);
  const [youtubePlayerState, setYoutubePlayerState] = useState<
    'playing' | 'idle' | 'paused'
  >('idle');
  const playerStoreState = useAppSelector(selectPlayerState);

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
              controls: 0,
              playsinline: 1,
            },
          }}
          onStateChange={({ data }) => updateComponentState(data)}
        />
      )}
    </div>
  );
};

export default YoutubeEmbed;
