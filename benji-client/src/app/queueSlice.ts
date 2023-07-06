// Each slice file should define a type for its initial state value
// so that createSlice can correctly infer the type of state in each case reducer
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppState } from './store';
import type { Track } from '../types';
import { QItem } from '../components/common/Queue/Queue';

// define type for slice state
export interface QueueState {
  items: [] | Array<QItem>;
  position: number;
  shuffle: boolean;
  repeat: boolean;
}

const initialState: QueueState = {
  items: [
  ],
  position: 0,
  shuffle: false,
  repeat: false,
};

export const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    setQueue: (state: QueueState, action: PayloadAction<QueueState>) => {
      return { ...action.payload };
    },
    setShuffle: (state: QueueState, { payload }: PayloadAction<boolean>) => {
      return { ...state, shuffle: payload };
    },
    setRepeat: (state: QueueState, { payload }: PayloadAction<boolean>) => {
      return { ...state, repeat: payload };
    },
    next: (state: QueueState) => {
      state.position = state.position !== -1 ? (state.position += 1) : -1;
      if (state.position >= state.items.length) {
        state.position = 0;
      }
      return state;
    },
    previous: (state: QueueState) => {
      state.position = state.position > 0 ? (state.position -= 1) : 0;
      return state;
    },
    setPosition: (state: QueueState, action: PayloadAction<number>) => {
      state.position = action.payload;
      return state;
    },
    pushTrack: (state: QueueState, action: PayloadAction<Track>) => {
      const newItem: QItem = {
        itemPosition: state.items.length + 1,
        ...action.payload,
      };
      state.items = [...state.items, newItem];

      // Update current position if first song
      if (state.position === -1) state.position = 0;
      return state;
    },
  },
});

export const {
  next,
  previous,
  setPosition,
  setQueue,
  pushTrack,
  setShuffle,
  setRepeat,
} = queueSlice.actions;
export const selectPosition = (state: AppState): number => state.queue.position;
export const selectItems = (state: AppState): QItem[] => state.queue.items;
export const selectQueue = (state: AppState): QueueState => state.queue;
export const selectQueueLength = (state: AppState): number =>
  state.queue.items.length;
export const selectShuffle = (state: AppState): boolean => state.queue.shuffle;
export const selectRepeat = (state: AppState): boolean => state.queue.repeat;
export default queueSlice.reducer;
