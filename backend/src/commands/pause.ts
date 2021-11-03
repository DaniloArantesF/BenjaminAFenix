import { SlashCommandBuilder } from '@discordjs/builders';
import { AudioPlayerStatus } from '@discordjs/voice';
import { Command } from '../DiscordClient';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses current playback'),
  async execute(client, interaction) {
    // Get guild to pause player
    const guildId = interaction.guild.id;
    const { player } = client.connections.get(guildId);

    // [Error] No song is currently playing
    if (player.status !== AudioPlayerStatus.Playing) {
      return interaction.reply("Nenhuma musica tocando");
    }

    // Pause player
    interaction.reply({ content: "Pausado, chefe", ephemeral: true });
    player.pause();
  },
  usage: '/pause',
  aliases: ['p'],
};
