import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '../DiscordClient';
import { CommandInteraction } from 'discord.js';

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
  async execute(interaction: CommandInteraction) {
    const target = interaction.options.getUser('target');
    interaction.reply(`${target} te cuida seu merda` );
  },
  usage: '/threaten target:<user_to_threaten>',
};
