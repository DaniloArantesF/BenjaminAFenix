import type { NextPage } from 'next';
import classes from '../styles/Home.module.css';
import Queue from '../components/Queue/Queue';
import YoutubeEmbed from '../components/YoutubeEmbed/Youtube';
import Navbar from '../components/Navbar/Navbar';
import Search from '../components/Search/Search';
import { useEffect, useState } from 'react';
import Youtube from '../libs/Youtube';
import {
  selectItems,
  setQueue,
  selectPosition,
} from '../components/Queue/queueSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import type { QueueState } from '../components/Queue/queueSlice';
import { Controls } from '../components/Button/Button';
import { mockQueue } from '../mock/mockData';
import socketIOClient, { io, Socket } from 'socket.io-client';
import { PlayerState } from '../components/Player/playerSlice';

// TODO: manage layouts better
export enum breakpoints {
  LARGE = 1150,
  MEDIUM = 850,
  SMALL = 0,
}

const Home: NextPage = () => {
  const [youtube, setYoutube] = useState(
    new Youtube(process.env.NEXT_PUBLIC_YOUTUBE_KEY || '')
  );
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const position = useAppSelector(selectPosition);
  const [windowWidth, setWindowWidth] = useState<number>();
  const [socket, setSocket] = useState<Socket>();
  const [guildId, setGuildId] = useState('817654492782657566');
  // Setup queue on initial cycle
  useEffect(() => {
    const endpoint = `localhost:8000/bot`;
    setSocket(socketIOClient(endpoint));

    if (window) {
      // Window resizes should affect the sidebar position
      window.addEventListener('resize', function (event: UIEvent) {
        // fixing window is not defined see https://bit.ly/3k8w4lr
        const win = event.target as Window;
        if (event.target && win.innerWidth != windowWidth)
          setWindowWidth(win.innerWidth);
      });
    }

    // TODO: Add socket.off on unmount
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.info('Connected to server!');
      socket.emit('get_player', { guildId });
    });

    socket.on('player_update', (payload: any) => {
      console.log(payload);
      const queue = payload.queue as QueueState;
      console.info('Client Queue Update');
      console.info(queue);
      dispatch(setQueue(queue));
    });
  }, [socket]);

  return (
    <div className={classes.home_container}>
      <Navbar />
      <div className={classes.dashboard_container}>
        <section>
          {items?.length > 0 && position >= 0 && (
            <YoutubeEmbed embedId={items[position].id} />
          )}
        </section>
        <section>
          <Queue items={items} />
        </section>
        <section>
          <Controls />
          <Search youtube={youtube} />{' '}
        </section>
      </div>
    </div>
  );
};

export default Home;
