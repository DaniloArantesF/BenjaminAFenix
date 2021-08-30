import React from 'react';
import classes from '../styles/Youtube.module.css';

type YoutubeProps = {
  embedId: string;
}

const Youtube = ({ embedId }: YoutubeProps) => {
  return (
    <div className={ classes.video_container }>
      <iframe
        src={`https://www.youtube.com/embed/${embedId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embed"
      />
    </div>
  );
};

export default Youtube;