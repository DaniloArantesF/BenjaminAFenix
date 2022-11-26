import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppState } from './store';

export interface PlaybackState {
  progress: number;
  status: 'idle' | 'playing' | 'paused';
  volume: number;
}

export interface PlayerState extends PlaybackState {
  currentTrack: number; // index of current track
}

const initialState: PlayerState = {
  currentTrack: -1,
  progress: -1,
  status: 'idle',
  volume: 1,
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    updatePlaybackState: (
      state: PlayerState,
      action: PayloadAction<Partial<PlaybackState>>
    ) => {
      return { ...state, ...action.payload };
    },
    setCurrentTrack: (
      state: PlayerState,
      { payload }: PayloadAction<number>
    ) => {
      state.currentTrack = payload;
      return state;
    },
    resetPlayer: () => {
      return { ...initialState };
    },
  },
});

export const { updatePlaybackState, setCurrentTrack, resetPlayer } =
  playerSlice.actions;
export const selectStatus = (state: AppState): string => state.player.status;
export const selectPlayerState = (state: AppState): PlayerState => state.player;
export default playerSlice.reducer;
