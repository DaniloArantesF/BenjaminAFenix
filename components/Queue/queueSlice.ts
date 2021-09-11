// Each slice file should define a type for its initial state value
// so that createSlice can correctly infer the type of state in each case
// reducer
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppState } from '../../app/store';
import type { Track } from '../../types/types';

// define type for slice state
export interface QueueState {
  items: [] | Array<Track>;
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
      state.position !== -1 ? (state.position += 1) : -1;
      return state;
    },
    previous: (state) => {
      state.position > 0 ? (state.position -= 1) : 0;
      return state;
    },
    setPosition: (state, action: PayloadAction<number>) => {
      state.position ? (state.position += action.payload) : null;
      return state;
    },
  },
});

export const { next, previous, setPosition, setQueue } = queueSlice.actions;
export const selectPosition = (state: AppState) => state.queue.position;

export default queueSlice.reducer;