import fs from 'fs';
import {
  Channel,
  Client,
  Collection,
  Guild,
  GuildMember,
  Intents,
  VoiceChannel,
} from 'discord.js';

import { AudioPlayerStatus, StreamType, createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnection } from '@discordjs/voice';
import type { ClientOptions } from 'discord.js';
import type { APIMessageInteraction } from 'discord-api-types';
import { CommandInteraction } from 'discord.js';
import ytdl from 'ytdl-core';
import PlayerController from './PlayerController';
import type { YoutubeItem } from './lib/Youtube.d';

export interface Command {
  data: {
    name: string;
    options: any;
    description: string;
    defaultPermissions?: any;
  };
  aliases?: string[];
  args?: boolean;
  execute(client: DiscordClient, interaction: CommandInteraction): void;
  guildOnly?: boolean;
  usage: string;
}

export enum Services {
  Youtube,
  Spotify,
  SoundCloud,
}

export interface AudioResource {
  service: Services;
  item: YoutubeItem;
}

class DiscordClient extends Client {
  static commands = new Collection<string, Command>();
  connections: Map<string, VoiceConnection>;
  ready: boolean;

  constructor(props: ClientOptions) {
    super(props);
    this.ready = false;
    this.connections = new Map(); // maps guild ids to voice connections
    this.setUpCommands();
    this.setUpEvents();
  }

  private setUpCommands() {
    const commandFiles = fs
      .readdirSync('src/commands/')
      .filter((file) => file.endsWith('.ts'));

    for (const file of commandFiles) {
      const { command } = require(`./commands/${file}`);

      if (!command?.data) continue; // Ignore empty files
      DiscordClient.commands.set(command.data.name, command);
    }
  }

  private setUpEvents() {
    const eventFiles = fs
      .readdirSync('src/events/')
      .filter((file) => file.endsWith('.ts'));

    for (const file of eventFiles) {
      const event = require(`./events/${file}`);
      if (!event?.name) continue;
      if (event.once) {
        this.once(event.name, (...args) => event.execute(...args));
      } else {
        this.on(event.name, (...args) => event.execute(...args));
      }
    }
  }

  public async joinChannel(guild: Guild, channelId: string): Promise<VoiceConnection | null> {
    try {
      const connection = joinVoiceChannel({
        channelId,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
      });
      this.connections.set(guild.id, connection);
      return connection;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async playResource(guildId: string, data: AudioResource) {
    // TODO: handle other services
    const connection = this.connections.get(guildId);
    const stream = ytdl(this.getYoutubeUrl(data.item.id), {
      filter: 'audioonly',
      highWaterMark: 1<<25,
    });

    const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
    const player = new PlayerController();

    player.play(resource);
    connection.subscribe(player);
  }

  private getYoutubeUrl(id: string) {
    return `https://www.youtube.com/watch?v=${id}`;
  }

  /**
   * Return guild from interaction
   */
  public getGuild(interaction: CommandInteraction): Guild {
    return this.guilds.cache.get(interaction.guildId);
  }

  public async getGuildMember(guild: Guild, userId: any): Promise<GuildMember> {
    return await guild.members.fetch(userId);
  }

  /**
   * Returns the channel id given an interaction
   * @param interaction
   */
  public async getUserVoiceChannel(interaction: CommandInteraction) {
    const guild = this.getGuild(interaction);
    const userId = interaction.member.user.id;
    const member = await this.getGuildMember(guild, userId);
    return member.voice.channelId;
  }
}

export default DiscordClient;
