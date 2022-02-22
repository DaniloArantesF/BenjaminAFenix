import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import type { AppState } from './store';

export interface TokenPayload {
  userId: string;
  username: string;
  avatar: string;
  accessToken: string;
  refreshToken: string;
  iat: number;
  exp: number;
}

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
  token: string;
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
  token: localStorage.getItem('token') || '',
  expiration: 0,
  error: null,
};

// Payload creator
export const fetchCredentials = createAsyncThunk(
  'login',
  async (code: string, { rejectWithValue }) => {
    try {
      const { data } = (await axios.post(
        `${process.env.REACT_APP_BOT_HOSTNAME}/auth/login`,
        {
          code,
        }
      )) as any;

      const token = data.token;
      const decoded = jwtDecode(token) as any;

      return {
        token,
        accessToken: decoded.accessToken,
        refreshToken: decoded.refreshToken,
        expiration: decoded.exp * 1000,
      };
    } catch (err) {
      return rejectWithValue({ code: 400, message: 'Invalid Code!', redirect_path: '/login' });
    }
  }
);

export const refreshCredentials = createAsyncThunk(
  'refresh',
  async (token: string, { rejectWithValue }) => {
    try {
      const { data } = (await axios.post(
        `${process.env.REACT_APP_BOT_HOSTNAME}/auth/refresh`,
        {
          token,
        }
      )) as any;
      const newToken = data.token;
      const decoded = jwtDecode(newToken) as any;
      return {
        token: newToken,
        accessToken: decoded.accessToken,
        refreshToken: decoded.refreshToken,
        expiration: decoded.exp * 1000,
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
      state.token = payload.token;
      
      localStorage.setItem('token', payload.token);
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
      state.token = payload.token;

      localStorage.setItem('token', payload.token);
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
export const selectRefreshTimeout = (state: AppState) => state.auth.refreshTimeout;
export default authSlice.reducer;
