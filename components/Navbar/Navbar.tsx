import React from 'react';
import classes from './Navbar.module.css';
import Logo from '../../assets/BenjaminAFenix.svg';

const Navbar = () => {
  return (
    <div className={classes.Navbar_container}>
      <div className={classes.logo_container}>
        <Logo />
      </div>
      <div className={classes.navLink}>Dashboard</div>
      <div className={classes.navLink}>Commands</div>
    </div>
  );
};

export default Navbar;
