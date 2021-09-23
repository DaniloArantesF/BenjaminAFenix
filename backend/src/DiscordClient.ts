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

import { AudioPlayerStatus, StreamType, createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice';
import type { ClientOptions } from 'discord.js';
import type { APIMessageInteraction } from 'discord-api-types';
import { CommandInteraction } from 'discord.js';
import ytdl from 'ytdl-core';

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

class DiscordClient extends Client {
  static commands = new Collection<string, Command>();
  ready: boolean;

  constructor(props: ClientOptions) {
    super(props);
    this.ready = false;
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

  public async joinChannelFromInteraction(
    interaction: CommandInteraction
  ): Promise<number> {
    try {
      const guild = this.getGuild(interaction);
      const userId = interaction.member.user.id;
      const member = await this.getGuildMember(guild, userId);

      const connection = joinVoiceChannel({
        channelId: member.voice.channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
      });

      const stream = ytdl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
        filter: 'audioonly',
      });
      
      const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
      const player = createAudioPlayer();

      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Idle, () => connection.destroy());
      return 0;
    } catch (error) {
      console.error(error);
      return -1;
    }
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

  public joinChannel(channel: any): void {
    return channel.join();
  }
}

export default DiscordClient;
