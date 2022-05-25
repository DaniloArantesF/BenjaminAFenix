import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import {
  selectTheme,
  setTheme as setAppTheme,
} from '../../../app/dashboardSlice';
import classes from './Switch.module.css';
import { ReactComponent as LightIcon } from '../../../assets/light_mode.svg';
import { ReactComponent as DarkIcon } from '../../../assets/dark_mode.svg';

const Switch = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    dispatch(setAppTheme({ theme: newTheme }));
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className={classes.switch_container}>
      <label
        className={classes.switch}
        htmlFor="checkbox"
        onClick={toggleTheme}
      >
        <input type="checkbox" id="switch_checkbox" />
        <div className={`${classes.slider} ${classes[theme]}`}>
          {theme === 'dark' ? <DarkIcon /> : <LightIcon />}
        </div>
      </label>
    </div>
  );
};

export default Switch;
