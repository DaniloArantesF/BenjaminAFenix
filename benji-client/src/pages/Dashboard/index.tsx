import React, { useRef } from 'react';
import classes from './Dashboard.module.css';
import Queue from '../../components/common/Queue/Queue';
import Navbar from '../../components/common/Navbar/Navbar';
import Search from '../../components/common/SearchBar/Search';
import { useEffect, useState } from 'react';
import {
  selectItems,
  pushTrack,
  selectPosition,
  setPosition,
} from '../../app/queueSlice';
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
// import useSocket from '../../app/useSocket';
import PlayerController from '../../components/common/PlayerController';
import useDiscordAPI from '../../libs/Discord';
import { updatePlaybackState, selectPlayerState } from '../../app/playerSlice';
import GuildHeader from '../../components/ui/GuildHeader';
import TrackPreview from '../../components/ui/TrackPreview';
import InactiveGuild from '../../components/ui/InactiveGuild';
import ChannelSelection from '../../components/ui/Selection';
import Switch from '../../components/ui/Switch';
import ActionLog from '../../components/ui/ActionLog';
import YoutubeEmbed from '../../components/common/YoutubeEmbed';

export enum breakpoints {
  LARGE = 1150,
  MEDIUM = 800,
  SMALL = 0,
}

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const position = useAppSelector(selectPosition);
  const {
    expiration,
    // id: userId,
    refreshTimeout,
    token,
  } = useAppSelector(selectAuth);
  const playerState = useAppSelector(selectPlayerState);
  const { windowWidth } = useAppSelector(selectDashboard);
  const history = useHistory();

  const { active } = useAppSelector(selectDashboard);
  // sets the channel selection modal
  const [channelSelectionActive, setChannelSelectionActive] = useState(false);
  const { getUserGuilds } = useDiscordAPI();
  const error = useAppSelector(selectError);
  const isInitialized = useRef(false);
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

    if (!isInitialized.current) {
      isInitialized.current = true;
      init();
    }
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
      const username = localStorage.getItem('username') ?? '';
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

  // if (!active) return <InactiveGuild joinChannel={joinChannel} />;

  return (
    <div className={classes.dashboard_container}>
      <Navbar />
      <div className={classes.dashboard__body}>
        {/* <ChannelSelection
          active={channelSelectionActive}
          setActive={(val: boolean) => setChannelSelectionActive(val)}
          joinChannel={joinChannel}
        /> */}
        <section id={classes.header}>
          <Search requestTrack={(track) => dispatch(pushTrack(track))} />
          <Switch />
        </section>
        <section id={classes.video} className={classes.dashboard__component}>
          {/* <GuildHeader
            switchHandler={() =>
              setChannelSelectionActive(!channelSelectionActive)
            }
            leaveChannel={leaveChannel}
          /> */}
          <YoutubeEmbed embedId={items.length ? items[position].id : ''} />
        </section>
        <section id={classes.queue} className={classes.dashboard__component}>
          <Queue
            items={items}
            setTrack={(pos: number) => dispatch(setPosition(pos))}
          />
        </section>
        <section
          id={classes.player_controls}
          className={classes.dashboard__component}
        >
          <PlayerController />
        </section>
        {/* {windowWidth > breakpoints.MEDIUM && (
          <section id={classes.side}>
            <ActionLog />
            {currentTrack && <TrackPreview track={currentTrack} />}
          </section>
        )} */}
      </div>
    </div>
  );
};

export default Dashboard;
