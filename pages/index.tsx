import type { NextPage } from 'next';
import styles from '../styles/Home.module.css'
import Queue from '../components/Queue/Queue';
//import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import tracks from '../mock/mockQueue';

/*export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch('');
  console.log(res);
  const { items } = await res.json();
  return {
    props: { items: {} },
  }
}*/

const Home: NextPage = () => {
  return (
    <div className={ styles.home_container}>
      <Queue items={ tracks }/>
    </div>
  );
}

export default Home
