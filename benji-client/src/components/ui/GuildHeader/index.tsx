import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import { selectDashboard } from '../../../app/dashboardSlice';
import { useAppSelector } from '../../../app/hooks';
import { getDiscordAvatar } from '../../../libs/Discord';
import { msToMinSec } from '../../../util/util';
import { ReactComponent as ExitIcon } from '../../../assets/exit.svg';
import { ReactComponent as SwitchIcon } from '../../../assets/switch.svg';

import classes from './GuildHeader.module.css';

interface props {
  switchHandler: () => void;
  leaveChannel: () => void;
}
const GuildHeader = ({ switchHandler, leaveChannel }: props) => {
  const { currentGuild: guild, channel } = useAppSelector(selectDashboard);
  const [uptime, setUptime] = useState(getUptime(channel?.timestamp ?? 0));

  // TODO: try using useLayoutEffect here ?
  useEffect(() => {
    const interval = setInterval(function () {
      setUptime(getUptime(channel?.timestamp ?? 0));
    }, 1000);

    document.title = `Benji @ ${channel?.name}`;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [channel]);

  function getUptime(start: number) {
    return msToMinSec(start ? Date.now() - start : 0);
  }

  if (!guild) return null;

  // Used to blur icons, allowing animations to run again
  const interceptClick = (event: BaseSyntheticEvent, next: () => void) => {
    event.currentTarget.blur();
    next();
  };

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
        <button onClick={(event) => interceptClick(event, switchHandler)}>
          <SwitchIcon />
        </button>

        <button onClick={(event) => interceptClick(event, leaveChannel)}>
          <ExitIcon />
        </button>
      </div>
    </div>
  );
};

export default GuildHeader;
