module.exports = {
	name: 'interactionCreate',
  async execute(interaction: any) {
    console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
    console.log(interaction);
    if (!interaction.isCommand()) return;
    const { commandName } = interaction;

    switch (commandName) {
      case 'salve':
        await interaction.reply('salve parsa');
    }
	},
};