import { Channel } from '../../app/dashboardSlice';
import classes from './Selection.module.css';

interface ChannelSelectionProps {
  channels: Channel[];
  chooseItem: (i: Channel) => void;
}

const ChannelSelection = ({ channels, chooseItem }: ChannelSelectionProps) => {
  return (
    <div className={classes.selection_container}>
      <h1>Select a channel to start!</h1>
      {channels.map((channel, index) => {
        return (
          <section key={index} className={classes.selection__item}
            onClick={() => chooseItem(channel)}
          >
            {channel.name}
          </section>
        );
      })}
    </div>
  );
};

export default ChannelSelection;
