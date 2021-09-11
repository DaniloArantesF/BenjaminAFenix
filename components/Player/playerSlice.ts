import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppState } from '../../app/store';

export interface YoutubePlayer {
  playVideo(): void
  pauseVideo(): void
}

export interface PlayerState {
  youtube: YoutubePlayer  | null;
  playing: boolean;
}

const initialState: PlayerState = {
  youtube: null,
  playing: false,
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setYoutube: (state, action: PayloadAction<any>) => {
      return { ...state, youtube: { playVideo: action.payload.playVideo, pauseVideo: action.payload.pauseVideo } };
    },
    togglePlayer: (state) => {
      state.playing = !state.playing;
      return state;
    },
  },
});

export const { togglePlayer, setYoutube } = playerSlice.actions;
export const selectYoutube = (state: AppState) => state.player.youtube;
export default playerSlice.reducer;
