import express from 'express';
import Bot from './bot';
import http from 'http';

const app = express();
const server = http.createServer(app);
const bot = Bot(server);
const PORT = 8000;

app.get("/", (req, res) => {
  res.send("hello")
});

server.listen(PORT, () => {
  console.info(`Server started at http://localhost:${PORT}`);
});

