// Each slice file should define a type for its initial state value
// so that createSlice can correctly infer the type of state in each case
// reducer
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppState } from './store';
import type { Track } from '../types/types';
import { QItem } from '../components/Queue/Queue';

// define type for slice state
export interface QueueState {
  items: [] | Array<QItem>;
  position: number;
}

// Define initial state using type above
const initialState: QueueState = {
  items: [],
  position: -1,
};

export const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    setQueue: (state, action) => {
      return { ...action.payload };
    },
    next: (state) => {
      state.position = state.position !== -1 ? (state.position += 1) : -1;
      if (state.position >= state.items.length) {
        state.position = 0;
      }
      return state;
    },
    previous: (state) => {
      state.position = state.position > 0 ? (state.position -= 1) : 0;
      return state;
    },
    setPosition: (state, action: PayloadAction<number>) => {
      state.position = state.position ? (state.position += action.payload) : -1;
      return state;
    },
    pushTrack: (state, action: PayloadAction<Track>) => {
      let newItem: QItem = {
        itemPosition: state.items.length + 1,
        ...action.payload
      };
      state.items = [...state.items, newItem];
      if (state.position === -1)
        state.position = 0;
      return state;
    }
  },
});

export const { next, previous, setPosition, setQueue, pushTrack, } = queueSlice.actions;
export const selectPosition = (state: AppState) => state.queue.position;
export const selectItems = (state: AppState) => state.queue.items;
export const selectQueue = (state: AppState) => state.queue;
export const selectQueueLength = (state: AppState) => state.queue.items.length;
export default queueSlice.reducer;
