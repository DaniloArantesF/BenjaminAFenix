// Each slice file should define a type for its initial state value
// so that createSlice can correctly infer the type of state in each case
// reducer
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppState } from '../../app/store';
import type { Track } from '../../types/types';

// define type for slice state
interface QueueState {
  items: [] | Array<Track>;
  position: null | number;
}

// Define initial state using type above
const initialState: QueueState = {
  items: [],
  position: null,
};

export const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    next: (state) => {
      state.position ? (state.position += 1) : null;
    },
    previous: (state) => {
      state.position ? (state.position -= 1) : null;
    },
    setPosition: (state, action: PayloadAction<number>) => {
      state.position ? (state.position += action.payload) : null;
    },
  },
});

export const { next, previous, setPosition } = queueSlice.actions;
export const selectPosition = (state: AppState) => state.queue.position;

export default queueSlice.reducer;