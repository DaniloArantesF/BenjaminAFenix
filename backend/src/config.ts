import dotenv from "dotenv";
dotenv.config();

export const ENVIRONMENT = process.env.NODE_ENV ?? 'development';
export const PORT = 8000;
export const CLIENT_URL = process.env.CLIENT_URL;
export const DISCORD_API_BASE_URL = "https://discord.com/api";
export const CORS_ORIGINS = [CLIENT_URL];
// Time in ms where users are not allowed to send more than one
// interaction. The next command will be run only when cooldown is over.
// *Note* The discord api requires a reply within 3 seconds. If cooldown is greater than 3000, you need to defer reply and edit it later.
export const COOLDOWN_MS = 2500;
