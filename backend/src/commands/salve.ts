import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '../DiscordClient';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('salve')
    .setDescription('Friendly greeting'),
  async execute(interaction: any) {
    // to get client instance from interaction use interaction.client
    await interaction.reply('pruu')
  },
  usage: '',
};