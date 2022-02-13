import { Router, Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import logger from '../Logger';
import config from '../config';
require('dotenv').config();

const clientId = process.env.DISCORD_CLIENT_ID;
const clientSecret = process.env.DISCORD_CLIENT_SECRET;

interface DiscordTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

class Auth {
  router: Router;

  constructor() {
    this.router = Router();
    this.router.post('/code', this.getAccessToken);
    this.router.post('/refresh', this.refreshAccessToken);
  }

  public async getAccessToken(req: Request, res: Response) {
    const code = req.body.code;
    if (!code) {
      return res.sendStatus(400).send({
        message: "No code in request",
      });
    }

    try {
      const authRes: AxiosResponse<DiscordTokenResponse> = await axios.post(
        'https://discord.com/api/oauth2/token',
        new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: `${config.CLIENT_URL}/login`,
          scope: 'identify',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
        }
      );

      const {
        access_token: accessToken,
        expires_in: expiresIn,
        refresh_token: refreshToken,
      } = authRes.data;

      res.send({
        accessToken,
        refreshToken,
        expiresIn,
      });
    } catch (error) {
      logger.error({
        function: 'getAccessToken',
        code,
        error: error.data.error,
        description: error.data.error_description
      });
      res.send(401);
    }
  }

  public async refreshAccessToken(req: Request, res: Response) {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      return res.sendStatus(400);
    }

    try {
      const authRes: AxiosResponse<DiscordTokenResponse> = await axios.post(
        'https://discord.com/api/oauth2/token',
        new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
        }
      );

      return res.send({
        accessToken: authRes.data.access_token,
        refreshToken: authRes.data.refresh_token,
        expiresIn: authRes.data.expires_in
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new Auth();
