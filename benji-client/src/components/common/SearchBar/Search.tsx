import React, { useEffect, useRef, useState } from "react";
import classes from "./Search.module.css";
import SearchBar from "./SearchBar";
import { YoutubeItem } from "../../../types/youtube";
import type { InputHandler, Track } from "../../../types";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getYoutubeItem, searchYoutube } from "../../../libs/Youtube";
import { selectAuth } from "../../../app/authSlice";

type SearchItemProps = {
  item: YoutubeItem;
  selectItem: (item: YoutubeItem) => void;
};

interface SearchProps {
  requestTrack: (track: Track) => void;
}

const Search = ({ requestTrack }: SearchProps) => {
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Array<YoutubeItem>>([]);
  const [loading, setLoading] = useState(false);
  const { username } = useAppSelector(selectAuth);
  const searchRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLUListElement>(null);

  /**
   * This function is called for every click in the page.
   * If search is active and click was outside search component
   * dismiss items. otherwise do nothing
   */
  const checkDismiss = (event: MouseEvent) => {
    const { x: clickX, y: clickY } = event;
    const { y: searchBarY } = searchRef.current?.getBoundingClientRect() || {
      x: 0,
      y: 0,
      width: 0,
    };
    const {
      x: resultsX,
      y: resultsY,
      height: resultsHeight,
      width: resultsWidth,
    } = itemsRef.current?.getBoundingClientRect() || {
      x: 0,
      y: 0,
      height: 0,
      width: 0,
    };
    const lowerY = searchBarY;
    const upperY = resultsY + resultsHeight;
    const lowerX = resultsX;
    const upperX = resultsX + resultsWidth;

    const click = (clickX: number, clickY: number) => {
      function isWithin(
        lowerX: number,
        upperX: number,
        lowerY: number,
        upperY: number
      ) {
        return (
          clickX > lowerX &&
          clickX < upperX &&
          clickY > lowerY &&
          clickY < upperY
        );
      }
      return { isWithin };
    };

    if (!click(clickX, clickY).isWithin(lowerX, upperX, lowerY, upperY)) {
      setItems([]);
    }
  };

  useEffect(() => {
    window.addEventListener("click", checkDismiss);

    return () => {
      window.removeEventListener("click", checkDismiss);
    };
  }, []);

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
      thumbnail: res.thumbnails.high.url,
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
    setQuery("");
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
    <div ref={searchRef} className={classes.search_container}>
      <SearchBar
        inputCallback={searchInputHandler}
        submitCallback={searchSubmitHandler}
        isLoading={loading}
      />
      <ul ref={itemsRef}>
        {items.map((item, index) => {
          return <SearchItem key={index} selectItem={selectItem} item={item} />;
        })}
      </ul>
    </div>
  );
};

export default Search;
