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
import { QueueState, setQueue } from './queueSlice';
import { Track } from '../types';
import { selectAuth } from './authSlice';
import {
  selectPlayerState,
  setCurrentTrack,
  updatePlaybackState,
} from './playerSlice';
import { connect } from 'http2';
import axios from 'axios';
import { getGuildVoiceChannels } from '../libs/Discord';

const endpoint = `localhost:8000/bot`;

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
  const { username } = useAppSelector(selectAuth);
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    connect();
    return () => {
      socket?.off('connect');
      socket?.off('not_active');
      socket?.off('player_update');
      socket?.off('playback_state');
      socket?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    setUpEvents();
  }, [socket]);

  useEffect(() => {
    if (!currentGuild) return;
    getVoiceChannels();
  }, [currentGuild]);
  useEffect(() => {
    if (socket && currentGuild) {
      getGuildPlayer();
    }
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
      const res = await axios.get('http://localhost:8000/status');
      return true;
    } catch (error) {
      return false;
    }
  };

  const connect = async () => {
    const isOnline = await checkBotStatus();
    if (isOnline) {
      setSocket(socketIOClient(endpoint));
    }
  };

  const setUpEvents = () => {
    socket?.on('connect', () => {
      console.info('Connected to server!');
    });

    socket?.on('not_active', () => {
      dispatch(
        setCurrentChannel({
          id: '',
          name: '',
          onlineCount: 0,
          timestamp: 0,
        })
      );
      dispatch(setActive(false));
    });

    socket?.on('player_update', (payload: any) => {
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

    // Dispatched when bot connects to a guild
    socket?.on('bot_connection', (payload) => {
      dispatch(setCurrentChannel(payload.channel));
      if (!active) dispatch(setActive(true));
    });

    socket?.on('channel_update', (payload) => {
      const channel = payload.channel;
      if (active && (!channel || !channel.name)) {
        dispatch(setActive(false));
      } else if (!active && channel.name !== '') {
        dispatch(setActive(true));
      }

      dispatch(setCurrentChannel(payload.channel));
    });

    // TODO: set not active on bot_disconnect

    // Triggered periodically to update state of playback
    socket?.on('playback_state', (payload: PlaybackState) => {
      dispatch(updatePlaybackState(payload));
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
    socket?.emit('prev', { user: username });
  };

  const toggleShuffle = () => {
    if (!currentGuild) return;
    socket?.emit('shuffle', { user: username });
  };

  const toggleRepeat = () => {
    if (!currentGuild) return;
    socket?.emit('repeat', { user: username });
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
    requestTrack,
    joinChannel,
    unpausePlayer,
    pausePlayer,
    nextTrack,
    prevTrack,
    toggleRepeat,
    toggleShuffle,
    setVolume,
    leaveChannel
  };
};

export default useSocket;
