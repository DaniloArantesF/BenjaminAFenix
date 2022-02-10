import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import socketIOClient, { Socket } from 'socket.io-client';
import {
  Channel,
  Guild,
  selectDashboard,
  setActive,
  setChannels,
  setCurrentChannel,
} from './dashboardSlice';
import { QueueState, selectRepeat, selectShuffle, setQueue, setRepeat, setShuffle } from './queueSlice';
import { Track } from '../types';
import { selectAuth } from './authSlice';
import {
  selectPlayerState,
  setCurrentTrack,
  updatePlaybackState,
} from './playerSlice';
import axios from 'axios';
import useDiscordAPI from '../libs/Discord';

const endpoint = `${process.env.REACT_APP_BOT_HOSTNAME}/bot`;

interface PlaybackState {
  status: string;
  volume: number;
  progress: number;
  timestamp: number;
}

const useSocket = () => {
  const dispatch = useAppDispatch();
  const { currentGuild, active, channel } = useAppSelector(selectDashboard);
  const { currentTrack } = useAppSelector(selectPlayerState);
  const shuffle = useAppSelector(selectShuffle);
  const repeat = useAppSelector(selectRepeat);
  const { username } = useAppSelector(selectAuth);
  const [socket, setSocket] = useState<Socket>();
  const { getGuildVoiceChannels } = useDiscordAPI();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (connected) return;

    connect();
    return () => {
      socket?.off('connect');
      socket?.off('not_active');
      socket?.off('player_update');
      socket?.off('playback_state');
      socket?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!socket) return;
    setUpEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    if (!currentGuild) return;
    getVoiceChannels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGuild]);

  useEffect(() => {
    if (socket && currentGuild) {
      getGuildPlayer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGuild, socket]);

  const getVoiceChannels = async () => {
    if (!currentGuild) return;
    const channels = await getGuildVoiceChannels(currentGuild.id);
    dispatch(setChannels(channels));
  };

  /**
   * Pings the server to check if bot is online.
   * If not, dont bother trying to connect
   */
  const checkBotStatus = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BOT_HOSTNAME}/status`
      );
      return true;
    } catch (error) {
      return false;
    }
  };

  async function connect() {
    const isOnline = await checkBotStatus();
    if (isOnline) {
      setSocket(socketIOClient(endpoint));
      setConnected(true);
    }
  };

  const setUpEvents = () => {
    if (!socket) return;
    socket.on('connect', () => {
      console.info('Connected to server!');
    });

    socket.on('player_update', (payload: any) => {
      const queue = payload.queue as QueueState;
      const curTrack = queue.items[queue.position];
      if (!currentTrack || curTrack !== currentTrack) {
        dispatch(setCurrentTrack(curTrack));
      }
      dispatch(setQueue(queue));

      if (!active) {
        dispatch(setActive(true));
      }
    });

    socket.on('channel_update', (payload) => {
      const channel = payload.channel;
      if (!channel) {
        dispatch(setActive(false));
      } else if (channel.name !== '') {
        dispatch(setActive(true));
      }
      dispatch(setCurrentChannel(payload.channel));
    });

    // TODO: set not active on bot_disconnect

    // Triggered periodically to update state of playback
    socket.on('playback_state', (payload: PlaybackState) => {
      dispatch(updatePlaybackState(payload));
    });

    socket.on('shuffle', ({ shuffle }) => {
      dispatch(setShuffle(shuffle));
    });

    socket.on('repeat', ({ repeat }) => {
      dispatch(setRepeat(repeat));
    });
  };

  const getGuildPlayer = () => {
    if (!currentGuild) return;
    socket?.emit('player_connect', { guildId: currentGuild?.id });
  };

  const joinChannel = (guildId: string, channelId: string) => {
    if (!guildId || !socket) return;
    socket?.emit('join_channel', { guildId, channelId });
  };

  // Changes queue position
  const setTrack = (position: number) => {
    socket?.emit('set_queue_position', { position });
  }

  const requestTrack = (track: Track) => {
    if (!currentGuild) return;
    socket?.emit('request_track', {
      track,
    });
  };

  const unpausePlayer = () => {
    if (!currentGuild) return;
    socket?.emit('unpause', { user: username });
  };

  const pausePlayer = () => {
    if (!currentGuild) return;
    socket?.emit('pause', { user: username });
  };

  const nextTrack = () => {
    if (!currentGuild) return;
    socket?.emit('next', { user: username });
  };

  const prevTrack = () => {
    if (!currentGuild) return;
    console.log('prev')
    socket?.emit('prev', { user: username });
  };

  const toggleShuffle = () => {
    if (!currentGuild) return;
    socket?.emit('shuffle', { shuffle: !shuffle });
  };

  const toggleRepeat = () => {
    if (!currentGuild) return;
    socket?.emit('repeat', { repeat: !repeat });
  };

  const setVolume = (volume: number) => {
    if (!currentGuild) return;
    socket?.emit('volume', { volume });
  };

  const leaveChannel = () => {
    if (!currentGuild || !channel) {
      return;
    }
    socket?.emit('leave_channel', { guildId: currentGuild.id });
  };

  return {
    socket,
    setSocket,
    setTrack,
    requestTrack,
    joinChannel,
    unpausePlayer,
    pausePlayer,
    nextTrack,
    prevTrack,
    toggleRepeat,
    toggleShuffle,
    setVolume,
    leaveChannel,
  };
};

export default useSocket;
