import axios, { AxiosResponse } from 'axios';
import { selectToken, setError } from '../app/authSlice';
import { Channel, Guild } from '../app/dashboardSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';

interface VoiceChannels {
  type: "GUILD_TEXT" | "GUILD_VOICE" | "GUILD_CATEGORY" | "GUILD_NEWS" | "GUILD_STORE" | "GUILD_NEWS_THREAD" | "GUILD_PUBLIC_THREAD" | "GUILD_PRIVATE_THREAD" | "GUILD_STAGE_VOICE";
  id: string;
  name: string;
  onlineCount: number;
  timestamp: number;
}

const useDiscord = () => { //  eslint-disable-line @typescript-eslint/explicit-module-boundary-types
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);

  const getGuildVoiceChannels = async (guildId: string) => {
    try {
      const res: AxiosResponse<{ channels: VoiceChannels[]}> = await axios.get(
        `${process.env.REACT_APP_BOT_HOSTNAME}/discord/channels`,
        {
          params: { guildId, token },
        }
      );
      return res.data.channels;
    } catch (error) {
      !error &&
        dispatch(
          setError({
            message: 'Error fetching voice channels',
            code: 401,
            redirect_path: '/login',
          })
        );
      return [];
    }
  };

  const getUserData = async (token: string): Promise<{ id: string, username: string, avatar: string }> => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BOT_HOSTNAME}/discord/user`,
        {
          params: { token },
        }
      );
      const { id, username, avatar } = res.data;
      return { id, username, avatar };
    } catch (error) {
      !error &&
        dispatch(
          setError({
            message: 'Error getting user data',
            code: 401,
            redirect_path: '/login',
          })
        );
      return { id: '', username: '', avatar: '' };
    }
  };

  const getUserGuilds = async (token: string): Promise<Guild[]> => {
    try {
      const res: AxiosResponse<{ guilds: Guild[] }> = await axios.get(
        `${process.env.REACT_APP_BOT_HOSTNAME}/discord/guilds`,
        {
          params: { token },
        }
      );

      const guilds: Guild[] = res.data.guilds;
      return guilds;
    } catch (error) {
      !error &&
        dispatch(
          setError({
            message: 'Error getting user guilds',
            code: 401,
            redirect_path: '/login',
          })
        );
      return [];
    }
  };

  const getUserVoiceChannel = async (token: string): Promise<{ guild: Guild | null, channel: Channel | null }> => {
    try {
      const res: AxiosResponse<{ guild: Guild, channel: Channel }> = await axios.get(
        `${process.env.REACT_APP_BOT_HOSTNAME}/discord/connection`,
        {
          params: { token },
        }
      );

      return {
        guild: res.data.guild,
        channel: res.data.channel,
      };
    } catch (error) {
      console.error('Error getting user connection');
      !error && dispatch(setError({
        message: 'Error getting user connection',
        code: 401,
        redirect_path: '/login',
      }));
      return {
        guild: null,
        channel: null,
      };
    }
  };

  return {
    getGuildVoiceChannels,
    getUserData,
    getUserGuilds,
    getUserVoiceChannel,
  };
};

/**
 * Returns the url for a discord avatar given an avatar hash
 * @param type Type of avatar, either 'user' or 'guild'
 * @param id Id of avatar owner
 * @param avatarHash Avatar hash given by discord
 * @param size Size of img desired
 * @returns
 */
export const getDiscordAvatar = (
  type = 'user',
  id: string,
  avatarHash: string,
  size = 64
): string => {
  const baseUrl = 'https://cdn.discordapp.com/';
  const userPath = `avatars/${id}/${avatarHash}.png`;
  const guildPath = `icons/${id}/${avatarHash}.png`;

  if (type === 'user') {
    return baseUrl + userPath + `?size=${size}`;
  } else if (type === 'guild') {
    return baseUrl + guildPath + `?size=${size}`;
  }
  return ""
};

export default useDiscord;
