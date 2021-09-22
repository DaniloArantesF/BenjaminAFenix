import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '../DiscordClient';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('threaten')
    .setDescription('Intimidates an user')
    .addUserOption((option) =>
      option
        .setName('target')
        .setDescription('User to threaten')
        .setRequired(true)
    ),
  async execute(client, interaction) {
    const target = interaction.options.getUser('target');
    interaction.reply(`${target} te cuida seu merda` );
  },
  usage: '/threaten target:<user_to_threaten>',
};
