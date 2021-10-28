import classes from './InactiveGuild.module.css';
import Navbar from '../../components/Navbar/Navbar';
import ChannelSelection from '../Selection';

interface InactiveGuildProps {
  joinChannel: (guildId: string, channelId: string) => void;
}

const InactiveGuild = ({ joinChannel }: InactiveGuildProps) => {
  return (
    <div className={classes.dashboard_container}>
      <Navbar />
      <div className={classes.dashboard__body}>
        <ChannelSelection active={true} joinChannel={joinChannel} />
        <section id={classes.info}></section>
        <section id={classes.queue}></section>
        <section id={classes.search}></section>
        <section id={classes.player_controls}></section>
        <section id={classes.preview}></section>
      </div>
    </div>
  );
};

export default InactiveGuild;
