import axios, { AxiosResponse } from 'axios';
import { Channel, Guild } from '../app/dashboardSlice';

export const getGuildVoiceChannels = async (guildId: string) => {
  try {
    const res: AxiosResponse<any> = await axios.get(
      `${process.env.REACT_APP_BOT_HOSTNAME}/discord/channels`,
      {
        params: { guildId },
      }
    );
    return res.data.channels;
  } catch (error) {
    console.error('Error getting user guilds');
  }
};

export const getUserData = async (accessToken: string) => {
  try {
    const res: AxiosResponse<any> = await axios.get(
      `${process.env.REACT_APP_BOT_HOSTNAME}/discord/user`,
      {
        params: { accessToken },
      }
    );
    const { id, username, avatar } = res.data;
    return { id, username, avatar };
  } catch (error) {
    console.error('Error getting user');
  }
};

export const getUserGuilds = async (accessToken: string) => {
  try {
    const res: AxiosResponse<any> = await axios.get(
      `${process.env.REACT_APP_BOT_HOSTNAME}/discord/guilds`,
      {
        params: { accessToken },
      }
    );

    const guilds: Guild[] = res.data.guilds;
    return guilds;
  } catch (error) {
    console.error('Error getting user guilds');
  }
};

export const getUserVoiceChannel = async (accessToken: string, id: string) => {
  try {
    const res: AxiosResponse<any> = await axios.get(
      `${process.env.REACT_APP_BOT_HOSTNAME}/discord/connection`,
      {
        params: { accessToken, id },
      }
    );

    return {
      guild: res.data.guild as Guild,
      channel: res.data.channel as Channel,
    };
  } catch (error) {
    console.error('Error getting user connection');
    return {
      guild: null,
      channel: null,
    };
  }
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
) => {
  const baseUrl = 'https://cdn.discordapp.com/';
  const userPath = `avatars/${id}/${avatarHash}.png`;
  const guildPath = `icons/${id}/${avatarHash}.png`;

  if (type === 'user') {
    return baseUrl + userPath + `?size=${size}`;
  } else if (type === 'guild') {
    return baseUrl + guildPath + `?size=${size}`;
  }
};
