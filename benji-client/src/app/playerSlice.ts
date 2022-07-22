import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppState } from './store';
import { Track } from '../types';

export interface PlaybackState {
  progress: number;
  status: string;
  volume: number;
}

export interface PlayerState extends PlaybackState {
  currentTrack: Track | null;
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
    // setYoutube: (state: PlayerState, action: PayloadAction<any>) => {
    //   return {
    //     ...state,
    //     youtube: {
    //       playVideo: action.payload.playVideo,
    //       pauseVideo: action.payload.pauseVideo,
    //     },
    //   };
    // },
    updatePlaybackState: (state: PlayerState, action: PayloadAction<PlaybackState>) => {
      return { ...state, ...action.payload };
    },
    setCurrentTrack: (state: PlayerState, { payload }: PayloadAction<Track | null>) => {
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
