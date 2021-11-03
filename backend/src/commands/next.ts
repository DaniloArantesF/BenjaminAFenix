import { SlashCommandBuilder } from '@discordjs/builders';
import { AudioPlayerStatus } from '@discordjs/voice';
import { Command } from '../DiscordClient';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('next')
    .setDescription('Moves to next song in queue.'),
  async execute(client, interaction) {
    // Get guild to modify playback
    const guildId = interaction.guild.id;
    const { player } = client.connections.get(guildId);
    player.queueController.next();
    interaction.reply({ content: "fechou", ephemeral: true });
  },
  usage: '/next',
  aliases: ['skip', 'forward'],
};
