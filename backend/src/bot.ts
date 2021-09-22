import { Intents } from 'discord.js';
import DiscordClient from './DiscordClient';
import dotenv from 'dotenv';
dotenv.config();

const TOKEN = process.env.DISCORD_TOKEN;
const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES];
const client = new DiscordClient({ intents });

client.on('interactionCreate', async (interaction: any) => {
  console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
  const command = DiscordClient.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(client, interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
})

client.login(TOKEN);
export default client;