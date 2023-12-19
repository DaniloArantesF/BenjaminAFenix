import express from "express";
import Bot from "./bot";
import http from "http";
import cors from "cors";
import DiscordClient from "./DiscordClient";
import Auth from "./apis/Auth";
import DiscordAPI from "./apis/Discord";
import YoutubeAPI from "./apis/Youtube";
import BotAPI from "./apis/";
import MetricsAPI from "./apis/Metrics";
import rateLimit from "express-rate-limit";
import { PORT, CLIENT_URL, ENVIRONMENT } from "./config";
import morgan from "morgan";

class App {
  public express: express.Application;
  public bot: DiscordClient;
  public server: http.Server;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();

    // Set up web server to use with socket.io
    this.server = http.createServer(this.express);

    // Create bot client and pass it to API
    // this.bot = Bot(this.server);
    // DiscordAPI.setClient(this.bot);
    // BotAPI.setClient(this.bot);

    this.server.listen(PORT, () => {
      console.log(`Server listening at ${PORT}`);
    });
  }

  private middleware() {
    this.express.set('trust proxy', 1);
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(express.json());

    const corsConfig = {
      origin: CLIENT_URL,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'x-access-token', 'XSRF-TOKEN'],
    }
    this.express.use(cors(corsConfig));
    this.express.options(
      "*",
      cors(corsConfig)
    );

    this.express.use(morgan(ENVIRONMENT === 'production' ? "tiny" : "dev"));
    this.express.use(
      rateLimit({
        windowMs: 1000,
        max: 5,
        message: "Exceeded 5 requests/s",
        headers: true,
      })
    );
  }

  private routes() {
    this.express.use("/", BotAPI.router);
    this.express.use("/auth", Auth.router);
    this.express.use("/discord", DiscordAPI.router);
    this.express.use("/youtube", YoutubeAPI.router);
    this.express.use("/metrics", MetricsAPI.router);
  }
}

export default new App().express;
