import axios, { AxiosResponse } from 'axios';
import { YoutubeItem } from '../types/youtube';

export const getYoutubeItem = async (itemId: string) => {
  try {
    const res: AxiosResponse<{ item: YoutubeItem }> = await axios.get(
      `${process.env.REACT_APP_BOT_HOSTNAME}/youtube/`,
      {
        params: { itemId },
      }
    );
    return res.data.item;
  } catch (error) {
    console.error('Error fetching item');
    return {
      channelId: '',
      channelTitle: '',
      description: '',
      id: '',
      publishedAt: '',
      publishTime: '',
      thumbnails: {
        default: {
          url: '',
          width: 0,
          height: 0,
        },
      },
      title: '',
      duration: 0,
    } as YoutubeItem;
  }
};

export const searchYoutube = async (query: string, resultsCount = 5) => {
  try {
    const res: AxiosResponse<any> = await axios.get(
      `${process.env.REACT_APP_BOT_HOSTNAME}/youtube/search`,
      {
        params: {
          q: query,
          resultsCount,
        },
      }
    );
    return res.data.items;
  } catch (error) {
    console.error('Error searching youtube');
  }
};
