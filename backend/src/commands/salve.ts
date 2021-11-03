import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '../DiscordClient';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('salve')
    .setDescription('Friendly greeting :)'),
  async execute(client, interaction) {
    // to get client instance from interaction use interaction.client
    await interaction.reply('pruu')
  },
  usage: '/salve',
  aliases: ['pru'],
};