import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '../DiscordClient';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('Disconnect bot from server'),
  async execute(client, interaction) {
    console.log("TODO");
  },
  usage: ''
};
