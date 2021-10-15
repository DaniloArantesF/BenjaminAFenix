import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import socketIOClient, { Socket } from 'socket.io-client';
import { selectDashboard, setActive } from './dashboardSlice';
import { QueueState, setQueue } from './queueSlice';
import { Track } from '../types';
import { selectAuth } from './authSlice';
import { selectPlayerState, setCurrentTrack, updatePlaybackState } from './playerSlice';

const endpoint = `localhost:8000/bot`;

interface PlaybackState {
  status: string;
  volume: number;
  progress: number;
  timestamp: number;
}

const useSocket = () => {
  const dispatch = useAppDispatch();
  const { currentGuild, active } = useAppSelector(selectDashboard);
  const { currentTrack } = useAppSelector(selectPlayerState);
  const { username } = useAppSelector(selectAuth);
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    setSocket(socketIOClient(endpoint));

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
    if (socket && currentGuild) {
      getGuildPlayer();
    }
  }, [currentGuild, socket]);

  const setUpEvents = () => {
    socket?.on('connect', () => {
      console.info('Connected to server!');
    });

    socket?.on('not_active', () => {
      console.info('Guild not active');
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

    // Triggered periodically to update state of playback
    socket?.on('playback_state', (payload: PlaybackState) => {
      dispatch(updatePlaybackState(payload));
    });
  };

  const getGuildPlayer = () => {
    if (!currentGuild) return;
    socket?.emit('get_player', { id: currentGuild.id });
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

  return {
    socket,
    setSocket,
    requestTrack,
    unpausePlayer,
    pausePlayer,
    nextTrack,
    prevTrack,
    toggleRepeat,
    toggleShuffle,
    setVolume
  };
};

export default useSocket;
