import { Router, Request, Response } from 'express';
import client from 'prom-client';

const register = new client.Registry();
client.collectDefaultMetrics({register});

class MetricsAPI {
  router: Router

  constructor() {
    this.router = Router();
    this.router.get('/', async (req: Request, res: Response) => {
      res.setHeader('Content-Type', register.contentType);
      res.send(await register.metrics());
    });
  }
}

export default new MetricsAPI();