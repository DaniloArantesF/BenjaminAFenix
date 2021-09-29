import { SlashCommandBuilder } from '@discordjs/builders';
import { AudioPlayerStatus } from '@discordjs/voice';
import ytdl from 'ytdl-core';
import { AudioResource, Command } from '../DiscordClient';
import { getYoutubeUrl } from '../lib/Youtube';
import { MessageEmbed } from 'discord.js';

export const QueueEmbed = (queue: AudioResource[]) => {
  const fields = [
    { name: `1 - ${queue[0].title}`, value: getYoutubeUrl(queue[0].id) },
    ...queue.slice(1, queue.length).map((item, index) => {
      return {
        name: `${index + 2} - ${item.title}`,
        value: getYoutubeUrl(item.id),
        inline: true,
      };
    }),
  ];

  return new MessageEmbed()
    .setColor('#b700ff')
    .setTitle('Server Queue :headphones:')
    .setThumbnail(
      'https://media1.tenor.com/images/75f1a082d67bcd34cc4960131e905bed/tenor.gif?itemid=5505046'
    )
    .addFields(...fields)
    .setFooter('To add songs to queue use /play');
};

export const command: Command = {
  data: new SlashCommandBuilder().setName('queue').setDescription('queue'),
  async execute(client, interaction) {
    const connection = client.connections.get(interaction.guild.id);
    interaction.reply({ content: 'pru', ephemeral: true });

    // Remove old embeds and save new
    if (connection.player.lastEmbed) {
      connection.player.lastEmbed.delete();
    }
    connection.player.lastEmbed = await interaction.channel.send({
      embeds: [QueueEmbed(connection.player.queueController.items)],
    });
  },
  usage: '',
};
