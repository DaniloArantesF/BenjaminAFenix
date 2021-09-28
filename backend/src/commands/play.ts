import { SlashCommandBuilder } from '@discordjs/builders';
import { AudioPlayerStatus } from '@discordjs/voice';
import YouTube from 'react-youtube';
import ytdl from 'ytdl-core';
import { Command } from '../DiscordClient';
import { getIdFromUrl, getYoutubeItem, searchYoutube } from '../lib/Youtube';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('play')
    .addStringOption((option) =>
      option
        .setName('song')
        .setDescription('<Url | Id | Query>')
        .setRequired(false)
    ),
  async execute(client, interaction) {
    const channelId = await client.getUserVoiceChannel(interaction);
    if (!channelId) {
      return interaction.reply('Entra num canal de voz mongol');
    }
    const request = interaction.options.getString('song');
    let connection = client.connections.get(interaction.guild.id);

    if (!request) {
      // either means unpause or malformed request
      if (connection?.player) {
        const player = connection.player;
        if (player.status === AudioPlayerStatus.Playing) {
          // [Error] Player is not paused
          return interaction.reply('ta me tirando porra');
        } else {
          // Unpause if player is paused
          player.unpause();
          return interaction.reply({
            content: 'tuts tuts caralho',
            ephemeral: true,
          });
        }
      } else {
        // [Error] No connection && no input
        return interaction.reply('ta me tirando porra');
      }
    }

    let item = null;

    // Determine request format
    if (ytdl.validateURL(request)) {
      // Handle URLs
      const id = getIdFromUrl(request);
      item = await getYoutubeItem(id);
    } else if (ytdl.validateID(request)) {
      // Handle IDs
      item = await getYoutubeItem(request);
    } else {
      // Handle Query
      item = (await searchYoutube(request))[0];
    }

    // Join channel if not connected
    if (!connection) {
      connection = await client.joinChannel(interaction.guild, channelId);
    }

    // Pushing item will push item into guild's queue & trigger a player update
    // Player update checks for queue's current track and plays if not playing
    connection.player.queueController.pushItem({ service: 1, ...item });
    interaction.reply('sente esse som cuzao');
  },
  usage: '',
};
