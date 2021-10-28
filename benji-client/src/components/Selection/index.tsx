import { useEffect } from 'react';
import { Channel, selectDashboard, setCurrentChannel } from '../../app/dashboardSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import classes from './Selection.module.css';

interface ChannelSelectionProps {
  joinChannel: (guildId: string, channelId: string) => void;
  active: boolean;
}

// TODO: implement click to dismiss
const ChannelSelection = ({ joinChannel, active }: ChannelSelectionProps) => {
  const { currentGuild, channels } = useAppSelector(selectDashboard);

  const chooseItem = (channel: Channel) => {
    if (!currentGuild) return;
    joinChannel(currentGuild.id, channel.id);
  }

  return (
    <div className={`${classes.selection_container} ${active ? classes.active : classes.inactive}`}>
      <h1>Select a channel to start!</h1>
      {channels.map((channel, index) => {
        return (
          <section key={index} className={classes.selection__item}
            onClick={() => chooseItem(channel)}
          >
            {channel.name}
            <span>{channel.onlineCount} online</span>
          </section>
        );
      })}
    </div>
  );
};

export default ChannelSelection;
