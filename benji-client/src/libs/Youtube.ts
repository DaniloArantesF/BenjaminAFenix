import axios, { AxiosResponse } from 'axios';

export const getYoutubeItem = async (itemId: string) => {
  try {
    const res: AxiosResponse<any> = await axios.get(
      'http://localhost:8000/youtube/',
      {
        params: { itemId },
      }
    );
    return res.data.item;
  } catch (error) {
    console.error('Error getting user guilds');
  }
};

export const searchYoutube = async (query: string, resultsCount=5) => {
  try {
    const res: AxiosResponse<any> = await axios.get('http://localhost:8000/youtube/search', {
      params: {
        q: query,
        resultsCount
      }
    })
    return res.data.items;
  } catch (error) {
    console.error("Error searching youtube");
  }
}