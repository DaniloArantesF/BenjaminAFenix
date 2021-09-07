import React from 'react';
import classes from './Search.module.css';
import Logo from '../../assets/BenjaminAFenix.svg';
import SearchIcon from '../../assets/search_icon.svg';

const SearchBar = () => {
  return (
    <div className={classes.searchBar_container}>
      <form>
        <label>
          <input autoComplete={"false"} className={classes.search_input}
            placeholder={ "Search..." }
          />
        </label>
      </form>
      <SearchIcon className={ classes.search__icon } />
    </div>
  );
};

export default SearchBar;