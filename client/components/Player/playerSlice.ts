import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppState } from '../../app/store';
import { Track } from '../../types/types';

export interface PlayerState {
  currentTrack: Track | null;
  progress: number;
  status: string;
  volume: number;
}

const initialState: PlayerState = {
  currentTrack: null,
  progress: -1,
  status: 'idle',
  volume: 1,
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setYoutube: (state, action: PayloadAction<any>) => {
      return { ...state, youtube: { playVideo: action.payload.playVideo, pauseVideo: action.payload.pauseVideo } };
    },
    togglePlayer: (state) => {
      if (state.status === 'playing') {
        state.status = 'paused';
      } else if (state.status === 'paused') {
        state.status = 'playing';
      } else {
        state.status = 'idle';
      }

      return state;
    },
  },
});

export const { togglePlayer } = playerSlice.actions;
export const selectStatus = (state: AppState) => state.player.status;
export default playerSlice.reducer;
