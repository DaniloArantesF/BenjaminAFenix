// Each slice file should define a type for its initial state value
// so that createSlice can correctly infer the type of state in each case
// reducer
import { createSlice } from "@reduxjs/toolkit";
import type { AppState } from "./store";

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
  items: [],
};

export const logSlice = createSlice({
  name: "log",
  initialState,
  reducers: {
    pushAction: (state, { payload }) => {
      const LOG_LIMIT = 12;
      state.items = [payload, ...state.items.slice(0, LOG_LIMIT - 1)];
      return state;
    },
  },
});

export const { pushAction } = logSlice.actions;
export const selectActionLogs = (state: AppState) => state.logs.items;
export default logSlice.reducer;
