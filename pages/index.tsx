import type { NextPage } from 'next';
import classes from '../styles/Home.module.css'
import Queue from '../components/Queue';
//import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import tracks from '../mock/mockQueue';
import YoutubeEmbed from '../components/Youtube';
import SideBar from '../components/SideBar';
import Search from '../components/Search';


const Home: NextPage = () => {
  return (
    <div className={classes.home_container}>
      <SideBar />
      <div className={classes.dashboard_container}>
        <section>
          <YoutubeEmbed embedId={ 'dQw4w9WgXcQ' } />
        </section>
        <section>
          <Queue items={ tracks }/>
        </section>
        <section> <Search /> </section>
      </div>
    </div>
  );
}

export default Home
