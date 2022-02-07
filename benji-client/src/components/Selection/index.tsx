import { useEffect, useRef } from 'react';
import { Channel, selectDashboard, } from '../../app/dashboardSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import classes from './Selection.module.css';

interface ChannelSelectionProps {
  joinChannel: (guildId: string, channelId: string) => void;
  active: boolean;
  setActive?: (val: boolean) => void;
}

const ChannelSelection = ({
  joinChannel,
  active,
  setActive,
}: ChannelSelectionProps) => {
  const { currentGuild, channels } = useAppSelector(selectDashboard);
  const selectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!setActive || !window) return;
    if (active) {
      window.addEventListener('click', handleWindowClick);
    } else {
      window.removeEventListener('click', handleWindowClick);
    }

    return () => {
      window.removeEventListener('click', handleWindowClick);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  /**
   * Called when selection is active and user clicks on window
   * Checks if click was outside of selection box to dismiss it
   * @param event
   */
  const handleWindowClick = (event: MouseEvent) => {
    if (!selectionRef.current || !setActive) return;
    const { clientX: clickX, clientY: clickY } = event;
    const { top, right, bottom, left } =
      selectionRef.current.getBoundingClientRect();

    if (clickX < left || clickX > right || clickY < top || clickY > bottom) {
      setActive(false);
    }
  };

  const chooseItem = (channel: Channel) => {
    if (!currentGuild) return;
    joinChannel(currentGuild.id, channel.id);
  };

  return (
    <div
      ref={selectionRef}
      className={`${classes.selection_container} ${
        active ? classes.active : classes.inactive
      }`}
    >
      <h1>Select a channel to start!</h1>
      {channels.map((channel, index) => {
        return (
          <section
            key={index}
            className={classes.selection__item}
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
