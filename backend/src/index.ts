import express from 'express';
import socket, { Socket, Server } from 'socket.io';
import Bot from './bot';
import http from 'http';

const bot = Bot();
const app = express();
const PORT = 8000;

app.get("/", (req, res) => {
  res.send("hello")
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.info(`Server started at http://localhost:${PORT}`);
});

// Set up web socket
const io = new Server(server, { cors: { origin: '*' }});
const channel = io.of('/bot');

channel.on('connection', (socket: Socket) => {
  console.info(`Client ${socket.id} connected`)

  socket.on('user connected', (payload) => {
    console.info('User connected')
  })
})