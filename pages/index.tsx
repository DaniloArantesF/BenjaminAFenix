import type { NextPage } from 'next';
import classes from '../styles/Home.module.css'
import Queue from '../components/Queue';
//import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import tracks from '../mock/mockQueue';
import Youtube from '../components/Youtube';
import SideBar from '../components/SideBar';
import SearchBar from '../components/SearchBar';

/*export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch('');
  console.log(res);
  const { items } = await res.json();
  return {
    props: { items: {} },
  }
}*/

const Home: NextPage = () => {
  const mock_video = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

  return (
    <div className={classes.home_container}>
      <SideBar />
      <div className={classes.dashboard_container}>
        <section>
          <Youtube embedId={ 'dQw4w9WgXcQ' } />
        </section>
        <section>
          <Queue items={ tracks }/>
        </section>
        <section> <SearchBar /> </section>
      </div>
    </div>
  );
}

export default Home
