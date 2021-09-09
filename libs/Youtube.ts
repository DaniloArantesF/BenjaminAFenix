import type {
  YoutubeProps,
  YoutubeItem,
  YoutubeSearchResult,
  PageInfo,
  ItemsEntity,
  Id,
  Snippet,
  Thumbnails,
  Thumbnail,
} from '../types/youtube';
import axios, { AxiosInstance } from 'axios';

class Youtube {
  API_KEY: string | undefined;
  #API: AxiosInstance;

  constructor(key: string) {
    this.API_KEY = key;
    this.#API = axios.create({
      baseURL: 'https://www.googleapis.com/youtube/v3/',
      params: {
        part: 'snippet',
        maxResults: 5,
        key,
      },
    });
  }

  public getIdFromUrl(url: string): string {
    return url.slice(url.lastIndexOf('/') + 9);
  }

  public async getItemFromUrl(url: string) {
    let id = this.getIdFromUrl(url);
    console.log(id);
    return this.getItemFromId(id);
  }

  public async getItemFromId(id: string) {
    try {
      const res = await this.#API.get('videos', {
        params: { id },
      });
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  }
}

export default Youtube;
