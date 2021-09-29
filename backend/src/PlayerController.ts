import {
  AudioPlayerStatus,
  StreamType,
  createAudioResource,
  AudioPlayer,
} from '@discordjs/voice';
import ytdl from 'ytdl-core';
import DiscordClient from './DiscordClient';
import type { AudioResource } from './DiscordClient';
import QueueController from './QueueController';
import { getYoutubeUrl } from './lib/Youtube';

/**
 * Manages player state and holds queue controller
 * Calls queue for state updates relaying commands from client
 */
class PlayerController extends AudioPlayer {
  status: AudioPlayerStatus;
  currentTrack: AudioResource;
  progress: number; // player progress in MS
  queueController: QueueController;

  constructor() {
    super();
    this.status = AudioPlayerStatus.Idle;
    this.queueController = new QueueController();

    this.on(AudioPlayerStatus.Idle, () => {
      console.log('Song Over');
      this.queueController.next();

      // make playr idle if no song left
      if (!this.queueController.getTrack()) {
        console.info("Player going idle...")
        this.status = AudioPlayerStatus.Idle;
      }
    });

    this.on(AudioPlayerStatus.Playing, () => {
      console.info(`[${Date.now()}] Playing...`)
      this.status = AudioPlayerStatus.Playing;
    });

    this.on(AudioPlayerStatus.Paused, () => {
      this.status = AudioPlayerStatus.Paused;
    });

    this.queueController.on('queue_update', this.updatePlayer.bind(this));
  }

  /**
   * Callback used to update player if queue is changed
   * Will be called whenever items or position is changed
   * to get new track to play.
   */
  public updatePlayer() {
    console.info('Checking updates to player...');
    const track = this.queueController.getTrack();
    if (!this.currentTrack || track !== this.currentTrack) {
      this.currentTrack = track;
      this.progress = 0;
      this.playCurrentItem();
    }
  }

  private playCurrentItem() {
    const item = this.currentTrack;
    const stream = ytdl(getYoutubeUrl(item.id), {
      filter: 'audioonly',
      // tslint:disable-next-line: no-bitwise
      highWaterMark: 1 << 25,
    });
    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    });
    console.info(`[${Date.now()}] Calling play...`)
    this.play(resource);
  }

}

export default PlayerController;
