import React from 'react';
import classes from './Navbar.module.css';
import Logo from '../../assets/Logo.svg';

const Navbar = () => {
  return (
    <div className={classes.navbar_container}>
      <div className={classes.logo_container}>
        <Logo />
      </div>
      <section>
        
      </section>
      <div className={classes.navLink}>Help</div>
      <div className={classes.navLink}>Logout</div>
    </div>
  );
};

export default Navbar;
