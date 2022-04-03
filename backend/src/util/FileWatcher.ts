/**
 * Discord slash commands must be submitted through the API for every change. (e.g. name, description)
 * This utility hashes the contents of the command files and compares it to a previous
 * hash
 */
import fs from "fs";
import crypto from "crypto";

const SAVE_PATH = "./cmds.cache";
const AUTOSUBMIT = 0;

const FileWatcher = () => {
  let prevCommands = null;
  const hashes = [];
  let currentHash;

  // Try to get hashes in memory
  if (fs.existsSync(SAVE_PATH)) {
    prevCommands = fs.readFileSync(SAVE_PATH);
  }

  // Hash command files
  const commandFiles = fs
    .readdirSync("src/commands/")
    .filter((file) => file.endsWith(".ts"));

  let buff;
  for (const file of commandFiles) {
    currentHash = crypto.createHash("sha256");
    buff = fs.readFileSync(`src/commands/${file}`);
    currentHash.update(buff.toString("utf-8"));
    hashes.push(currentHash.digest("hex"));
  }

  if (!prevCommands || prevCommands.toString("utf-8") !== hashes.join(",")) {
    console.log("Command files changed.");
    if (AUTOSUBMIT) require("../RegisterCommands.ts");
  } else {
    console.info("Commands did not change. Skipping register.");
  }

  // Save hash to memory
  fs.writeFileSync(SAVE_PATH, hashes.join(","));
};

export default FileWatcher;
