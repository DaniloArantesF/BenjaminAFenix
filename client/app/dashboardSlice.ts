import { createSlice } from '@reduxjs/toolkit';
import type { AppState } from '../app/store';

export interface Guild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
}

export interface DashboardState {
  selectedGuild: Guild | null;
  guilds: Guild[];
}

const initialState: DashboardState = {
  selectedGuild: null,
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
    selectGuild: (state, { payload }) => {
      state.selectedGuild = payload;
      return state;
    }
  },
});

export const { setUserGuilds, } = dashboardSlice.actions;
export const selectDashboard = (state: AppState) => state.dashboard;
export default dashboardSlice.reducer;
