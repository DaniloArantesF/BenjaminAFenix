import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '../DiscordClient';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('Disconnects bot from server'),
  async execute(client, interaction) {
    // Get guild to disconnect
    const guildId = interaction.guild.id;

    // [Error] No connection in this guild
    if (!client.connections.get(guildId)) {
      return interaction.reply(":angry:");
    }

    // Disconnect then remove connection from map
    interaction.reply("flw mens :rocket:");
    client.connections.get(guildId).connection.destroy();
    client.connections.delete(guildId);
  },
  usage: '/disconnect'
};
