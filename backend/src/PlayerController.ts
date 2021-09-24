import { AudioPlayerStatus, StreamType, createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnection, AudioPlayer } from '@discordjs/voice';
import ytdl from 'ytdl-core';
import DiscordClient from './DiscordClient';

class PlayerController extends AudioPlayer {
  client: DiscordClient;
  isPlaying: boolean;

  constructor() {
    super();
    this.isPlaying = false;

    this.on(AudioPlayerStatus.Idle, () => {
      console.log("Idle...");
      // TODO: handle player going idle
      this.isPlaying = false;
    });

    this.on(AudioPlayerStatus.Playing, () => {
      console.log("Playing...");
      this.isPlaying = true;
    });

    this.on(AudioPlayerStatus.Paused, () => {
      this.isPlaying = false;
    });
  }
}

export default PlayerController;