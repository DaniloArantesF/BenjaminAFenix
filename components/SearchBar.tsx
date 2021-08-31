import React from 'react';
import classes from '../styles/SearchBar.module.css';
import Logo from '../assets/BenjaminAFenix.svg';

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
    </div>
  );
};

export default SearchBar;