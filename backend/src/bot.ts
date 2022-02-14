import { CommandInteraction, Intents } from 'discord.js';
import DiscordClient from './DiscordClient';
import dotenv from 'dotenv';
//import FileWatcher from './util/FileWatcher';
import http from 'http';
import WebClient from './WebClient';
dotenv.config();
import { COOLDOWN_MS } from './config';
//FileWatcher();

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
  const client = new DiscordClient({ intents });
  const webController = new WebClient(server, client);
  const cooldown = DiscordClient.userCooldown;

  client.on('interactionCreate', async (interaction: CommandInteraction) => {
    const command = DiscordClient.commands.get(interaction.commandName);
    if (!command) return;

    try {
      const user = interaction.member.user.id;
      const lastInteraction = cooldown.get(user) ?? -1;
      const timeLeft = lastInteraction === -1 ? 0 : (lastInteraction + COOLDOWN_MS) - Date.now();

      if (timeLeft > 0) {
        // User is in cooldown
        console.info(`${user} is in cooldown for ${timeLeft}`);
        cooldown.set(user, Date.now());
        setTimeout(() => {
          command.execute(client, interaction);
        }, timeLeft)
      } else {
        cooldown.set(user, Date.now());
        command.execute(client, interaction);
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Deu ruim meu bom', ephemeral: true });
    }
  });

  client.login(TOKEN);
  return client;
};

export default Bot;
