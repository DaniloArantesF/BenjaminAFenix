import { timeStamp } from 'console';
import { useEffect, useState } from 'react';
import { clearInterval } from 'timers';
import { selectDashboard, selectUptime } from '../../app/dashboardSlice';
import { useAppSelector } from '../../app/hooks';
import { getDiscordAvatar } from '../../libs/Discord';
import { msToMinSec } from '../../util/util';
import Button from '../Button/Button';
import classes from './GuildHeader.module.css';

interface props {
  switchHandler: () => void;
}
const GuildHeader = ({ switchHandler }: props) => {
  const { currentGuild: guild, channel } = useAppSelector(selectDashboard);
  const [uptime, setUptime] = useState(getUptime(channel?.timestamp ?? 0));


  useEffect(() => {
    const interval = setInterval(function() {
      setUptime(getUptime(channel?.timestamp ?? 0));
    }, 1000);

    return function () {
      clearInterval(interval);
    }
  }, []);

  function getUptime(start: number) {
    return msToMinSec(start ? Date.now() - start : 0);
  }

  if (!guild) return null;
  return (
    <div className={classes.guild_header}>
      {guild.icon ? (
        <img
          src={getDiscordAvatar('guild', guild.id, guild.icon)}
          alt={guild.name}
        />
      ) : (
        <h2>{guild.name.substring(0, 1)}</h2>
      )}

      <div className={classes.guild_header__body}>
        <h1>
          {guild.name} {channel ? `/ ${channel.name}` : ''}
        </h1>
        <h2>{channel?.onlineCount || 0} online</h2>
        <h2>{uptime}</h2>
      </div>

      <div className={classes.guild_header__btns}>
        <Button isActive={() => true} onClick={() => switchHandler()}>
          Switch Channel
        </Button>

        <Button isActive={() => true} onClick={() => console.log('click')}>
          Leave
        </Button>
      </div>
    </div>
  );
};

export default GuildHeader;
