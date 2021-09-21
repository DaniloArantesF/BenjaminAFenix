import { Intents } from 'discord.js';
import DiscordClient from './DiscordClient';
import dotenv from 'dotenv';
dotenv.config();

const TOKEN = process.env.DISCORD_TOKEN;
const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES];
const client = new DiscordClient({ intents });
client.login(TOKEN);

export default client;