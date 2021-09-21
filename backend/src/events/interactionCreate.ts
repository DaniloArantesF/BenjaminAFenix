import DiscordClient from '../DiscordClient';

module.exports = {
	name: 'interactionCreate',
  async execute(interaction: any) {
    console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
    const command = DiscordClient.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
	},
};