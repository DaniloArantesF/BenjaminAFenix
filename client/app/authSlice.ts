import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppState } from '../app/store';

export interface AuthState {
  [username: string]: string,
  password: string,
}

// Define initial state using type above
const initialState: AuthState = {
  username: '',
  password: ''
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
      return state;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
      return state;
    },
  },
});

export const { setUsername, setPassword } = authSlice.actions;
export const selectAuth = (state: AppState) => state.auth;
export default authSlice.reducer;
