import { selectDashboard } from "../../app/dashboardSlice";
import { useAppSelector } from "../../app/hooks";
import { getDiscordAvatar } from "../../libs/Discord";
import Button from "../Button/Button";
import classes from './GuildHeader.module.css';

const GuildHeader = () => {
  const { currentGuild } = useAppSelector(selectDashboard);

  if (!currentGuild) return null;
  const onlineCount = 5;
  const guild = currentGuild;
  const uptime = '1:45:33';
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
        <h1>{guild.name}</h1>
        <h2>{onlineCount} online</h2>
        <h2>{uptime}</h2>
      </div>

      <div className={classes.guild_header__btns}>
        <Button isActive={() => true} action={() => console.log('click')}>
          Switch Channel
        </Button>

        <Button isActive={() => true} action={() => console.log('click')}>
          Leave
        </Button>
      </div>
    </div>
  );
};

export default GuildHeader;