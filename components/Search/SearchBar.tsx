import React from 'react';
import classes from './Search.module.css';
import Logo from '../../assets/BenjaminAFenix.svg';
import SearchIcon from '../../assets/search_icon.svg';
import type { InputHandler } from '../../types/types';

type SearchBarProps = {
  inputCallback: InputHandler,
  submitCallback: InputHandler,
}

const SearchBar = ({ inputCallback, submitCallback }: SearchBarProps) => {

  return (
    <div className={classes.searchBar_container}>
      <form onSubmit={ submitCallback }>
        <label>
          <input autoComplete={"false"} className={classes.search_input}
            placeholder={"Search..."}
            onChange={ inputCallback }
          />
        </label>
      </form>
      <SearchIcon className={ classes.search__icon } />
    </div>
  );
};

export default SearchBar;