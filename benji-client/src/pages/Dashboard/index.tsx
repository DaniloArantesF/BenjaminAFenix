import classes from './Dashboard.module.css';
import Queue from '../../components/Queue/Queue';
import YoutubeEmbed from '../../components/YoutubeEmbed/YoutubeEmbed';
import Navbar from '../../components/Navbar/Navbar';
import Search from '../../components/Search/Search';
import { useEffect, useRef, useState } from 'react';
import { selectItems, selectPosition } from '../../app/queueSlice';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  selectAuth,
  setUser,
  setCredentials,
  refreshCredentials,
  setRefreshTimeout,
} from '../../app/authSlice';
import {
  Guild,
  selectDashboard,
  setCurrentGuild,
} from '../../app/dashboardSlice';
import { setUserGuilds } from '../../app/dashboardSlice';
import { useHistory } from 'react-router';
import useSocket from '../../app/useSocket';
import PlayerController from '../../components/PlayerController';
import { getUserData, getUserGuilds } from '../../libs/Discord';
import { getDiscordAvatar } from '../../libs/Discord';
import { selectPlayerState } from '../../app/playerSlice';
import GuildHeader from '../../components/GuildHeader';
import TrackPreview from '../../components/TrackPreview';
import InactiveGuild from '../../components/InactiveGuild';
import ChannelSelection from '../../components/Selection';

// TODO: manage layouts better
export enum breakpoints {
  LARGE = 1150,
  MEDIUM = 850,
  SMALL = 0,
}

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const {
    accessToken,
    refreshToken,
    expiration,
    id: userId,
  } = useAppSelector(selectAuth);
  const { currentTrack } = useAppSelector(selectPlayerState);
  const [windowWidth, setWindowWidth] = useState<number>();
  const history = useHistory();
  const {
    socket,
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
  const { active, currentGuild, channels } = useAppSelector(selectDashboard);
  const [channelSelectionActive, setChannelSelectionActive] = useState(false);
  const selectionRef = useRef(null);

  useEffect(() => {
    if (!accessToken) {
      history.push('/login');
    }
    if (window) {
      // Window resizes should affect the sidebar position
      window.addEventListener('resize', function (event: UIEvent) {
        // fixing window is not defined see https://bit.ly/3k8w4lr
        const win = event.target as Window;
        if (event.target && win.innerWidth !== windowWidth)
          setWindowWidth(win.innerWidth);
      });
    }

    init();
  }, []);

  /**
   * Initially set timeout to refresh token before it expires.
   * A new interval will be set when the expiration is updated.
   */
  useEffect(() => {
    const expiresIn = expiration - Date.now(); // Time in ms until expiration

    const refresh = () => {
      //console.log('Refreshing tokens...');
      dispatch(refreshCredentials(refreshToken));
    };

    // Refresh right away
    if (expiresIn < 0) {
      return refresh();
    }
    const interval = setTimeout(
      refresh,
      expiresIn - 5 * 60 * 1000 // refresh token 5 min before
    );
    dispatch(setRefreshTimeout(interval));
  }, [expiration]);

  const init = async () => {
    // Check that token is present
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    // Redirect to login if not
    if (!accessToken || !refreshToken) {
      return history.push('/login');
    }

    // Set credentials
    dispatch(setCredentials({ accessToken, refreshToken }));

    // Set user Data
    if (localStorage.getItem('username')) {
      const id = localStorage.getItem('id');
      const avatar = localStorage.getItem('avatar');
      const username = localStorage.getItem('username');
      dispatch(setUser({ id, avatar, username }));
    } else {
      const userData = await getUserData(accessToken);
      dispatch(setUser(userData));
    }

    // Get user guilds
    const userGuilds = await getUserGuilds(accessToken);
    dispatch(setUserGuilds(userGuilds));

    // Restore guild from last session
    const lastGuild: Guild = JSON.parse(localStorage.getItem('guild') || '{}');
    if (lastGuild?.id) dispatch(setCurrentGuild(lastGuild));
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
        <section id={classes.info} className={classes.dashboard__component}>
          <GuildHeader
            switchHandler={() =>
              setChannelSelectionActive(!channelSelectionActive)
            }
            leaveChannel={leaveChannel}
          />
        </section>
        <section id={classes.queue} className={classes.dashboard__component}>
          <Queue items={items} />
        </section>
        <Search requestTrack={requestTrack} />
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
        <section id={classes.preview} className={classes.dashboard__component}>
          {currentTrack && <TrackPreview track={currentTrack} />}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
