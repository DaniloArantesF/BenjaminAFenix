import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('salve')
    .setDescription('Friendly greeting'),
  async execute(interaction: any) {
    // to get client instance from interaction use interaction.client
    await interaction.reply('pruu')
  }
}