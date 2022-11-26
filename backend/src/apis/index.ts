import { Router, Request, Response } from "express";
import DiscordClient from "../DiscordClient";
require("dotenv").config();

class BotAPI {
  router: Router;
  client: DiscordClient;

  constructor() {
    this.router = Router();
    this.router.get("/status", this.getBotStatus);
  }

  public setClient(client: DiscordClient) {
    this.client = client;
  }

  public async getBotStatus(req: Request, res: Response) {
    res.send({ status: "online" });
  }
}

export default new BotAPI();
