import express from 'express';
import Bot from './Bot';
import http from 'http';
import cors from 'cors';
import DiscordClient from './DiscordClient';
import Auth from './lib/Auth';
import DiscordAPI from './lib/Discord';
import rateLimit from 'express-rate-limit';

const PORT = 8000;

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
    this.bot = Bot(this.server);

    this.server.listen(PORT, () => {
      console.log(`Server listening at ${PORT}`);
    });
  }

  private middleware() {
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(express.json());
    this.express.use(cors());
    this.express.options('*', cors());

    // Rate limiter
    this.express.use(rateLimit({
      windowMs: 60 * 1000, // One minute in ms,
      max: 100,
      message: 'Exceeded 100 requests/min',
      headers: true,
    }));
  }

  private routes() {
    this.express.use('/auth', Auth.router);
    this.express.use('/discord', DiscordAPI.router);
  }
}

export default new App().express;
