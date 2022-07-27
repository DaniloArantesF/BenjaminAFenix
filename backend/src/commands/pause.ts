import { SlashCommandBuilder } from "@discordjs/builders";
import { AudioPlayerStatus } from "@discordjs/voice";
import { Command } from "../DiscordClient";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses current playback"),
  async execute(client, interaction) {
    // Get guild to pause player
    const guildId = interaction.guild.id;
    const connection = client.connections.get(guildId);

    if (!connection) {
      return interaction.reply("Bot is not active.")
    }

    const { player } = connection;
    // No song is currently playing
    if (player.status !== AudioPlayerStatus.Playing) {
      return interaction.reply("No songs playing right now.");
    }

    // Pause player
    player.pause();
    await interaction.reply({ content: "Pausado, chefe", ephemeral: true });
  },
  usage: "/pause",
  aliases: ["p"],
};
