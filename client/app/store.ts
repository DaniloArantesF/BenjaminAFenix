import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import queueReducer from '../components/Queue/queueSlice';
import playerReducer from '../components/Player/playerSlice';
import authReducer from '../app/authSlice';
import dashboardReducer from '../app/dashboardSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    queue: queueReducer,
    player: playerReducer,
    auth: authReducer,
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
  >

export default store;