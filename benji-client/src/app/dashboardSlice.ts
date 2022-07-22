import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppState } from './store';

export interface Guild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  allowed: boolean; // Whether or not the bot has been added to this guild
}

export interface Channel {
  id: string;
  name: string;
  onlineCount: number;
  timestamp: number; // when bot joined channel
}

export interface DashboardState {
  currentGuild: Guild | null;
  channels: Channel[];
  guilds: Guild[];
  channel: Channel | null;
  active: boolean;
  channelSelection: boolean;
  navbar: boolean;
  windowWidth: number;
  theme: string;
}

const initialState: DashboardState = {
  currentGuild: null,
  channels: [],
  channel: { name: '', id: '', onlineCount: 0, timestamp: 0 },
  guilds: [],
  active: false,
  channelSelection: false,
  navbar: window.innerWidth > 1150, // Only show by default in larger displays
  windowWidth: window.innerWidth,
  theme: localStorage.getItem('theme') || 'dark',
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setUserGuilds: (state: DashboardState, { payload }: PayloadAction<Guild[]>) => {
      if (!payload) return state;
      // TODO: maybe sort guilds by relevance ?
      payload.sort((item1: Guild, item2: Guild) => {
        if (item1.name < item2.name) return -1;
        if (item1.name > item2.name) return 1;
        return 0;
      });

      state.guilds = payload;
      return state;
    },
    setCurrentGuild: (state: DashboardState, { payload }: PayloadAction<Guild>) => {
      state.currentGuild = payload;
      localStorage.setItem('guild', JSON.stringify(payload));
      return state;
    },
    setCurrentChannel: (state: DashboardState, { payload }: PayloadAction<Channel>) => {
      if (payload) {
        state.channel = payload;
      } else {
        state.channel = initialState.channel;
      }
      return state;
    },
    setActive: (state: DashboardState, { payload }: PayloadAction<boolean>) => {
      state.active = payload;
      return state;
    },
    setChannels: (state: DashboardState, { payload }: PayloadAction<Channel[]>) => {
      state.channels = [...payload];
      return state;
    },
    setNavbarVisibility: (state: DashboardState, { payload }: PayloadAction<boolean>) => {
      state.navbar = payload;
    },
    setWindowWidth: (state: DashboardState, { payload }: PayloadAction<number>) => {
      state.windowWidth = payload;
      state.navbar = payload > 1150;
      return state;
    },
    setTheme: (state: DashboardState, { payload }: PayloadAction<string>) => {
      state.theme = payload;
      return state;
    },
  },
});

export const {
  setUserGuilds,
  setCurrentGuild,
  setCurrentChannel,
  setActive,
  setChannels,
  setNavbarVisibility,
  setWindowWidth,
  setTheme,
} = dashboardSlice.actions;
export const selectDashboard = (state: AppState): DashboardState => state.dashboard;
export const selectUptime = (state: AppState): number => {
  if (!state.dashboard.channel) return Date.now();
  return state.dashboard.channel?.timestamp;
};
export const selectTheme = (state: AppState): string => state.dashboard.theme;
export default dashboardSlice.reducer;
