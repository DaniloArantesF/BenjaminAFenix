

export type YoutubeProps = {
  embedId?: string;
  url?: string;
}

/* Used to represent a resource from youtube inside app */
export interface YoutubeItem {
  channelId: string;
  channelTitle: string;
  description: string;
  id: string;
  publishedAt: string;
  publishTime: string;
  thumbnails: Thumbnails;
  title: string;
}

export interface YoutubeSearchResult {
  kind: string;
  etag: string;
  nextPageToken: string;
  regionCode: string;
  pageInfo: PageInfo;
  items?: (ItemsEntity)[] | null;
}
export interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}
export interface ItemsEntity {
  kind: string;
  etag: string;
  id: Id;
  snippet: Snippet;
}
export interface Id {
  kind: string;
  videoId: string;
}
export interface Snippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
  liveBroadcastContent: string;
  publishTime: string;
}
export interface Thumbnails {
  default: Thumbnail;
  medium: Thumbnail;
  high: Thumbnail;
}
export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}
