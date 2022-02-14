import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { AppState } from './store';

export interface Error {
  message: string;
  code: number;
  redirect_path?: string;
}

export interface AuthState {
  id: string;
  avatar: string;
  username: string;
  accessToken: string;
  refreshToken: string;
  refreshTimeout?: NodeJS.Timeout;
  expiration: number;
  error: Error | null;
}

export interface ErrorPayload {
  error: string;
}

const initialState: AuthState = {
  id: localStorage.getItem('id') || '',
  avatar: localStorage.getItem('avatar') || '',
  username: localStorage.getItem('username') || '',
  accessToken: localStorage.getItem('accessToken') || '',
  refreshToken: localStorage.getItem('refreshToken') || '',
  expiration: 0,
  error: null,
};

// Payload creator
export const fetchCredentials = createAsyncThunk(
  'login',
  async (code: string, { rejectWithValue }) => {
    try {
      const { data } = (await axios.post(
        `${process.env.REACT_APP_BOT_HOSTNAME}/auth/code`,
        {
          code,
        }
      )) as any;
      const expiresIn = data.expiresIn;
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiration: Date.now() + expiresIn * 1000,
      };
    } catch (err) {
      return rejectWithValue({ code: 400, message: 'Invalid Code!', redirect_path: '/login' });
    }
  }
);

export const refreshCredentials = createAsyncThunk(
  'refresh',
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      const { data } = (await axios.post(
        `${process.env.REACT_APP_BOT_HOSTNAME}/auth/refresh`,
        {
          refreshToken,
        }
      )) as any;

      const expiresIn = data.expiresIn;
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiration: Date.now() + expiresIn * 1000,
      };
    } catch (error) {
      rejectWithValue({ code: 401, message: 'Error refreshing tokens', redirect_path: '/login' });
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearCredentials: (state) => {
      localStorage.clear();
      return { ...initialState, accessToken: '', refreshToken: '', error: null };
    },
    setUser: (state, { payload }) => {
      localStorage.setItem('id', payload.id);
      localStorage.setItem('avatar', payload.avatar);
      localStorage.setItem('username', payload.username);
      return { ...state, ...payload };
    },
    setCredentials: (state, { payload }) => {
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      return state;
    },
    setRefreshTimeout: (state, { payload }) => {
      if (state.refreshTimeout) {
        clearTimeout(state.refreshTimeout);
      }
      state.refreshTimeout = payload;
      return state;
    },
    setError: (state, { payload }) => {
      state.error = payload;
      return state;
    }
  },
  extraReducers: (builder) => {
    // Builder callback is used as it provides correctly typed reducers from action creators
    builder.addCase(fetchCredentials.fulfilled, (state, { payload }) => {
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.expiration = payload.expiration;

      localStorage.setItem('accessToken', payload.accessToken);
      localStorage.setItem('refreshToken', payload.refreshToken);
      localStorage.setItem('expiration', `${payload.expiration}`);
      state.error = null;
    });
    builder.addCase(fetchCredentials.rejected, (state, { payload }) => {
      const { code, message, redirect_path } = payload as Error;
      if (payload) {
        state.error = { code, message, redirect_path};
      }
    });

    builder.addCase(refreshCredentials.fulfilled, (state, { payload }) => {
      if (!payload) return;
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.expiration = payload.expiration;

      localStorage.setItem('accessToken', payload.accessToken);
      localStorage.setItem('refreshToken', payload.refreshToken);
      localStorage.setItem('expiration', `${payload.expiration}`);
    });

    builder.addCase(refreshCredentials.rejected, (state, { payload }) => {
      const { code, message, redirect_path } = payload as Error;
      if (payload) {
        state.error = { code, message, redirect_path};
      }
    });
  },
});

export const { clearCredentials, setUser, setCredentials, setRefreshTimeout, setError } =
  authSlice.actions;
export const selectAuth = (state: AppState) => state.auth;
export const selectError = (state: AppState) => state.auth.error;
export default authSlice.reducer;
