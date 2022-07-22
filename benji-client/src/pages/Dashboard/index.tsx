import React from 'react';
import classes from './Dashboard.module.css';
import Queue from '../../components/common/Queue/Queue';
import Navbar from '../../components/common/Navbar/Navbar';
import Search from '../../components/common/SearchBar/Search';
import { useEffect, useState } from 'react';
import { selectItems } from '../../app/queueSlice';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  selectAuth,
  setUser,
  setCredentials,
  refreshCredentials,
  setRefreshTimeout,
  selectError,
} from '../../app/authSlice';
import {
  Guild,
  selectDashboard,
  setCurrentGuild,
  setWindowWidth,
} from '../../app/dashboardSlice';
import { setUserGuilds } from '../../app/dashboardSlice';
import { useHistory } from 'react-router';
import useSocket from '../../app/useSocket';
import PlayerController from '../../components/common/PlayerController';
import useDiscordAPI from '../../libs/Discord';
import { selectPlayerState } from '../../app/playerSlice';
import GuildHeader from '../../components/ui/GuildHeader';
import TrackPreview from '../../components/ui/TrackPreview';
import InactiveGuild from '../../components/ui/InactiveGuild';
import ChannelSelection from '../../components/ui/Selection';
import Switch from '../../components/ui/Switch';
import ActionLog from '../../components/ui/ActionLog';

export enum breakpoints {
  LARGE = 1150,
  MEDIUM = 800,
  SMALL = 0,
}

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const {
    expiration,
    // id: userId,
    refreshTimeout,
    token,
  } = useAppSelector(selectAuth);
  const { currentTrack } = useAppSelector(selectPlayerState);
  const { windowWidth } = useAppSelector(selectDashboard);
  const history = useHistory();
  const {
    // socket,
    setTrack,
    requestTrack,
    joinChannel,
    unpausePlayer,
    pausePlayer,
    nextTrack,
    prevTrack,
    toggleRepeat,
    toggleShuffle,
    setVolume,
    leaveChannel,
  } = useSocket();
  const { active } = useAppSelector(selectDashboard);
  const [channelSelectionActive, setChannelSelectionActive] = useState(false);
  const { getUserGuilds } = useDiscordAPI();
  const error = useAppSelector(selectError);
  useEffect(() => {
    if (!token) {
      history.push('/login');
    }
    if (window) {
      // Window resizes should affect the sidebar position
      window.addEventListener('resize', function (event: UIEvent) {
        // fixing window is not defined see https://bit.ly/3k8w4lr
        const win = event.target as Window;
        if (event.target && win.innerWidth !== windowWidth)
          dispatch(setWindowWidth(win.innerWidth));
      });
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Initially set timeout to refresh token before it expires.
   * A new interval will be set when the expiration is updated.
   */
  useEffect(() => {
    if (expiration === 0 || !token) return;
    const expiresIn = expiration - Date.now(); // Time in ms until expiration

    // Refresh right away
    if (expiresIn < 0) {
      return refreshTokens();
    }

    if (!refreshTimeout) {
      const interval = setTimeout(
        refreshTokens,
        expiresIn - 5 * 60 * 1000 // refresh token 5 min before
      );
      dispatch(setRefreshTimeout(interval));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiration]);

  useEffect(() => {
    if (error) {
      history.push(error.redirect_path ?? '/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const init = async () => {
    // Check that token is present
    const token = localStorage.getItem('token');

    // Redirect to login if not
    if (!token) {
      return history.push('/login');
    }

    // Set credentials
    dispatch(setCredentials({ token }));

    // Set user Data
    if (localStorage.getItem('username')) {
      const id = localStorage.getItem('id') ?? '';
      const avatar = localStorage.getItem('avatar') ?? '';
      const username = localStorage.getItem('username')?? '';
      dispatch(setUser({ id, avatar, username }));
    }

    // Get user guilds
    const userGuilds = await getUserGuilds(token);
    dispatch(setUserGuilds(userGuilds));

    // Restore guild from last session
    const lastGuild: Guild = JSON.parse(localStorage.getItem('guild') || '{}');
    if (lastGuild?.id) dispatch(setCurrentGuild(lastGuild));
  };

  const refreshTokens = () => {
    dispatch(refreshCredentials(token));
  };

  if (!active) return <InactiveGuild joinChannel={joinChannel} />;

  return (
    <div className={classes.dashboard_container}>
      <Navbar />
      <div className={classes.dashboard__body}>
        <ChannelSelection
          active={channelSelectionActive}
          setActive={(val: boolean) => setChannelSelectionActive(val)}
          joinChannel={joinChannel}
        />
        <section id={classes.header}>
          <Search requestTrack={requestTrack} />
          <Switch />
        </section>
        <section id={classes.info} className={classes.dashboard__component}>
          <GuildHeader
            switchHandler={() =>
              setChannelSelectionActive(!channelSelectionActive)
            }
            leaveChannel={leaveChannel}
          />
        </section>
        <section id={classes.queue} className={classes.dashboard__component}>
          <Queue items={items} setTrack={setTrack} />
        </section>
        <section
          id={classes.player_controls}
          className={classes.dashboard__component}
        >
          <PlayerController
            unpausePlayer={unpausePlayer}
            pausePlayer={pausePlayer}
            nextTrack={nextTrack}
            prevTrack={prevTrack}
            toggleRepeat={toggleRepeat}
            toggleShuffle={toggleShuffle}
            setVolume={setVolume}
          />
        </section>
        {windowWidth > breakpoints.MEDIUM && (
          <section id={classes.side}>
            <ActionLog />
            {currentTrack && <TrackPreview track={currentTrack} />}
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
