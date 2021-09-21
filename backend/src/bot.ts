import fs from 'fs';
import { Client, Collection, Intents } from 'discord.js';
import type { ClientOptions } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const TOKEN = process.env.DISCORD_TOKEN;

class DiscordClient extends Client {
  commands: Collection<string, any>;
  constructor(props: ClientOptions) {
    super(props);
    this.commands = new Collection();
    this.setUpCommands();
    this.setUpEvents();
  }

  private setUpCommands() {
    const commandFiles = fs.readdirSync('commands/').filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
      const command = require(`../commands/${file}`);
      this.commands.set(command.data.name, command);
    }
  }

  private setUpEvents() {
    const eventFiles = fs.readdirSync('events/').filter(file => file.endsWith('.ts'));

    for (const file of eventFiles) {
      const event = require(`../events/${file}`);
      if (event.once) {
        this.once(event.name, (...args) => event.execute(...args));
      } else {
        this.on(event.name, (...args) => event.execute(...args));
      }
    }
  }

}

const client = new DiscordClient({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

client.login(TOKEN);
export default client;