import React from 'react';
import classes from './Search.module.css';
import res from '../../mock/mockSearchResults';
import SearchBar from './SearchBar';
import { parseYoutubeItems } from '../YoutubeEmbed/Youtube';
import { YoutubeItem } from '../../util/youtube_types';
import SearchIcon from '../../assets/search_icon.svg';

const Search = () => {
  const items = parseYoutubeItems(res);

  const SearchItem = ({ thumbnails, title, channelTitle }: YoutubeItem) => {
    const thumb = thumbnails.default;
    return (
      <div className={ classes.search__item }>
        <img src={thumb.url} alt="item_thumbnail" />
        <span>{title}</span>
        <span>{channelTitle}</span>
      </div>
    );
  };

  return (
    <div className={classes.search_container}>
      <SearchBar />
      <ul>
        {items.map((item) => {
          return <SearchItem { ...item} />
        })}
      </ul>
    </div>
  );

};

export default Search;