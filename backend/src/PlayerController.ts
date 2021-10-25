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
import { getYoutubeUrl } from './apis/Youtube';
import { Message } from 'discord.js';
import { EventBus } from './EventBus';
import logger from './Logger';

/**
 * Manages player state and holds queue controller
 * Calls queue for state updates relaying commands from client
 */
class PlayerController extends AudioPlayer {
  currentTrack: Track;
  guildId: string;
  lastEmbed: Message;
  progress: number; // player progress in MS
  queueController: QueueController;
  resource: AudioResource; // Current audio resource being played
  status: AudioPlayerStatus;
  volume: number;
  playerInterval: NodeJS.Timer;
  clientUpdateInterval: number; // Frequency with whitch clients will be updated
  eventBus: EventBus;

  constructor(guildId: string) {
    super();
    this.queueController = new QueueController();
    this.status = AudioPlayerStatus.Idle;
    this.guildId = guildId;
    this.volume = 1;
    this.clientUpdateInterval = 1000;
    this.eventBus = EventBus.getInstance();

    /* Player Events */
    this.on(AudioPlayerStatus.Idle, () => {
      console.info('Playing next title...');
      this.progress = 0;
      const nextTrack = this.queueController.next();

      // make playr idle if no song left
      if (!nextTrack) {
        console.info('No next title, going idle...');
        // Stop tracking player state
        clearInterval(this.playerInterval);
        this.status = AudioPlayerStatus.Idle;
        this.broadcastPlaybackState();
      }
    });

    this.on(AudioPlayerStatus.Playing, () => {
      console.info(
        `[${new Date().getHours()}:${new Date().getMinutes()} ${new Date().getSeconds()}s] Playing...`
      );
      this.status = AudioPlayerStatus.Playing;

      // Keep track of player progress and update web clients
      this.playerInterval = setInterval(() => {
        this.broadcastPlaybackState();
      }, this.clientUpdateInterval);
    });

    this.on(AudioPlayerStatus.Paused, () => {
      console.info(
        `[${new Date().getHours()}:${new Date().getMinutes()} ${new Date().getSeconds()}s] Paused.`
      );

      // Stop tracking player state
      clearInterval(this.playerInterval);
      this.status = AudioPlayerStatus.Paused;
      this.broadcastPlaybackState();
    });

    // Handle update events coming from queue controller
    this.queueController.on('queue_update', this.updatePlayer.bind(this));
  }

  /**
   * Callback used to update player if queue is changed
   * Will be called whenever items or position is changed
   * to get new track to play.
   */
  public updatePlayer() {
    console.info('Checking updates to player...');
    let track;

    // Idle can either mean player has not been played or
    // reached the end of the queue. Either case we need to update position.
    if (this.status === AudioPlayerStatus.Idle) {
      if (this.queueController.position === -1) {
        // Not initialized
        this.queueController.position = 0;
        track = this.queueController.getTrack();
      } else {
        // End of Queue
        this.queueController.position++;
        track = this.queueController.getTrack();
      }
    } else {
      // Otherwise position is already updated
      track = this.queueController.getTrack();
    }

    if (!track) {
      // Return to avoid error
      return;
    }
    // Update current track and play new item
    if (!this.currentTrack || track !== this.currentTrack) {
      this.currentTrack = track;
      this.progress = 0;
      this.playCurrentItem();
    }

    // Update web clients
    // this.channel.to(this.guildId).emit('player_update', this.getPlayerState());
    this.eventBus.dispatch(`player_update`, this.getPlayerState());
  }

  /**
   * Periodically broadcast playback state to all web clients connected to this player instance.
   */
  private broadcastPlaybackState() {
    const state = this.state as AudioPlayerPlayingState;

    // Get current playback progress and save timestamp to
    // TODO: account for latency later
    this.progress = state.playbackDuration;
    const timestamp = Date.now();

    this.eventBus.dispatch('playback_state', {
      guildId: this.guildId,
      status: this.status,
      volume: this.volume,
      progress: this.progress,
      timestamp,
    });
  }

  private playCurrentItem() {
    const item = this.currentTrack;

    try {
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
      this.status = AudioPlayerStatus.Playing;
      this.play(resource);
    } catch (error) {
      console.error(error);
      // logger.error({
      //   function: 'playCurrentItem',
      //   error: error.data.error,
      // });
    }
  }

  public setVolume(volume: number) {
    this.resource.volume.setVolumeLogarithmic(volume);
    this.volume = volume;
  }

  public getPlayerState() {
    const { currentTrack, progress, queueController, status, volume } = this;

    return {
      guildId: this.guildId,
      currentTrack,
      progress,
      status,
      volume,
      queue: {
        items: queueController.items,
        position: queueController.position,
      },
    };
  }
}

export default PlayerController;
