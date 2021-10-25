import { Router, Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import DiscordClient from '../DiscordClient';
import logger from '../Logger';
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
    this.client = null;
  }

  public setClient(client: DiscordClient) {
    this.client = client;
  }

  public async getDiscordUser(req: Request, res: Response) {
    const accessToken = req.query.accessToken;
    console.log(accessToken);
    const userRes: AxiosResponse<DiscordUserResponse> = await axios.get(
      'https://discord.com/api/users/@me',
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { id, username, avatar } = userRes.data;
    return res.send({ id, username, avatar });
  }

  public async getUserGuilds(req: Request, res: Response) {
    const accessToken = req.query.accessToken;
    if (!accessToken) return res.sendStatus(400);

    try {
      const guildsRes: AxiosResponse<GuildData[]> = await axios.get(
        'https://discord.com/api/users/@me/guilds',
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return res.send({ guilds: guildsRes.data });
    } catch (error) {
      logger.error({
        function: 'getUserGuilds',
        error: error.data,
      });
      return res.status(401);
    }
  }

  public async getGuildVoiceChannels(req: Request, res: Response) {
    const { guildId } = req.query;
    if (!guildId) return res.sendStatus(400);
    if (!this.client) return res.sendStatus(500);

    const channels = this.client.guilds.cache.get(guildId as string)?.channels
      .cache;
    const data = [];
    if (!channels) return res.sendStatus(404);
    for (const channelId of channels.keys()) {
      const { type, id, name } = channels.get(channelId);
      if (type === 'GUILD_VOICE') data.push({ type, id, name });
    }

    return res.send({
      channels: data,
    });
  }
}

export default new DiscordAPI();
