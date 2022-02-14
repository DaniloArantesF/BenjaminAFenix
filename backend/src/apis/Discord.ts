import { Router, Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import DiscordClient from '../DiscordClient';
import { GuildChannel } from 'discord.js/typings/index.js';
import { DISCORD_API_BASE_URL } from '../config';
require('dotenv').config();

const clientId = process.env.DISCORD_CLIENT_ID;
const clientSecret = process.env.DISCORD_CLIENT_SECRET;

interface DiscordUserResponse {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: string | null;
  banner_color: number | null;
  accent_color: number | null;
  locale: string;
  mfa_enabled: boolean;
}

interface GuildData {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: number;
  features: string[];
  permissions_new: string;
}

class DiscordAPI {
  router: Router;
  client: DiscordClient;

  constructor() {
    this.router = Router();
    this.router.get('/user', this.getDiscordUser.bind(this));
    this.router.get('/guilds', this.getUserGuilds.bind(this));
    this.router.get('/channels', this.getGuildVoiceChannels.bind(this));
    this.router.get('/connection', this.getUserConnection.bind(this));
    this.client = null;
  }

  public setClient(client: DiscordClient) {
    this.client = client;
  }

  public async getDiscordUser(req: Request, res: Response) {
    const accessToken = req.query.accessToken;
    if (!accessToken) return res.sendStatus(401);

    try {
      const userRes: AxiosResponse<DiscordUserResponse> = await axios.get(
        `${DISCORD_API_BASE_URL}/users/@me`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { id, username, avatar } = userRes.data;
      return res.send({ id, username, avatar });
    } catch (error) {
      return res.sendStatus(error?.response?.status ?? 500);
    }
  }

  public async getUserConnection(req: Request, res: Response) {
    const accessToken = req.query.accessToken;
    const id = req.query.id as string;
    if (!accessToken) return res.sendStatus(401);
    if (!id) return res.sendStatus(400);

    // get current guild & channel the user is connected to
    try {
      const connection = this.client.getUserCurrentGuild(id);
      return res.send(connection);
    } catch (error) {
      return res.sendStatus(error?.response?.status ?? 500);
    }
  }

  public async getUserGuilds(req: Request, res: Response) {
    const accessToken = req.query.accessToken;
    if (!accessToken) return res.sendStatus(401);

    try {
      const guildsRes: AxiosResponse<GuildData[]> = await axios.get(
        `${DISCORD_API_BASE_URL}/users/@me/guilds`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      /**
       * Check which guilds the bot is a member and cleanup data
       */
      const guilds = guildsRes.data.map(({ id, name, icon, owner, }) => {
        return {
          id,
          name,
          icon,
          owner,
          allowed: this.client.guilds.cache.get(id) !== undefined,
        };
      });
      return res.send({ guilds });
    } catch (error) {
      return res.sendStatus(error?.response?.status ?? 500);
    }
  }

  public async getGuildVoiceChannels(req: Request, res: Response) {
    const guildId = req.query.guildId as string;
    if (!guildId) return res.sendStatus(400);
    if (!this.client) return res.sendStatus(500);

    try {
      const data = this.client.getGuildVoiceChannels(guildId);
      return res.send({
        channels: data,
      });
    } catch (error) {
      console.error(error);
      return res.sendStatus(error?.response?.status ?? 500);
    }
  }
}

export default new DiscordAPI();
