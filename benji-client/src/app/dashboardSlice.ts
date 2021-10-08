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
      // TODO: maybe sort guilds by relevance ?
      payload.sort((item1: Guild, item2: Guild) => {
        if (item1.name < item2.name) return -1;
        if (item1.name > item2.name) return 1;
        return 0;
      });

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
