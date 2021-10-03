import {
  AudioPlayerStatus,
  StreamType,
  createAudioResource,
  AudioPlayer,
  AudioResource,
  AudioPlayerPlayingState,
} from '@discordjs/voice';
import ytdl from 'ytdl-core';
import type { Track } from './DiscordClient';
import QueueController from './QueueController';
import { getYoutubeUrl } from './lib/Youtube';
import { Message } from 'discord.js';
import { Namespace } from 'socket.io';

/**
 * Manages player state and holds queue controller
 * Calls queue for state updates relaying commands from client
 */
class PlayerController extends AudioPlayer {
  channel: Namespace;
  currentTrack: Track;
  guildId: string;
  lastEmbed: Message;
  progress: number; // player progress in MS
  queueController: QueueController;
  resource: AudioResource; // Current audio resource being played
  status: AudioPlayerStatus;
  volume: number;

  constructor(guildId: string, channel: Namespace) {
    super();
    this.queueController = new QueueController();
    this.status = AudioPlayerStatus.Idle;
    this.guildId = guildId;
    this.volume = 1;
    this.channel = channel;

    /* Player Events */
    this.on(AudioPlayerStatus.Idle, () => {
      console.info('Playing next title...');
      this.progress = 0;
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

      // Keep track of player progress
      setInterval(() => {
        const state = this.state as AudioPlayerPlayingState;
        this.progress = state.playbackDuration;
      }, 500);
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
    this.channel.to(this.guildId).emit('player_update', {
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
      inlineVolume: true, // Creates volume transformer allowing volume settings
    });
    this.resource = resource;
    resource.volume.setVolumeLogarithmic(this.volume);
    this.play(resource);
  }

  public setVolume(volume: number) {
    this.resource.volume.setVolumeLogarithmic(volume);
    this.volume = volume;
  }

  public getPlayerState() {
    const { currentTrack, progress, queueController, status, volume } = this;

    return {
      currentTrack,
      progress,
      status,
      volume,
      queue: {
        items: queueController.items,
        position: queueController.position
      }
    }
  }
}

export default PlayerController;
