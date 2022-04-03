import { SlashCommandBuilder } from "@discordjs/builders";
import { AudioPlayerStatus } from "@discordjs/voice";
import { Command } from "../DiscordClient";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops playback"),
  async execute(client, interaction) {
    // Get guild to disconnect
    const guildId = interaction.guild.id;
    const connection = client.connections.get(guildId);
    const player = connection?.player;

    // [Error] No song is currently playing
    if (
      !player ||
      (player.status !== AudioPlayerStatus.Playing &&
        player.status !== AudioPlayerStatus.Paused)
    ) {
      return interaction.reply("Nenhuma musica tocando");
    }

    // Pause player
    interaction.reply({ content: "blz", ephemeral: true });
    player.stop();
    player.queueController.reset();
  },
  usage: "/stop",
  aliases: [],
};
