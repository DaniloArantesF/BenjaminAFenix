/**IMPORTANT**
 * Only run this file if commands have been added or edited.
 * Else skip it during init process
 */
import fs from "fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import dotenv from "dotenv";
dotenv.config();

const TOKEN = process.env.DISCORD_TOKEN;
const commands = [];
const commandFiles = fs
  .readdirSync("src/commands/")
  .filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
  const { command } = require(`./commands/${file}`);
  if (!command?.data) continue; // Ignore empty files
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_GUILD_ID
      ),
      { body: commands }
    );
    console.info("Successfully registered app commands");
  } catch (error) {
    console.error(error);
  }
})();

export default {};
