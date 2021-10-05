import { Router, Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
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
  id: string,
  name: string,
  icon: string,
  owner: boolean,
  permissions: number,
  features: string[],
  permissions_new: string
}

class DiscordAPI {
  router: Router;

  constructor() {
    this.router = Router();
    this.router.get('/user', this.getDiscordUser);
    this.router.get('/guilds', this.getUserGuilds);
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

    const { id, username, avatar, } = userRes.data;
    return res.send({ id, username, avatar, });
  }

  public async getUserGuilds(req: Request, res: Response) {
    const accessToken = req.query.accessToken;
    const guildsRes: AxiosResponse<GuildData[]> = await axios.get(
      'https://discord.com/api/users/@me/guilds',
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.send({ guilds: guildsRes.data});
  }
}

export default new DiscordAPI();
