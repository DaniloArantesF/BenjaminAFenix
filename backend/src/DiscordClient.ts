import fs from 'fs';
import {
  Channel,
  Client,
  Collection,
  Guild,
  GuildChannel,
  GuildMember,
  User,
} from 'discord.js';
import { joinVoiceChannel, VoiceConnection } from '@discordjs/voice';
import type { ClientOptions } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import PlayerController from './PlayerController';
import { Namespace, Server, Socket } from 'socket.io';
import { channel } from 'diagnostics_channel';
import { EventBus } from './EventBus';

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

export interface Track {
  channelTitle: string;
  duration: number;
  title: string;
  id: string;
  user: string;
  thumbnail: string;
  service: Services;
}

export interface DiscordConnection {
  connection: VoiceConnection;
  channel: GuildChannel;
  player: PlayerController;
  timestamp: number;
}

class DiscordClient extends Client {
  static commands = new Collection<string, Command>();
  connections: Map<string, DiscordConnection | null>;
  ready: boolean;
  eventBus: EventBus;

  constructor(props: ClientOptions) {
    super(props);
    this.ready = false;
    this.connections = new Map(); // maps guild ids to voice connections
    this.eventBus = EventBus.getInstance();
    this.setUpCommands();
    // this.setUpEvents();

    /* Discord Events */
    this.on('ready', () => {
      console.log('Bot is ready!');

      // create empty connections to avoid errors
      const guildIds = this.guilds.cache.map((guild) => guild.id);
      guildIds.forEach((guildId) => {
        this.connections.set(guildId, null);
      });

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

      const player = new PlayerController(guild.id);
      connection.subscribe(player);

      const target = this.guilds.cache
        .get(guild.id)
        .channels.cache.get(channelId) as GuildChannel;

      const timestamp = Date.now();
      this.connections.set(guild.id, {
        connection,
        player,
        channel: target,
        timestamp,
      });

      // Emit event to web controller
      this.eventBus.dispatch('bot_connection', {
        guildId: guild.id,
        channel: target,
        timestamp
      });

      return { connection, player, channel: target, timestamp };
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
  public pushItem(guildId: string, item: Track) {
    const connection = this.connections.get(guildId);
    const queueController = connection.player.queueController;
    queueController.pushItem(item);
  }

  /**
   * Return guild from interaction
   */
  public getGuildFromInteraction(interaction: CommandInteraction): Guild {
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
    const guild = this.getGuildFromInteraction(interaction);
    const userId = interaction.member.user.id;
    const member = await this.getGuildMember(guild, userId);
    return member.voice.channelId;
  }

  public getGuild(guildId: string) {
    return this.guilds.cache.get(guildId);
  }

  // Notes: Later change this to only check in guilds the user
  // is actually in.
  public getUserCurrentGuild(id: string) {
    const usersOnline = this.getVoiceUsers();
    const connection = usersOnline.get(id);
    const userChannel = connection?.channel;
    const guild = connection?.guild;

    return {
      guild: {
        id: guild?.id,
        name: guild?.name,
        icon: guild?.icon,
        owner: guild?.ownerId,
      },
      channel: {
        id: userChannel?.id,
        name: userChannel?.name,
      },
    };
  }

  public getVoiceUsers() {
    type ConnectionState = {
      guild: Guild;
      channel: GuildChannel;
      user: User;
    };
    const usersOnline = new Map<string, ConnectionState>();

    const voiceChannels = this.getVoiceChannels();
    voiceChannels.forEach((curChannel) => {
      curChannel.members.forEach((member) => {
        usersOnline.set(member.user.id, {
          guild: member.guild,
          channel: curChannel,
          user: member.user,
        });
      });
    });

    return usersOnline;
  }

  public getVoiceChannels() {
    const channels: GuildChannel[] = this.guilds.cache.reduce(
      (accum, guild) => {
        return [...accum, ...guild.channels.cache.map((i) => i)];
      },
      []
    );

    return channels.filter((curChannel) => {
      return curChannel.isVoice();
    });
  }

  public getGuildVoiceChannels(guildId: string) {
    const channels = [
      ...this.guilds.cache.get(guildId as string).channels.cache.map((i) => i),
    ] as GuildChannel[];
    const voiceChannels = channels.filter((curChannel) => {
      return curChannel.isVoice();
    });
    const data = voiceChannels.map(({ type, id, name, members }) => {
      let onlineCount = members.size;
      // Dont count bot in users online
      if (members.get(this.user.id)) {
        onlineCount--;
      }
      return {
        type,
        id,
        name,
        onlineCount,
      };
    });

    return data;
  }

  public getChannelUserCount = (guildId: string, channelId: string) => {
    const guild = this.guilds.cache.get(guildId)
    const targetChannel = guild.channels.cache.get(channelId) as GuildChannel;

    return targetChannel.members.reduce((acc, cur) => {
      if (cur.id !== this.user.id) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }
}

export default DiscordClient;
