import axios, { AxiosResponse } from 'axios';

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