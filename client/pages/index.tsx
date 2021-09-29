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
  next,
  previous,
  setPosition,
  setQueue,
  selectPosition,
} from '../components/Queue/queueSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import type { QueueState } from '../components/Queue/queueSlice';
import { Controls } from '../components/Button/Button';
// import mockQueue, { overflowingQueue } from '../__mock__/mockQueue';
import { mockQueue } from '../mock/mockData';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      queue: mockQueue,
    },
  };
};

type HomeProps = {
  queue: QueueState;
};

export enum breakpoints {
  LARGE = 1150,
  MEDIUM = 850,
  SMALL = 0,
}

const Home: NextPage = ({
  queue,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [youtube, setYoutube] = useState(
    new Youtube(process.env.NEXT_PUBLIC_YOUTUBE_KEY || '')
  );
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const position = useAppSelector(selectPosition);
  const [windowWidth, setWindowWidth] = useState<number>();
  const [Dashboard, setDashboard] = useState<JSX.Element>();

  // Setup queue on initial cycle
  useEffect(() => {
    dispatch(setQueue({ ...queue }));
    if (window) {
      // Window resizes should affect the sidebar position
      window.addEventListener('resize', function (event: UIEvent) {     // fixing window is not defined see https://bit.ly/3k8w4lr
        const win = event.target as Window;
        if (event.target && win.innerWidth != windowWidth) setWindowWidth(win.innerWidth);
      });
    }
  }, []);

  return (
    <div className={classes.home_container}>
      <Navbar />
      <div className={classes.dashboard_container}>
        <section>
          {items?.length > 0 && <YoutubeEmbed embedId={items[position].id} />}
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
