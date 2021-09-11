import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import queueReducer from '../components/Queue/queueSlice';
import playerReducer from '../components/Player/playerSlice';

export const store = configureStore({
  reducer: {
    queue: queueReducer,
    player: playerReducer,
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