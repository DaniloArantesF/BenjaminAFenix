import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { AppState } from '../app/store';

export interface AuthState {
  username: string;
  accessToken: string;
  refreshToken: string;
  refreshInterval: number;
  error: any;
}

const initialState: AuthState = {
  username: '',
  accessToken: '',
  refreshToken: '',
  refreshInterval: 0,
  error: null,
}

// Payload creator
export const fetchCredentials = createAsyncThunk('login', async (code: string, { rejectWithValue }) => {
  try {
    console.log("Fetching creds...");
    console.log(code);
    const { data } = await axios.post('http://localhost:8000/auth/code', { code });
    console.log(data);
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
    useCode: (state, action) => {
      return state;
    },
  },
  extraReducers: (builder) => {
    // Builder callback is used as it provides correctly typed reducers from action creators
    builder.addCase(fetchCredentials.fulfilled, (state, { payload }) => {
      // TODO: set refresh interval
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.error = null;
    });
    builder.addCase(fetchCredentials.rejected, (state, { payload }) => {
      if (payload) {
        state.error = payload;
      }
    });
  },
});

export const { } = authSlice.actions;
export const selectAuth = (state: AppState) => state.auth;
export default authSlice.reducer;
