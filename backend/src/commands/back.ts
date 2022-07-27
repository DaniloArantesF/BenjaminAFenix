import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../DiscordClient";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("back")
    .setDescription("Goes back to previous song in queue."),
  async execute(client, interaction) {
    // Get guild to modify playback
    const guildId = interaction.guild.id;
    const connection = client.connections.get(guildId);
    if (connection) {
      const { player } = connection;
      player.queueController.previous();
    }
    interaction.reply({ content: "opa", ephemeral: true });
  },
  usage: "/back",
  aliases: ["prev", "rewind"],
};
