import React from 'react';
import classes from './Youtube.module.css';
import { YoutubeProps, YoutubeItem, ItemsEntity } from '../../types/youtube';

export const parseYoutubeItems = (items: Array<ItemsEntity>): Array<YoutubeItem> => {
  return items.map((item: ItemsEntity) => {
    return {
      channelId: item.snippet.channelId,
      channelTitle: item.snippet.channelTitle,
      description: item.snippet.description,
      id: item.id.videoId,
      publishedAt: item.snippet.publishedAt,
      publishTime: item.snippet.publishTime,
      thumbnails: {
        default: item.snippet.thumbnails.default,
        medium: item.snippet.thumbnails.medium,
        high: item.snippet.thumbnails.high
      },
      title: item.snippet.title,
    }
  });
}

const YoutubeEmbed = ({ embedId }: YoutubeProps) => {
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

export default YoutubeEmbed;