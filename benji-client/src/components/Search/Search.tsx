import React, { useState } from 'react';
import classes from './Search.module.css';
import SearchBar from './SearchBar';
import { YoutubeItem } from '../../types/youtube';
import type { InputHandler, Track } from '../../types/types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { pushTrack } from '../../app/queueSlice';
import { getYoutubeItem, searchYoutube } from '../../libs/Youtube';
import { selectAuth } from '../../app/authSlice';

type SearchItemProps = {
  item: YoutubeItem;
  selectItem: (item: YoutubeItem) => void;
};

interface SearchProps {
  requestTrack: (track: Track) => void;
}

const Search = ({ requestTrack }: SearchProps) => {
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<Array<YoutubeItem>>([]);
  const [loading, setLoading] = useState(false);
  const { username } = useAppSelector(selectAuth);

  // search items dont contain some info to construct track
  // fetch new data
  const getTrackFromItem = async (item: YoutubeItem) => {
    const res = await getYoutubeItem(item.id);
    return {
      channelTitle: res.channelTitle,
      duration: res.duration,
      title: res.title,
      id: res.id,
      user: username,
      service: 1,
    };
  };

  const SearchItem = ({ item, selectItem }: SearchItemProps) => {
    const { thumbnails, title, channelTitle } = item;
    const thumb = thumbnails.default;
    return (
      <div className={classes.search__item} onClick={() => selectItem(item)}>
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
    const data = await searchYoutube(query);
    setItems(data || []);
    setLoading(false);
    return 0;
  };

  const selectItem = async (item: YoutubeItem) => {
    const track = await getTrackFromItem(item);
    requestTrack(track);
    resetSearch();
  };

  const resetSearch = () => {
    setItems([]);
  };

  return (
    <div className={classes.search_container}>
      <SearchBar
        inputCallback={searchInputHandler}
        submitCallback={searchSubmitHandler}
        isLoading={loading}
      />
      <ul>
        {items.map((item, index) => {
          return <SearchItem key={index} selectItem={selectItem} item={item} />;
        })}
      </ul>
    </div>
  );
};

export default Search;
