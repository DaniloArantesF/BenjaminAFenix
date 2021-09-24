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
        .setName('link')
        .setDescription('song link')
        .setRequired(true)
    ),
  async execute(client, interaction) {
    const channelId = await client.getUserVoiceChannel(interaction);
    const request = interaction.options.getString('link');
    if (!request) { // Stop if no user input
      return interaction.reply('deu ruim');
    }

    let item = null;

    // Check request format
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
    client.playResource(interaction.guild.id, { service: 1, item })
    interaction.reply('tocando');
  },
  usage: '',
};
