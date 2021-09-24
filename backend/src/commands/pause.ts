import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '../DiscordClient';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause current playback'),
  async execute(client, interaction) {
    // Get guild to disconnect
    const guildId = interaction.guild.id;
    const { player } = client.connections.get(guildId);

    // [Error] No song is currently playing
    if (!player.isPlaying) {
      return interaction.reply("Nenhuma musica tocando");
    }

    // Pause player
    interaction.reply({ content: "Pausado, chefe", ephemeral: true });
    player.pause();
  },
  usage: ''
};
