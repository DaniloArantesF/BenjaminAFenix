import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';
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
  refreshTimeout?: NodeJS.Timeout;
  expiration: number;
  error: Error | null;
  token: string;
}

export interface ErrorPayload {
  error: string;
}

const initialState: AuthState = {
  id: '',
  avatar: '',
  username: '',
  token: localStorage.getItem('token') || '',
  expiration: 0,
  error: null,
};

// Payload creator
export const fetchCredentials = createAsyncThunk(
  'login',
  async (code: string, { rejectWithValue }) => {
    try {
      const { data }: AxiosResponse<{ token: string }> = (await axios.post(
        `${process.env.REACT_APP_BOT_HOSTNAME}/auth/login`,
        {
          code,
        }
      ));

      const token = data.token;
      type TokenPayload = {
        exp: number;
      }
      const decoded = jwtDecode(token) as TokenPayload;

      return {
        token,
        expiration: decoded.exp * 1000,
      };
    } catch (err) {
      return rejectWithValue({
        code: 400,
        message: 'Invalid Code!',
        redirect_path: '/login',
      });
    }
  }
);

export const refreshCredentials = createAsyncThunk(
  'refresh',
  async (token: string, { rejectWithValue }) => {
    try {
      const { data }: AxiosResponse<{ token: string }> = (await axios.post(
        `${process.env.REACT_APP_BOT_HOSTNAME}/auth/refresh`,
        {
          token,
        }
      ));
      const newToken = data.token;
      type TokenPayload = {
        exp: number;
      }
      const decoded = jwtDecode(newToken) as TokenPayload;
      return {
        token: newToken,
        expiration: decoded.exp * 1000,
      };
    } catch (error) {
      rejectWithValue({
        code: 401,
        message: 'Error refreshing tokens',
        redirect_path: '/login',
      });
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearCredentials: () => {
      localStorage.clear();
      return { ...initialState, token: '', error: null };
    },
    setUser: (state: AuthState, { payload }: PayloadAction<{ id: string, avatar: string, username: string }>) => {
      localStorage.setItem('id', payload.id);
      localStorage.setItem('avatar', payload.avatar);
      localStorage.setItem('username', payload.username);
      return { ...state, ...payload };
    },
    setCredentials: (state: AuthState, { payload }: PayloadAction<{ token: string }>) => {
      const { userId, avatar, username } = jwtDecode(
        payload.token
      ) as TokenPayload;
      localStorage.setItem('id', userId);
      localStorage.setItem('avatar', avatar);
      localStorage.setItem('username', username);
      return { ...state, token: payload.token, id: userId, avatar, username };
    },
    setRefreshTimeout: (state: AuthState, { payload }: PayloadAction<NodeJS.Timeout | undefined>) => {
      if (state.refreshTimeout) {
        clearTimeout(state.refreshTimeout);
      }
      state.refreshTimeout = payload;
      return state;
    },
    setError: (state: AuthState, { payload }: PayloadAction<Error>) => {
      state.error = payload;
      return state;
    },
  },
  extraReducers: (builder) => {
    // Builder callback is used as it provides correctly typed reducers from action creators
    builder.addCase(fetchCredentials.fulfilled, (state, { payload }) => {
      state.expiration = payload.expiration;
      state.token = payload.token;

      localStorage.setItem('token', payload.token);
      localStorage.setItem('expiration', `${payload.expiration}`);
      state.error = null;
    });
    builder.addCase(fetchCredentials.rejected, (state, { payload }) => {
      const { code, message, redirect_path } = payload as Error;
      if (payload) {
        state.error = { code, message, redirect_path };
      }
    });

    builder.addCase(refreshCredentials.fulfilled, (state, { payload }) => {
      if (!payload) return;
      state.expiration = payload.expiration;
      state.token = payload.token;

      localStorage.setItem('token', payload.token);
      localStorage.setItem('expiration', `${payload.expiration}`);
    });

    builder.addCase(refreshCredentials.rejected, (state, { payload }) => {
      const { code, message, redirect_path } = payload as Error;
      if (payload) {
        state.error = { code, message, redirect_path };
      }
    });
  },
});

export const {
  clearCredentials,
  setUser,
  setCredentials,
  setRefreshTimeout,
  setError,
} = authSlice.actions;
export const selectAuth = (state: AppState): AuthState => state.auth;
export const selectError = (state: AppState): Error | null => state.auth.error;
export const selectRefreshTimeout = (state: AppState): NodeJS.Timeout | undefined =>
  state.auth.refreshTimeout;
export const selectToken = (state: AppState): string => state.auth.token;
export default authSlice.reducer;
