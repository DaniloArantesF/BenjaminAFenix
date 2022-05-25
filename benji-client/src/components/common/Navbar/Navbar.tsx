import React, {
  BaseSyntheticEvent,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import { useHistory } from 'react-router';
import classes from './Navbar.module.css';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { ReactComponent as Logo } from '../../../assets/Logo.svg';
import { ReactComponent as MenuIcon } from '../../../assets/menu.svg';
import {
  Guild,
  selectDashboard,
  setCurrentGuild,
  setNavbarVisibility,
} from '../../../app/dashboardSlice';
import { clearCredentials } from '../../../app/authSlice';
import { getDiscordAvatar } from '../../../libs/Discord';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const {
    guilds,
    currentGuild,
    windowWidth,
    navbar: isVisible,
  } = useAppSelector(selectDashboard);
  const history = useHistory();
  const navbarRef = useRef<HTMLDivElement>(null);

  // When navbar becomes visible, add event listener to
  // check for clicks outside navbar and dismiss it.
  useEffect(() => {
    if (windowWidth > 1150) return;
    if (isVisible) {
      window.addEventListener('click', handleWindowClick);
    } else {
      window.removeEventListener('click', handleWindowClick);
    }
    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, windowWidth]);

  function handleWindowClick(event: MouseEvent) {
    if (!navbarRef.current) return;
    const { clientX: clickX, clientY: clickY } = event;
    const { top, right, bottom, left } =
      navbarRef.current.getBoundingClientRect();

    if (clickX < left || clickX > right || clickY < top || clickY > bottom) {
      dispatch(setNavbarVisibility(false));
    }
  }

  /**
   * Updates the current guild
   * Called when a user clicks on a guild in the navbar
   * @param newGuild Guild to be joined
   */
  const handleGuildUpdate = (newGuild: Guild) => {
    dispatch(setCurrentGuild(newGuild));
  };

  /**
   * Clears auth state and local storage
   * Redirects user to login page
   * @param event
   */
  const logout = (event: BaseSyntheticEvent) => {
    dispatch(clearCredentials());
    history.push('/login');
  };

  return (
    <>
      {windowWidth < 1150 && (
        <div
          className={classes.menu_btn}
          onClick={() => dispatch(setNavbarVisibility(true))}
        >
          <MenuIcon />
        </div>
      )}
      <div
        ref={navbarRef}
        className={`${classes.navbar_container} ${
          isVisible ? classes.active : classes.hidden
        }`}
      >
        <div className={classes.logo_container}>
          <Logo />
        </div>
        <section className={classes.guilds_container}>
          {guilds.map((guild, index) => {
            return (
              <div
                className={`${classes.guildIcon} ${
                  guild.id === currentGuild?.id ? classes.guildActive : ''
                }`}
                key={index}
                onClick={() => handleGuildUpdate(guild)}
              >
                {guild.icon ? (
                  <img
                    src={getDiscordAvatar('guild', guild.id, guild.icon)}
                    alt={guild.name}
                  />
                ) : (
                  <h2>{guild.name.substring(0, 1)}</h2>
                )}
              </div>
            );
          })}
        </section>
        <section className={classes.navbar__footer}>
          <div className={classes.navLink}>Help</div>
          <div className={classes.navLink} onClick={logout}>
            Logout
          </div>
        </section>
      </div>
    </>
  );
};

export default Navbar;
