import { google } from 'googleapis';
require('dotenv').config();
import type { ItemsEntity, YoutubeItem } from './Youtube.d';
import { convertISODurationToMS } from '../util/time';

const youtube = google.youtube({ version: 'v3', auth: process.env.APIKEY });

/**
 * Wrapper function for Yotube search API
 * @param query Search query to be used
 * @param maxResults Number of results to return
 */
export async function searchYoutube(query: string, maxResults?: number): Promise<YoutubeItem[]> {
  if (!maxResults) maxResults = 1;
  const search = await youtube.search.list({
    part: ['snippet'],
    q: query,
    maxResults,
    safeSearch: 'none',
    type: ['video'],
    videoCategoryId: '10',
  });

  const items = await Promise.all(search.data.items.map(async (item: ItemsEntity) => {
    const { id, snippet } = item;
    const duration = await getItemDuration(item.id.videoId);
    const { publishedAt, channelId, title, description, thumbnails, channelTitle } = snippet;
    return { id: id.videoId, publishedAt, channelId, title, duration, description, thumbnails, channelTitle } as YoutubeItem;
  }));

  return items;
}

export async function getYoutubeItem(id: string): Promise<YoutubeItem> {//
  const { data } = await youtube.videos.list({
    part: ['snippet', 'contentDetails'],
    id: [id]
  });

  // Extract only data needed
  const { publishedAt, channelId, title, description, thumbnails, channelTitle } = data.items[0].snippet;
  delete thumbnails.maxres;
  delete thumbnails.standard;

  const duration = await getItemDuration(data.items[0].id);
  return { id: data.items[0].id, duration, publishedAt, channelId, title, description, thumbnails, channelTitle } as YoutubeItem;
}

export function getIdFromUrl(url: string): string {
  // Check if url contains parameters
  const idParam = url.search(/watch\?v=/);
  let id = '';

  if (idParam !== -1) {
    // +8 to skip watch?v= and +11 for id length
    // i.e. https://www.youtube.com/watch?v=dQw4w9WgXcQ
    id = url.slice(idParam + 8, idParam + 19);
  } else {
    // Return last 11 chars
    // i.e. https://youtu.be/dQw4w9WgXcQ
    id = url.slice(url.length - 11);
  }

  if (id.length < 11) {
    console.error(`Possible error parsing ${url}`);
    return '';
  }
  return id;
}

export function getYoutubeUrl(id: string) {
  return `https://www.youtube.com/watch?v=${id}`;
}

export async function getItemDuration(id: string) {
  const { data } = await youtube.videos.list({
    part: ['contentDetails'],
    id: [id]
  });

  const contentDetails = data.items[0].contentDetails;
  const duration = convertISODurationToMS(contentDetails.duration)
  return duration;
}