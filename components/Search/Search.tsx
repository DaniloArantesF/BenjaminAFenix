import React, { useState } from 'react';
import classes from './Search.module.css';
import SearchBar from './SearchBar';
import { YoutubeItem } from '../../types/youtube';
import type { InputHandler, Track } from '../../types/types';
import Youtube from '../../libs/Youtube';
import { useAppDispatch } from '../../app/hooks';
import { pushTrack } from '../Queue/queueSlice';

type SearchProps = {
  youtube: Youtube;
};

type SearchItemProps = {
  item: YoutubeItem;
  selectItem: (item: YoutubeItem) => void;
};

const Search = ({ youtube }: SearchProps) => {
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<Array<YoutubeItem>>([]);
  const [loading, setLoading] = useState(false);

  // search items dont contain some info to construct track
  // fetch new data
  const getTrackFromItem = async (item: YoutubeItem) => {
    const res = await youtube.getItemFromId(item.id);
    return {
      author: res.channelTitle,
      duration: res.duration,
      title: res.title,
      id: res.id,
      user: 'gepeto420',
      service: 1,
    };
  };

  const SearchItem = ({ item, selectItem }: SearchItemProps) => {
    const { thumbnails, title, channelTitle } = item;
    const thumb = thumbnails.default;
    return (
      <div
        className={classes.search__item}
        onClick={() => selectItem(item)}
      >
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

  const selectItem = async (item: YoutubeItem) => {
    const track = await getTrackFromItem(item);
    console.log(track);
    dispatch(pushTrack(track));
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
