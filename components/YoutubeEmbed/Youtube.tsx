import React, { useState } from 'react';
import classes from './Youtube.module.css';
import { YoutubeProps, YoutubeItem, ItemsEntity } from '../../types/youtube';
import YouTube from 'react-youtube';
import { YouTubePlayer } from 'youtube-player/dist/types';
const AUTOPLAY = 1;

const YoutubeEmbed = ({ embedId }: YoutubeProps) => {
  const [player, setPlayer] = useState<YouTubePlayer>();

  const onReady = (event: { target: YouTubePlayer }) => {
    setPlayer(event.target);
  };
  
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
