import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '../DiscordClient';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('threaten')
    .setDescription('Intimidates an user')
    .addStringOption((option) =>
      option
        .setName('input')
        .setDescription('User to threaten')
        .setRequired(true)
    ),
  async execute(interaction: any) {
    // to get client instance from interaction use interaction.client
    await interaction.reply('pruu');
  },
  usage: '',
};
