import { SlashCommandBuilder } from '@discordjs/builders';
import { AudioPlayerStatus } from '@discordjs/voice';
import { Command } from '../DiscordClient';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('back')
    .setDescription('Goes back to previous song in queue.'),
  async execute(client, interaction) {
    // Get guild to modify playback
    const guildId = interaction.guild.id;
    const { player } = client.connections.get(guildId);
    player.queueController.previous();
    interaction.reply({ content: "opa", ephemeral: true });
  },
  usage: '/back'
};
