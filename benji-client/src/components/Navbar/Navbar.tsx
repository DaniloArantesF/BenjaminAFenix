import React, { BaseSyntheticEvent } from 'react';
import { useHistory } from 'react-router';
import classes from './Navbar.module.css';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ReactComponent as Logo } from '../../assets/Logo.svg';
import {
  Guild,
  selectDashboard,
  setCurrentGuild,
} from '../../app/dashboardSlice';
import { clearCredentials } from '../../app/authSlice';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const { guilds } = useAppSelector(selectDashboard);
  const history = useHistory();

  const getDiscordAvatar = (
    type = 'user',
    id: string,
    avatarHash: string,
    size = 64
  ) => {
    const baseUrl = 'https://cdn.discordapp.com/';
    const userPath = `avatars/${id}/${avatarHash}.png`;
    const guildPath = `icons/${id}/${avatarHash}.png`;

    if (type === 'user') {
      return baseUrl + userPath + `?size=${size}`;
    } else if (type === 'guild') {
      return baseUrl + guildPath + `?size=${size}`;
    }
  };

  const handleGuildUpdate = (newGuild: Guild) => {
    console.log("Switching guilds")
    dispatch(setCurrentGuild(newGuild));
  };

  /**
   * Clears auth state and local storage
   * Redirects user to login page
   * @param event
   */
  const logout = (event: BaseSyntheticEvent) => {
    localStorage.clear();
    dispatch(clearCredentials());
    history.push('/login');
  }

  return (
    <div className={classes.navbar_container}>
      <div className={classes.logo_container}>
        <Logo />
      </div>
      <section className={classes.guilds_container}>
        {guilds.map((guild, index) => {
          return (
            <div className={classes.guildIcon}
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
        <div
          className={classes.navLink}
          onClick={logout}
        >Logout</div>
      </section>
    </div>
  );
};

export default Navbar;
