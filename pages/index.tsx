import type { NextPage } from 'next';
import classes from '../styles/Home.module.css';
import Queue from '../components/Queue/Queue';
import tracks from '../mock/mockQueue';
import YoutubeEmbed from '../components/YoutubeEmbed/Youtube';
import Navbar from '../components/Navbar/Navbar';
import Search from '../components/Search/Search';

const Home: NextPage = () => {
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
          <Search />{' '}
        </section>
      </div>
    </div>
  );
};

export default Home;
