import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { AppState } from './store';

export interface AuthState {
  id: string;
  avatar: string;
  username: string;
  accessToken: string;
  refreshToken: string;
  refreshInterval: number;
  error: any;
}

const initialState: AuthState = {
  id: localStorage.getItem('id') || '',
  avatar: localStorage.getItem('avatar') || '',
  username: localStorage.getItem('username') || '',
  accessToken: localStorage.getItem('accessToken') || '',
  refreshToken: localStorage.getItem('refreshToken') || '',
  refreshInterval: 0,
  error: null,
}

// Payload creator
export const fetchCredentials = createAsyncThunk('login', async (code: string, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('http://localhost:8000/auth/code', { code }) as any;
    return { accessToken: data.accessToken, refreshToken: data.refreshToken };
  } catch (error) {
    console.error(error);
    return rejectWithValue(error);
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      localStorage.setItem('id', payload.id);
      localStorage.setItem('avatar', payload.avatar);
      localStorage.setItem('username', payload.username);
      return { ...state, ...payload };
    },
    setCredentials: (state, { payload }) => {
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
    },
  },
  extraReducers: (builder) => {
    // Builder callback is used as it provides correctly typed reducers from action creators
    builder.addCase(fetchCredentials.fulfilled, (state, { payload }) => {
      // TODO: set refresh interval
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;

      localStorage.setItem('accessToken', payload.accessToken);
      localStorage.setItem('refreshToken', payload.refreshToken);
      state.error = null;
    });
    builder.addCase(fetchCredentials.rejected, (state, { payload }) => {
      if (payload) {
        state.error = payload;
      }
    });
  },
});

export const { setUser, setCredentials } = authSlice.actions;
export const selectAuth = (state: AppState) => state.auth;
export default authSlice.reducer;