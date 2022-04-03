import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import queueReducer from "./queueSlice";
import playerReducer from "./playerSlice";
import authReducer from "./authSlice";
import dashboardReducer from "./dashboardSlice";
import logReducer from "./logSlice";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    queue: queueReducer,
    player: playerReducer,
    auth: authReducer,
    logs: logReducer,
  },
});

// Extract AppState and Dispatch types
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
