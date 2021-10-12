import classes from './Dashboard.module.css';
import Queue from '../../components/Queue/Queue';
import YoutubeEmbed from '../../components/YoutubeEmbed/YoutubeEmbed';
import Navbar from '../../components/Navbar/Navbar';
import Search from '../../components/Search/Search';
import { useEffect, useState } from 'react';
import { selectItems, setQueue, selectPosition } from '../../app/queueSlice';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import axios, { AxiosResponse } from 'axios';
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
          {channels?.map((channel) => {
            return (
              <div>
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
  const position = useAppSelector(selectPosition);
  const { accessToken } = useAppSelector(selectAuth);
  const [windowWidth, setWindowWidth] = useState<number>();
  const history = useHistory();
  const { socket } = useSocket();
  const { currentGuild, active } = useAppSelector(selectDashboard);

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

  const getUserData = async (accessToken: string) => {
    try {
      //console.info('Fetching user data...');
      const res: AxiosResponse<any> = await axios.get(
        'http://localhost:8000/discord/user',
        {
          params: { accessToken },
        }
      );
      const { id, username, avatar } = res.data;
      return dispatch(setUser({ id, username, avatar }));
    } catch (error) {
      console.error('Error getting user');
    }
  };

  const getUserGuilds = async (accessToken: string) => {
    try {
      //console.info('Fetching user guilds...');
      const res: AxiosResponse<any> = await axios.get(
        'http://localhost:8000/discord/guilds',
        {
          params: { accessToken },
        }
      );

      const guilds: Guild[] = res.data.guilds;
      return dispatch(setUserGuilds(guilds));
    } catch (error) {
      console.error('Error getting user guilds');
    }
  };

  const init = () => {
    console.log('Initializing Client...');
    // Check that token is present
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    // Redirect to login if not
    if (!accessToken || !refreshToken) {
      return history.push('/login');
      return;
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
      getUserData(accessToken);
    }

    // Get user guilds
    getUserGuilds(accessToken);

    // Restore guild from last session
    const guild: Guild = JSON.parse(localStorage.getItem('guild') || '{}');
    if (guild?.id) dispatch(setCurrentGuild(guild));
  };

  const joinChannel = (guildId: string, channelId: string) => {
    if (!guildId || !socket) return;
    socket?.emit('join_channel', { guildId, channelId });
  };

  if (!active)
    return (
      <InactiveGuild
        joinChannel={joinChannel}
      />
    );

  return (
    <div className={classes.dashboard_container}>
      <Navbar />
      <div className={classes.dashboard__body}>
        <section>
          {active && items?.length > 0 && position >= 0 && (
            <YoutubeEmbed embedId={items[position].id} />
          )}
          {!active && ( // Inactive Guild
            <div className={classes.inactive_btn}>
              <Button
                isActive={() => false}
                onClick={() => {
                  console.log('todo');
                }}
              >
                Enable it!
              </Button>
            </div>
          )}
        </section>
        <section>{active && <Queue items={items} />}</section>
        <section>
          <Search />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
