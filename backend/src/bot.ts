import { Intents } from 'discord.js';
import DiscordClient from './DiscordClient';
import dotenv from 'dotenv';
import FileWatcher from './util/FileWatcher';
import http from 'http';
import { Server } from 'socket.io';
dotenv.config();
FileWatcher();

const TOKEN = process.env.DISCORD_TOKEN;
const intents = [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
  Intents.FLAGS.GUILD_INTEGRATIONS,
  Intents.FLAGS.GUILD_INVITES,
  Intents.FLAGS.GUILD_VOICE_STATES,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Intents.FLAGS.GUILD_MESSAGE_TYPING,
  Intents.FLAGS.DIRECT_MESSAGES,
  Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
  Intents.FLAGS.DIRECT_MESSAGE_TYPING,
];

const Bot = (server: http.Server) => {
  const io = new Server(server, { cors: { origin: '*' } });
  const client = new DiscordClient({ intents }, io);

  client.on('interactionCreate', async (interaction: any) => {
    const command = DiscordClient.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(client, interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Deu ruim meu bom', ephemeral: true });
    }
  });

  client.login(TOKEN);
  return client;
};

export default Bot;
