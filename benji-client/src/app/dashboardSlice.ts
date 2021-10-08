import { createSlice } from '@reduxjs/toolkit';
import type { AppState } from './store';

export interface Guild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
}

export interface DashboardState {
  currentGuild: Guild | null;
  guilds: Guild[];
}

const initialState: DashboardState = {
  currentGuild: null,
  guilds: [],
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setUserGuilds: (state, { payload }) => {
      state.guilds = payload;
      return state;
    },
    setCurrentGuild: (state, { payload }) => {
      state.currentGuild = payload;
      localStorage.setItem('guild', JSON.stringify(payload));
      return state;
    }
  },
});

export const { setUserGuilds, setCurrentGuild } = dashboardSlice.actions;
export const selectDashboard = (state: AppState) => state.dashboard;
export default dashboardSlice.reducer;
