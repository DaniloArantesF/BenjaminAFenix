import { Router, Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import { CLIENT_URL, DISCORD_API_BASE_URL } from "../config";
import jwt from "jsonwebtoken";
import { DiscordUserResponse } from "./Discord";

require("dotenv").config();

const clientId = process.env.DISCORD_CLIENT_ID;
const clientSecret = process.env.DISCORD_CLIENT_SECRET;

interface DiscordTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface TokenPayload {
  userId: string;
  username: string;
  avatar: string;
  accessToken: string;
  refreshToken: string;
  iat: number;
  exp: number;
}

class Auth {
  router: Router;

  constructor() {
    this.router = Router();
    this.router.post("/code", this.getAccessToken);
    this.router.post("/refresh", this.refreshAccessToken);
    this.router.post("/login", this.logIn);
  }

  /** Given a code, get access token and create jwt token with user info */
  public logIn = async (req: Request, res: Response) => {
    const code = req.body?.code;
    if (!code) return res.sendStatus(400);

    try {
      const authRes: AxiosResponse<DiscordTokenResponse> = await axios.post(
        `${DISCORD_API_BASE_URL}/oauth2/token`,
        new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: `${CLIENT_URL}/login`,
          scope: "identify",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
        }
      );

      const {
        access_token: accessToken,
        expires_in: expiresIn,
        refresh_token: refreshToken,
      } = authRes.data;

      const userRes: AxiosResponse<DiscordUserResponse> = await axios.get(
        `${DISCORD_API_BASE_URL}/users/@me`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(userRes.data);
      const { id, username, avatar } = userRes.data;
      const token = jwt.sign(
        {
          userId: id,
          username,
          avatar,
          accessToken,
          refreshToken,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn }
      );

      return res.send({ token });
    } catch (error) {
      return res.sendStatus(error?.response?.status ?? 500);
    }
  };

  public async getAccessToken(req: Request, res: Response) {
    const code = req.body?.code;
    if (!code) {
      return res.sendStatus(400);
    }

    try {
      const authRes: AxiosResponse<DiscordTokenResponse> = await axios.post(
        `${DISCORD_API_BASE_URL}/oauth2/token`,
        new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: `${CLIENT_URL}/login`,
          scope: "identify",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
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
      // console.log(error.response.data)
      return res.sendStatus(error?.response?.status ?? 500);
    }
  }

  public async refreshAccessToken(req: Request, res: Response) {
    const token = req.body?.token;
    if (!token) {
      return res.sendStatus(400);
    }

    try {
      const { userId, username, avatar, refreshToken } = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
      ) as TokenPayload;

      const authRes: AxiosResponse<DiscordTokenResponse> = await axios.post(
        `${DISCORD_API_BASE_URL}/oauth2/token`,
        new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
        }
      );

      const newToken = jwt.sign(
        {
          userId,
          username,
          avatar,
          accessToken: authRes.data.access_token,
          refreshToken: authRes.data.refresh_token,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: authRes.data.expires_in }
      );

      return res.send({ newToken });
    } catch (error) {
      return res.sendStatus(error?.response?.status ?? 500);
    }
  }
}

export default new Auth();
