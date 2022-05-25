import React, { useRef } from 'react';
import classes from './Search.module.css';
import { ReactComponent as SearchIcon } from '../../../assets/search.svg';
import type { InputHandler } from '../../../types';

type SearchBarProps = {
  inputCallback: InputHandler;
  submitCallback: InputHandler;
  isLoading: boolean;
};

const SearchBar = ({
  inputCallback,
  submitCallback,
  isLoading,
}: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const submitIntercept: InputHandler = (event) => {
    if (inputRef && inputRef.current) {
      if (inputRef.current.value === '') {
        // Input is empty, dont proceed
        return new Promise((res) => res(0));
      }
      inputRef.current.value = '';
      inputRef.current.blur();
    }
    return submitCallback(event);
  };

  return (
    <div
      className={`${classes.searchBar_container} ${
        isLoading && classes.loading
      }`}
    >
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <form onSubmit={submitIntercept}>
        <label>
          <input
            autoComplete={'false'}
            className={classes.search_input}
            placeholder={'Add a song!'}
            onChange={inputCallback}
            ref={inputRef}
          />
        </label>
      </form>
      <SearchIcon onClick={submitIntercept} className={classes.search__icon} />
    </div>
  );
};

export default SearchBar;
