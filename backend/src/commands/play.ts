import { SlashCommandBuilder } from '@discordjs/builders';
import { AudioPlayerStatus } from '@discordjs/voice';
import ytdl from 'ytdl-core';
import { Track, Command, Services } from '../DiscordClient';
import {
  getIdFromUrl,
  getYoutubeItem,
  getYoutubeUrl,
  searchYoutube,
} from '../apis/Youtube';
import { MessageEmbed } from 'discord.js';

export const PlayEmbed = (topItems: Track[]) => {
  const fields = [
    { name: 'Currently Playing', value: topItems[0].title, inline: true },
  ];
  if (topItems.length > 1) {
    fields.push({ name: 'Up Next', value: topItems[1].title, inline: true });
  }

  return new MessageEmbed()
    .setColor('#b700ff')
    .setTitle('Queue')
    .setURL(getYoutubeUrl(topItems[0].id))
    .setThumbnail(
      'https://media1.tenor.com/images/75f1a082d67bcd34cc4960131e905bed/tenor.gif?itemid=5505046'
    )
    .addFields(...fields, { name: '\u200B', value: '\u200B' } /* blank field */)
    .setFooter('To see full queue use /queue');
};

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays specified song or unpauses playback')
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

    // Convert YoutubeItem to track as expected by player
    const track: Track = {
      channelTitle: item.channelTitle,
      duration: item.duration,
      title: item.title,
      id: item.id,
      user: interaction.user.tag,
      service: Services.Youtube,
    }

    // Pushing item will push item into guild's queue & trigger a player update
    // Player update checks for queue's current track and plays if not playing
    connection.player.queueController.pushItem(track);
    interaction.reply('sente esse som cuzao');

    // Remove old embeds and save new
    if (connection.player.lastEmbed) {
      connection.player.lastEmbed.delete();
    }
    connection.player.lastEmbed = await interaction.channel.send({
      embeds: [PlayEmbed(connection.player.queueController.topItems())],
    });
  },
  usage: '/play <url, id, >',
  // TODO: add examples
};
