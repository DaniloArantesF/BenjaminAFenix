import classes from './Dashboard.module.css';
import Queue from '../../components/Queue/Queue';
import YoutubeEmbed from '../../components/YoutubeEmbed/Youtube';
import Navbar from '../../components/Navbar/Navbar';
import Search from '../../components/Search/Search';
import { useEffect, useState } from 'react';
import Youtube from '../../libs/Youtube';
import { selectItems, setQueue, selectPosition } from '../../app/queueSlice';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import axios, { AxiosResponse } from 'axios';
import { selectAuth, setUser, setCredentials } from '../../app/authSlice';
import { Guild, setCurrentGuild } from '../../app/dashboardSlice';
import { setUserGuilds } from '../../app/dashboardSlice';
import { useHistory } from 'react-router';
import useSocket from '../../app/useSocket';
import Button from '../../components/Button/Button';

// TODO: manage layouts better
export enum breakpoints {
  LARGE = 1150,
  MEDIUM = 850,
  SMALL = 0,
}

const Dashboard = () => {
  const [youtube, setYoutube] = useState(
    new Youtube(process.env.NEXT_PUBLIC_YOUTUBE_KEY || '')
  );
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const position = useAppSelector(selectPosition);
  const { accessToken } = useAppSelector(selectAuth);
  const [windowWidth, setWindowWidth] = useState<number>();
  const [active, setActive] = useState(false);
  const history = useHistory();
  const socket = useSocket();

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

  return (
    <div className={classes.dashboard_container}>
      <Navbar />
      <div className={classes.dashboard__body}>
        <section>
          {active && items?.length > 0 && position >= 0 && (
            <YoutubeEmbed embedId={items[position].id} />
          )}
          {!active && (
            <div className={classes.inactive_btn}>
              <Button isActive={() => false} onClick={ () => { console.log("todo")}}>
                Enable it!
              </Button>
            </div>
          )}
        </section>
        <section>{active && <Queue items={items} />}</section>
        <section>
          <Search youtube={youtube} />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
