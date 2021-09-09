import type { NextPage } from 'next';
import classes from '../styles/Home.module.css';
import Queue from '../components/Queue/Queue';
import tracks from '../mock/mockQueue';
import YoutubeEmbed from '../components/YoutubeEmbed/Youtube';
import Navbar from '../components/Navbar/Navbar';
import Search from '../components/Search/Search';
import { useState } from 'react';
import Youtube from '../libs/Youtube';

const Home: NextPage = () => {
  const [youtube, setYoutube] = useState(new Youtube(process.env.NEXT_PUBLIC_YOUTUBE_KEY || ''));

  return (
    <div className={classes.home_container}>
      <div className={classes.dashboard_container}>
        <section>
        </section>
        <section>
          <Queue items={tracks} />
        </section>
        <section>
          {' '}
          <Search youtube={youtube}/>{' '}
        </section>
      </div>
    </div>
  );
};

export default Home;
