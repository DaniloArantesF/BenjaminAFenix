/**
 * Controller for web clients connecting to the bot
 * This class is responsible for managing clients, handling
 * commands and relaying back to the bot controller
 */
import { Namespace, Server, Socket } from "socket.io";
import http from "http";
import DiscordClient, { DiscordConnection, Track } from "./DiscordClient";
import { EventBus } from "./EventBus";
import { AudioPlayerStatus } from "@discordjs/voice";
import { QueueState } from "./QueueController";
import actions from "./util/actions";

// Web clients are created in the connection event handler
// Each web client is connected to one guild at a time
// On get_player event handler you should check if that client is
// already connected and if so leave the previous guild
export interface WebConnection {
  socket: Socket;
  guildId: string;
  username: string;
}

export interface PlayerState {
  guildId: string;
  currentTrack: Track;
  progress: number;
  status: AudioPlayerStatus;
  volume: number;
  queue: QueueState;
}

export interface PlaybackState {
  guildId: string;
  status: AudioPlayerStatus;
  volume: number;
  progress: number;
  timestamp: number;
}

class WebClient {
  io: Server;
  server: Namespace;
  discordClient: DiscordClient;
  webClients: Map<string, WebConnection>;
  connections: Map<string, DiscordConnection | null>;
  eventBus: EventBus;

  constructor(server: http.Server, discordClient: DiscordClient) {
    this.io = new Server(server, { cors: { origin: "*" } });
    this.discordClient = discordClient;
    this.connections = this.discordClient.connections;
    this.webClients = new Map();
    this.server = this.io.of("/bot");
    this.server.on("connection", (socket: Socket) => {
      socket.on("player_connect", (payload) =>
        this.createConnection(socket, payload)
      );
      socket.on("get_player", (payload) => this.getPlayer(socket, payload));
      socket.on("join_channel", (payload) => this.joinChannel(socket, payload));
      socket.on("set_queue_position", (payload) =>
        this.setQueuePosition(socket, payload)
      );
      socket.on("request_track", (payload) =>
        this.requestTrack(socket, payload)
      );
      socket.on("unpause", (payload) => this.unpause(socket, payload));
      socket.on("pause", (payload) => this.pause(socket, payload));
      socket.on("next", (payload) => this.next(socket, payload));
      socket.on("prev", (payload) => this.prev(socket, payload));
      socket.on("shuffle", (payload) => this.shuffle(socket, payload));
      socket.on("repeat", (payload) => this.repeat(socket, payload));
      socket.on("volume", (payload) => this.volume(socket, payload));
      socket.on("disconnect", (payload) => this.disconnect(socket, payload));
      socket.on("leave_channel", (payload) =>
        this.leaveChannel(socket, payload)
      );
    });

    this.eventBus = EventBus.getInstance();
    this.eventBus.register("player_update", this.handlePlayerUpdate.bind(this));
    this.eventBus.register(
      "playback_state",
      this.handlePlaybackUpdate.bind(this)
    );
    this.eventBus.register(
      "channel_update",
      this.handleChannelUpdate.bind(this)
    );
  }

  /**
   * Function used to initiate a connection with a web client
   * If client exists and is connected to another guild,
   * disconnect it. Otherwise add it to the web clients list.
   * @param socket
   * @param payload
   * @returns
   */
  public createConnection = (socket: Socket, payload: any) => {
    const guildId = payload.guildId;
    const username = payload.username;
    if (!guildId) return;

    // Check if client exists
    const client = this.webClients.get(socket.id);

    if (client) {
      // Disconnect client from previous room before joining
      console.log(`Disconnecting ${socket.id} from ${client.guildId}`);
      socket.leave(client.guildId);
    }
    console.log(`${username} connected as ${socket.id}.`);
    this.webClients.set(socket.id, {
      socket,
      guildId,
      username,
    });
    socket.join(guildId);

    const connection = this.discordClient.connections.get(guildId);
    if (connection) {
      const { channel, timestamp } = connection;
      const onlineCount = this.discordClient.getChannelUserCount(
        guildId,
        channel.id
      );
      socket.emit("channel_update", {
        channel: {
          name: channel.name,
          id: channel.id,
          onlineCount,
          timestamp,
        },
      });
    } else {
      socket.emit("channel_update", {
        channel: null,
      });
    }
    return this.getPlayer(socket, payload);
  };

  public getPlayer = (socket: Socket, payload: any) => {
    const { guildId } = payload;

    // Check if bot is active in this guild
    if (!this.connections.get(guildId)) {
      return socket.emit("not_active");
    }

    // Otherwise send queue to client
    const { player } = this.connections.get(guildId);
    socket.emit("player_update", player.getPlayerState());
  };

  public getChannel = (socket: Socket, payload: any) => {
    const { guildId } = payload;

    if (!this.connections.get(guildId)) {
      return socket.emit("not_active");
    }

    const { channel, timestamp } = this.connections.get(guildId);
    const onlineCount = this.discordClient.getChannelUserCount(
      guildId,
      channel.id
    );
    socket.emit("channel_update", {
      channel: { name: channel.name, id: channel.id, onlineCount, timestamp },
    });
  };

  public joinChannel = async (socket: Socket, payload: any) => {
    const { guildId, channelId } = payload;

    const guild = this.discordClient.getGuild(guildId);
    const { player } = await this.discordClient.joinChannel(guild, channelId);
    socket.emit("player_update", player.getPlayerState());
  };

  public setQueuePosition = (socket: Socket, payload: any) => {
    const position: number = payload.position;
    const { username, guildId } = this.webClients.get(socket.id);
    if (!guildId) return console.error("Web client not found", payload);

    const { player } = this.connections.get(guildId);
    player.queueController.setPosition(position);
    const track = player.queueController.getTrack();
    this.server.to(guildId).emit("log_message", {
      message: actions.CHANGE_TRACK(username, track?.title),
      timestamp: Date.now(),
    });
  };

  public requestTrack = (socket: Socket, payload: any) => {
    const track: Track = payload?.track;
    if (!track) return;
    if (!this.webClients.has(socket.id)) {
      // TODO: send error payload and redirect client
      return console.error("Web client not found", payload);
    }
    const { username, guildId } = this.webClients.get(socket.id);
    const { player } = this.connections.get(guildId);
    player.queueController.pushItem(track);

    this.server.to(guildId).emit("log_message", {
      message: actions.ADD_TRACK(username, track.title),
      timestamp: Date.now(),
    });
  };

  public unpause = (socket: Socket, payload: any) => {
    const { username, guildId } = this.webClients.get(socket.id);
    const { player } = this.connections.get(guildId);
    player.unpause();
    this.server.to(guildId).emit("log_message", {
      message: actions.PLAY(username),
      timestamp: Date.now(),
    });
  };

  public pause = (socket: Socket, payload: any) => {
    const { username, guildId } = this.webClients.get(socket.id);
    const { player } = this.connections.get(guildId);
    player.pause();
    clearInterval(player.playerInterval);
    player.playerInterval = null;
    this.server.to(guildId).emit("log_message", {
      message: actions.PAUSE(username),
      timestamp: Date.now(),
    });
  };

  public next = (socket: Socket, payload: any) => {
    const { username, guildId } = this.webClients.get(socket.id);
    const { player } = this.connections.get(guildId);
    const prevTrack = player.queueController.getTrack();
    player.queueController.next();

    // Dont emit event if this is the first track
    if (prevTrack) {
      this.server.to(guildId).emit("log_message", {
        message: actions.SKIP_TRACK(username, prevTrack.title),
        timestamp: Date.now(),
      });
    }
  };

  public prev = (socket: Socket, payload: any) => {
    const { username, guildId } = this.webClients.get(socket.id);
    const { player } = this.connections.get(guildId);
    player.queueController.previous();
    const curTrack = player.queueController.getTrack();
    if (curTrack) {
      this.server.to(guildId).emit("log_message", {
        message: actions.PREV_TRACK(username, curTrack.title),
        timestamp: Date.now(),
      });
    }
  };

  public shuffle = (socket: Socket, payload: any) => {
    const { username, guildId } = this.webClients.get(socket.id);
    const { player } = this.connections.get(guildId);
    player.queueController.setShuffle(payload.shuffle);
    const status = player.queueController.shuffle ? "on" : "off";

    this.server.to(guildId).emit("shuffle", {
      shuffle: player.queueController.shuffle,
    });

    this.server.to(guildId).emit("log_message", {
      message: actions.SHUFFLE(username, status),
      username,
      timestamp: Date.now(),
    });
  };

  public repeat = (socket: Socket, payload: any) => {
    const { username, guildId } = this.webClients.get(socket.id);
    const { player } = this.connections.get(guildId);
    player.queueController.setRepeat(payload.repeat);
    const status = player.queueController.repeat ? "on" : "off";

    this.server.to(guildId).emit("repeat", {
      repeat: player.queueController.repeat,
    });

    this.server.to(guildId).emit("log_message", {
      message: actions.REPEAT(username, status),
      username,
      timestamp: Date.now(),
    });
  };

  public volume = (socket: Socket, payload: any) => {
    const { username, guildId } = this.webClients.get(socket.id);
    const { player } = this.connections.get(guildId);
    const volume = payload.volume;
    player.setVolume(volume);
    this.server.to(guildId).emit("log_message", {
      message: actions.VOLUME(username, volume),
      username,
      timestamp: Date.now(),
    });
  };

  public disconnect = (socket: Socket, payload: any) => {
    // Remove socket from guild room and delete entry in clients map
    if (this.webClients.get(socket.id)) {
      socket.leave(this.webClients.get(socket.id).guildId);
      this.webClients.delete(socket.id);
    }
  };

  public handlePlayerUpdate = (payload: PlayerState) => {
    const { guildId, currentTrack, progress, status, volume, queue } = payload;
    this.server.to(guildId).emit("player_update", payload);
  };

  public handlePlaybackUpdate = (payload: PlaybackState) => {
    const { guildId, status, volume, progress, timestamp } = payload;
    this.server.to(guildId).emit("playback_state", payload);
  };

  public handleChannelUpdate = (payload: any) => {
    const { guildId, channel, timestamp } = payload;
    const onlineCount = this.discordClient.getChannelUserCount(
      guildId,
      channel.id
    );
    this.server.to(guildId).emit("channel_update", {
      channel: {
        name: channel.name,
        id: channel.id,
        onlineCount,
        timestamp,
      },
    });
  };

  public leaveChannel = (socket: Socket, payload: any) => {
    const { guildId } = payload;
    this.discordClient.disconnect(guildId);
    this.server.to(guildId).emit("channel_update", {
      channel: null,
    });
  };
}

export default WebClient;
