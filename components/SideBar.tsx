import React from 'react';
import classes from '../styles/SideBar.module.css';
import Logo from '../assets/BenjaminAFenix.svg';

const SideBar = () => {
  return (
    <div className={classes.sideBar_container}>
      <div className={classes.logo_container} ><Logo/></div>
      <div className={ classes.navLink }>Dashboard</div>
      <div className={ classes.navLink }>Commands</div>
    </div>
  );
};

export default SideBar;