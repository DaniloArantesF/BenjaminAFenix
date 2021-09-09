import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import classes from './Search.module.css';
import SearchBar from './SearchBar';
import { parseYoutubeItems } from '../YoutubeEmbed/Youtube';
import { YoutubeItem } from '../../types/youtube';
import SearchIcon from '../../assets/search_icon.svg';
import axios from 'axios';
import type { InputHandler } from '../../types/types';

const Search = () => {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);

  const SearchItem = ({ thumbnails, title, channelTitle }: YoutubeItem) => {
    const thumb = thumbnails.default;
    return (
      <div className={classes.search__item}>
        <img src={thumb.url} alt="item_thumbnail" />
        <span>{title}</span>
        <span>{channelTitle}</span>
      </div>
    );
  };

  const searchInputHandler: InputHandler = async (event) => {
    setQuery(event.target.value);
    return 0;
  };
  const searchSubmitHandler: InputHandler = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.get(
        `api/youtube`,
        {
          params: {
            value: query,
            type: 'video'
          }
        }
      );
      setItems(data.items);
    } catch (error) {
      console.error(error);
    }
    return 0;
  };

  return (
    <div className={classes.search_container}>
      <SearchBar
        inputCallback={searchInputHandler}
        submitCallback={searchSubmitHandler}
      />
      <ul>
        {items.map((item, index) => {
          return <SearchItem key={index} {...item} />;
        })}
      </ul>
    </div>
  );
};

export default Search;
