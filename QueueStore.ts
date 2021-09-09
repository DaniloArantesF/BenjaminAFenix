import React, { useReducer, useEffect, } from 'react';
import { Track } from './types/types';

type State =
  | {
  currentTrack?: Track;
  queuePosition?: number;
  }
  | {
    currentTrack: null;
    queuePosition: null;
  }

type Action =
  | { type: 'set_track', payload: any }
  | { type: 'set_queue_position', payload: { newPosition: number } };

const QueueStore = () => {
  const [{ currentTrack, queuePosition }, dispatch] = useReducer(reducer, {
    currentTrack: null,
    queuePosition: null,
  });

  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case 'set_track':
        return { ...state };
      case 'set_queue_position':
        return { ...state };
      default:
        return { ...state };
    }
  }
};
