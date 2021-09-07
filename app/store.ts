import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import queueReducer from '../components/Queue/queueSlice';

export const store = configureStore({
  reducer: {
    queue: queueReducer,
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