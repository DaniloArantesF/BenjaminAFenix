import { SlashCommandBuilder } from '@discordjs/builders';
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
    const request = interaction.options.getString('song');
    const connection = client.connections.get(interaction.guild.id);

    if (!request) {
      if (connection.player) {
        const player = connection.player;
        if (player.isPlaying) {
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

    client.joinChannel(interaction.guild, channelId);
    client.playResource(interaction.guild.id, { service: 1, item });
    interaction.reply('tocando');
  },
  usage: '',
};
