import React, { useEffect, useState } from 'react';
import classes from './Youtube.module.css';
import { YoutubeProps, YoutubeItem, ItemsEntity } from '../../types/youtube';
import YouTube from 'react-youtube';
import { YouTubePlayer } from 'youtube-player/dist/types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectStatus} from '../Player/playerSlice';
const AUTOPLAY = 0;

const YoutubeEmbed = ({ embedId }: YoutubeProps) => {
  const dispatch = useAppDispatch();
  const [player, setPlayer] = useState<YouTubePlayer>();
  const playing = useAppSelector(selectStatus);

  const onReady = (event: { target: YouTubePlayer }) => {
    setPlayer(event.target);
  };

  useEffect(() => {
    if (player) {
      playing === 'playing' ? player.playVideo() : player.pauseVideo();
    }
  }, [ playing ]);

  return (
    <div className={classes.video_container}>
      <YouTube
        videoId={embedId}
        opts={{
          playerVars: {
            autoplay: AUTOPLAY,
          },
        }}
        onReady={ onReady }
      />
    </div>
  );
};

export default YoutubeEmbed;
