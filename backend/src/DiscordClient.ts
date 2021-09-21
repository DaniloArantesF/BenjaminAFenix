import fs from 'fs';
import { Client, Collection, Intents } from 'discord.js';
import type { ClientOptions } from 'discord.js';
import type { APIMessageInteraction } from 'discord-api-types';

export interface Command {
  data: {
    name: string,
    options: any,
    description: string,
    defaultPermissions?: any,
  },
  aliases?: string[],
  args?: boolean,
  execute(interaction: APIMessageInteraction): void,
  guildOnly?: boolean,
  usage: string,
}

class DiscordClient extends Client {
  static commands = new Collection<string, Command>();
  constructor(props: ClientOptions) {
    super(props);
    this.setUpCommands();
    this.setUpEvents();
  }

  private setUpCommands() {
    const commandFiles = fs.readdirSync('src/commands/').filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
      const { command } = require(`./commands/${file}`);
      DiscordClient.commands.set(command.data.name, command);
    }
  }

  private setUpEvents() {
    const eventFiles = fs.readdirSync('src/events/').filter(file => file.endsWith('.ts'));

    for (const file of eventFiles) {
      const event = require(`./events/${file}`);
      if (event.once) {
        this.once(event.name, (...args) => event.execute(...args));
      } else {
        this.on(event.name, (...args) => event.execute(...args));
      }
    }
  }

}

export default DiscordClient;