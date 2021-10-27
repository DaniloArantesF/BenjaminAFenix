import classes from './InactiveGuild.module.css';
import Navbar from '../../components/Navbar/Navbar';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { Channel, selectDashboard, } from '../../app/dashboardSlice';
import Button from '../../components/Button/Button';
import { getGuildVoiceChannels } from '../../libs/Discord';
import ChannelSelection from '../Selection';


interface InactiveGuildProps {
  joinChannel: (guildId: string, channelId: string) => void;
}

const InactiveGuild = ({ joinChannel }: InactiveGuildProps) => {
  const [channels, setChannels] = useState<Channel[]>();
  const { currentGuild } = useAppSelector(selectDashboard);

  useEffect(() => {
    if (!currentGuild) return;
    getChannels(currentGuild.id);
  }, [currentGuild]);

  const getChannels = async (guildId: string) => {
    const channels = await getGuildVoiceChannels(guildId);
    setChannels(channels);
  };

  return (
    <div className={classes.dashboard_container}>
      <Navbar />
      <div className={classes.dashboard__body}>
        <ChannelSelection active={true} joinChannel={joinChannel}/>
        <section id={classes.info}>
          {/* <ChannelSelection joinChannel={joinChannel} /> */}
        </section>
        <section id={classes.queue}>

        </section>
        <section id={classes.search}>

        </section>
        <section id={classes.player_controls}>

        </section>
        <section id={classes.preview}></section>
      </div>
    </div>
  );
};

export default InactiveGuild;