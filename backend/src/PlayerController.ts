import {
  AudioPlayerStatus,
  StreamType,
  createAudioResource,
  AudioPlayer,
} from '@discordjs/voice';
import ytdl from 'ytdl-core';
import type { AudioResource } from './DiscordClient';
import QueueController from './QueueController';
import { getYoutubeUrl } from './lib/Youtube';
import { Message } from 'discord.js';
import { Namespace, Socket } from 'socket.io';

/**
 * Manages player state and holds queue controller
 * Calls queue for state updates relaying commands from client
 */
class PlayerController extends AudioPlayer {
  status: AudioPlayerStatus;
  currentTrack: AudioResource;
  progress: number; // player progress in MS
  queueController: QueueController;
  lastEmbed: Message;
  webClients: Map<string, Socket>;
  channel: Namespace;
  guildId: string;

  constructor(guildId: string, channel: Namespace) {
    super();
    this.status = AudioPlayerStatus.Idle;
    this.queueController = new QueueController();
    this.channel = channel;
    this.webClients = new Map();
    this.guildId = guildId;

    /* Player Events */
    this.on(AudioPlayerStatus.Idle, () => {
      console.info('Playing next title...');
      this.queueController.next();

      // make playr idle if no song left
      if (!this.queueController.getTrack()) {
        console.info('Player going idle...');
        this.status = AudioPlayerStatus.Idle;
      }
    });

    this.on(AudioPlayerStatus.Playing, () => {
      console.info(
        `[${new Date().getHours()}:${new Date().getMinutes()} ${new Date().getSeconds()}s] Playing...`
      );
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

    // Update web clients
    this.channel.to(this.guildId).emit('queue_update', {
      queue: {
        items: this.queueController.items,
        position: this.queueController.position,
      },
    });
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
    console.info(
      `[${new Date().getHours()}:${new Date().getMinutes()} ${new Date().getSeconds()}s] Calling play...`
    );
    this.play(resource);
  }
}

export default PlayerController;
