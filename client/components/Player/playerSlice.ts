import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppState } from '../../app/store';

export interface PlayerState {
  playing: boolean;
}

const initialState: PlayerState = {
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

export const { togglePlayer } = playerSlice.actions;
export const selectPlaying = (state: AppState) => state.player.playing;
export default playerSlice.reducer;
