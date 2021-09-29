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

import {
  joinVoiceChannel,
  VoiceConnection,
} from '@discordjs/voice';
import type { ClientOptions } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import PlayerController from './PlayerController';
import type { YoutubeItem } from './lib/Youtube.d';
import { APIMessage } from 'discord-api-types';

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

export interface AudioResource extends YoutubeItem {
  service: Services;
}

export interface DiscordConnection {
  connection: VoiceConnection;
  player: PlayerController;
}

class DiscordClient extends Client {
  static commands = new Collection<string, Command>();
  connections: Map<string, DiscordConnection>;
  ready: boolean;

  constructor(props: ClientOptions) {
    super(props);
    this.ready = false;
    this.connections = new Map(); // maps guild ids to voice connections
    this.setUpCommands();
    // this.setUpEvents();

    this.on('ready', () => {
      console.log("Bot is ready!")
      this.ready = true;
    });
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

  public async joinChannel(
    guild: Guild,
    channelId: string
  ): Promise<DiscordConnection | null> {
    try {
      const connection = joinVoiceChannel({
        channelId,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
      });

      const player = new PlayerController();
      connection.subscribe(player);

      this.connections.set(guild.id, {
        connection,
        player,
      });
      return { connection, player };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Push item into guild's queue
   * @param guildId Server Id to update queue
   * @param data    Item to be pushed
   */
  public pushItem(guildId: string, item: AudioResource) {
    const connection = this.connections.get(guildId);
    const queueController = connection.player.queueController;
    queueController.pushItem(item);
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
