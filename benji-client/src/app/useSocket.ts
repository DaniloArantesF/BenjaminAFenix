import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import socketIOClient, { Socket } from 'socket.io-client';
import { selectDashboard, setActive } from './dashboardSlice';
import { QueueState, setQueue } from './queueSlice';
import { Track } from '../types/types';

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
      dispatch(setQueue(queue));
      if (!active) {
        dispatch(setActive(true));
      }
    });

    // Triggered periodically to update state of playback
    socket?.on('playback_state', (payload: PlaybackState) => {
      console.log(payload);
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

  return {
    socket,
    setSocket,
    requestTrack
  };
};

export default useSocket;
