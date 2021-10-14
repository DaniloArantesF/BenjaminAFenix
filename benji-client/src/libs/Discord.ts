import axios, { AxiosResponse } from 'axios';
import { Guild } from '../app/dashboardSlice';

export const getGuildVoiceChannels = async (guildId: string) => {
  try {
    const res: AxiosResponse<any> = await axios.get(
      'http://localhost:8000/discord/channels',
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
      'http://localhost:8000/discord/user',
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
      'http://localhost:8000/discord/guilds',
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