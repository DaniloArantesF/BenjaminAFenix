import classes from './Dashboard.module.css';
import Queue from '../../components/Queue/Queue';
import YoutubeEmbed from '../../components/YoutubeEmbed/YoutubeEmbed';
import Navbar from '../../components/Navbar/Navbar';
import Search from '../../components/Search/Search';
import { useEffect, useState } from 'react';
import { selectItems, selectPosition } from '../../app/queueSlice';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectAuth, setUser, setCredentials } from '../../app/authSlice';
import {
  Channel,
  Guild,
  selectDashboard,
  setCurrentGuild,
} from '../../app/dashboardSlice';
import { setUserGuilds } from '../../app/dashboardSlice';
import { useHistory } from 'react-router';
import useSocket from '../../app/useSocket';
import Button from '../../components/Button/Button';
import { getGuildVoiceChannels } from '../../libs/Discord';
import PlayerController from '../../components/PlayerController';
import { getUserData, getUserGuilds } from '../../libs/Discord';
import { getDiscordAvatar } from '../../libs/Discord';
import { selectPlayerState } from '../../app/playerSlice';

// TODO: manage layouts better
export enum breakpoints {
  LARGE = 1150,
  MEDIUM = 850,
  SMALL = 0,
}

interface InactiveGuildProps {
  joinChannel: (guildId: string, channelId: string) => void;
}

const InactiveGuild = ({ joinChannel }: InactiveGuildProps) => {
  const [channels, setChannels] = useState<Channel[]>();
  const { currentGuild } = useAppSelector(selectDashboard);

  useEffect(() => {
    if (!currentGuild) return;
    getChannels(currentGuild.id);
  }, [currentGuild]);

  const getChannels = async (guildId: string) => {
    const channels = await getGuildVoiceChannels(guildId);
    setChannels(channels);
  };

  return (
    <div className={classes.dashboard_container}>
      <Navbar />
      <div className={classes.dashboard__body}>
        <section>
          {channels?.map((channel, index) => {
            return (
              <div key={index}>
                <Button
                  isActive={() => true}
                  onClick={() =>
                    joinChannel(currentGuild?.id || '', channel.id)
                  }
                >
                  {channel.name}
                </Button>
              </div>
            );
          })}
        </section>
        <section></section>
        <section></section>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const { accessToken } = useAppSelector(selectAuth);
  const { currentTrack } = useAppSelector(selectPlayerState);
  const [windowWidth, setWindowWidth] = useState<number>();
  const history = useHistory();
  const {
    socket,
    requestTrack,
    unpausePlayer,
    pausePlayer,
    nextTrack,
    prevTrack,
    toggleRepeat,
    toggleShuffle,
    setVolume,
  } = useSocket();
  const { active, currentGuild } = useAppSelector(selectDashboard);

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
    const guild: Guild = JSON.parse(localStorage.getItem('guild') || '{}');
    if (guild?.id) dispatch(setCurrentGuild(guild));
  };

  const joinChannel = (guildId: string, channelId: string) => {
    if (!guildId || !socket) return;
    socket?.emit('join_channel', { guildId, channelId });
  };

  if (!active) return <InactiveGuild joinChannel={joinChannel} />;

  const CurrentlyPlaying = () => {
    if (!currentTrack) return null;

    return (
      <div className={classes.currently_playing}>
        <div className={classes.track__thumbnail}>
          <img
            src={currentTrack.thumbnail}
          />
        </div>
        <div className={classes.track__info}>
          <h1>{currentTrack.title}</h1>
          <h2>
            {currentTrack.channelTitle}
          </h2>
        </div>
      </div>
    );
  };

  const GuildHeader = () => {
    if (!currentGuild) return null;
    const onlineCount = 5;
    const guild = currentGuild;
    const uptime = '1:45:33';
    return (
      <div className={classes.guild_header}>
        {guild.icon ? (
          <img
            src={getDiscordAvatar('guild', guild.id, guild.icon)}
            alt={guild.name}
          />
        ) : (
          <h2>{guild.name.substring(0, 1)}</h2>
        )}

        <div className={classes.guild_header__body}>
          <h1>{guild.name}</h1>
          <h2>{onlineCount} online</h2>
          <h2>{uptime}</h2>
        </div>

        <div className={classes.guild_header__btns}>
          <Button isActive={() => true} action={() => console.log('click')}>
            Switch Channel
          </Button>

          <Button isActive={() => true} action={() => console.log('click')}>
            Leave
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className={classes.dashboard_container}>
      <Navbar />
      <div className={classes.dashboard__body}>
        <section id={classes.info} className={classes.dashboard__component}>
          <GuildHeader />
        </section>
        <section id={classes.queue} className={classes.dashboard__component}>
          <Queue items={items} />
        </section>
        <section id={classes.search} className={classes.dashboard__component}>
          <Search requestTrack={requestTrack} />
        </section>
        <section id={classes.preview} className={classes.dashboard__component}>
          <CurrentlyPlaying />
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
      </div>
    </div>
  );
};

export default Dashboard;
