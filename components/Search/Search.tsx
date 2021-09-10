import React, { useState } from 'react';
import classes from './Search.module.css';
import SearchBar from './SearchBar';
import { YoutubeItem } from '../../types/youtube';
import type { InputHandler } from '../../types/types';
import Youtube from '../../libs/Youtube';

type SearchProps = {
  youtube: Youtube;
}

const Search = ({ youtube }: SearchProps) => {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<Array<YoutubeItem>>([]);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    setQuery('');
    const data = await youtube.search(query);
    setItems(data || []);
    setLoading(false);
    return 0;
  };

  return (
    <div className={classes.search_container}>
      <SearchBar
        inputCallback={searchInputHandler}
        submitCallback={searchSubmitHandler}
        isLoading={ loading }
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
