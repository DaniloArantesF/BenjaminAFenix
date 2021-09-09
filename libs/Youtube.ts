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

export const parseYoutubeItems = (items: Array<ItemsEntity>): Array<YoutubeItem> => {
  return items.map((item: ItemsEntity) => {
    return {
      channelId: item.snippet.channelId,
      channelTitle: item.snippet.channelTitle,
      description: item.snippet.description,
      id: item.id.videoId,
      publishedAt: item.snippet.publishedAt,
      publishTime: item.snippet.publishTime,
      thumbnails: {
        default: item.snippet.thumbnails.default,
        medium: item.snippet.thumbnails.medium,
        high: item.snippet.thumbnails.high
      },
      title: item.snippet.title,
    }
  });
}

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

  public async search(query: string) {
    return this.callYoutubeAPI('GET', 'search', { q: query });
  }

  public getIdFromUrl(url: string): string {
    return url.slice(url.lastIndexOf('/') + 9);
  }

  public async getItemFromUrl(url: string) {
    let id = this.getIdFromUrl(url);
    return this.getItemFromId(id);
  }

  public async getItemFromId(id: string) {
    return this.callYoutubeAPI('GET', 'videos', { id });
  }

  private async callYoutubeAPI(method: string, path: string, params: object) {
    try {
      switch (method) {
        case 'GET':
          const res = await this.#API.get(path, { params: { ...params } })
          const items = parseYoutubeItems(res.data.items);
          console.log(items);
          return items;
        case 'POST':
          break;
        default:
          return [];
      }
    } catch (error) {
      console.error((error as Error).message);
      return [];
    }
  }
}

export default Youtube;
