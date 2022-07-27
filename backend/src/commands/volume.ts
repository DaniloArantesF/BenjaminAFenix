import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../DiscordClient";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Updates playback volume")
    .addNumberOption((option) =>
      option.setName("percentage").setDescription("0 - 100").setRequired(true)
    ),
  async execute(client, interaction) {
    const connection = client.connections.get(interaction.guild.id);
    if (!connection) {
      return interaction.reply({ content: "Please play a song before adjusting the volume.", ephemeral: true });
    }
    let arg = interaction.options.getNumber("percentage");

    // Volume constraints
    arg = arg < 0 ? 0 : arg;
    arg = arg > 100 ? 100 : arg;

    connection.player.setVolume(arg / 100);
    await interaction.reply({
      content: "nois",
      ephemeral: true,
    });
  },
  usage: "/volume <percentage>",
  aliases: ["vol"],
};
