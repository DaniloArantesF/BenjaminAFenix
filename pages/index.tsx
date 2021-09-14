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
import mockQueue, { overflowingQueue } from '../__mock__/mockQueue';

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

const Home: NextPage = ({
  queue,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [youtube, setYoutube] = useState(
    new Youtube(process.env.NEXT_PUBLIC_YOUTUBE_KEY || '')
  );
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const position = useAppSelector(selectPosition);

  useEffect(() => {
    dispatch(setQueue({ ...queue }));
  }, []);

  return (
    <div className={classes.home_container}>
      <div className={classes.dashboard_container}>
        <section>
          {position !== -1 && <YoutubeEmbed embedId={items[position].id} />}
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
