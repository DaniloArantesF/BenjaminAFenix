import React from 'react';
import classes from './InactiveGuild.module.css';
import Navbar from '../../common/Navbar/Navbar';
import ChannelSelection from '../Selection';
import { useAppSelector } from '../../../app/hooks';
import { selectDashboard } from '../../../app/dashboardSlice';
import Button from '../Button/Button';
import { BOT_INVITE_URL } from '../../../pages/Login';

interface InactiveGuildProps {
  joinChannel: (guildId: string, channelId: string) => void;
}

const InactiveGuild = ({ joinChannel }: InactiveGuildProps) => {
  const { currentGuild } = useAppSelector(selectDashboard);

  /* TODO: test that adding bot to new server updates app correctly */
  const AddToServer = () => {
    return (
      <div className={classes.prompt}>
        <h1>Benji is not on this server :(</h1>
        <Button
          type={'btn-large'}
          isActive={() => true}
          onClick={() => {
            window.location.href = BOT_INVITE_URL;
          }}
        >
          Add it to this server!
        </Button>
      </div>
    );
  };

  const SelectServer = () => {
    return (
      <div className={classes.prompt}>
        <h1>Select a server to start!</h1>
      </div>
    );
  };

  return (
    <div className={classes.dashboard_container}>
      <Navbar />
      <div className={classes.dashboard__body}>
        {currentGuild ? (
          currentGuild?.allowed ? (
            <ChannelSelection active={true} joinChannel={joinChannel} />
          ) : (
            <AddToServer />
          )
        ) : (
          <SelectServer />
        )}
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
