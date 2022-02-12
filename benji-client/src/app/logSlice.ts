// Each slice file should define a type for its initial state value
// so that createSlice can correctly infer the type of state in each case
// reducer
import { createSlice, } from '@reduxjs/toolkit';
import type { AppState } from './store';

export interface Action {
  message: string;
  timestamp: number;
}

// define type for slice state
export interface LogState {
  items: [] | Array<Action>;
}

// Define initial state using type above
const initialState: LogState = {
  items: [{ message: 'helo friend', timestamp: 2 },{ message: 'helo friend', timestamp: 2 }, { message: 'helo friend', timestamp: 2 }],
};

export const logSlice = createSlice({
  name: 'log',
  initialState,
  reducers: {
    pushAction: (state, { payload }) => {
      console.log(payload);
      state.items = [payload, ...state.items];
      return state;
    },
  },
});

export const { pushAction } = logSlice.actions;
export const selectActionLogs = (state: AppState) => state.logs.items;
export default logSlice.reducer;
