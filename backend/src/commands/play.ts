import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '../DiscordClient';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('play'),
  async execute(client, interaction) {
    client.joinChannelFromInteraction(interaction);
    interaction.reply('tocando');
  },
  usage: ''
};
