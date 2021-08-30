import type { NextPage } from 'next';
import classes from '../styles/Home.module.css'
import Queue from '../components/Queue/Queue';
//import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import tracks from '../mock/mockQueue';
import Youtube from '../components/Youtube';

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
      <section>
        <Youtube embedId={ 'dQw4w9WgXcQ' } />
      </section>
      <section>
        <Queue items={ tracks }/>
      </section>
      <section>Info</section>
    </div>
  );
}

export default Home
