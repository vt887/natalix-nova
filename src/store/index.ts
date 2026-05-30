import { create } from 'zustand';

import type { AppsSlice } from './slices/apps';
import { appsInitialState } from './slices/apps';
import type { HabitsSlice } from './slices/habits';
import { habitsInitialState } from './slices/habits';
import type { IntegrationsSlice } from './slices/integrations';
import { integrationsInitialState } from './slices/integrations';
import type { NotesSlice } from './slices/notes';
import { notesInitialState } from './slices/notes';
import type { PomodoroSlice } from './slices/pomodoro';
import { pomodoroInitialState } from './slices/pomodoro';
import type { SettingsSlice } from './slices/settings';
import { settingsInitialState } from './slices/settings';
import type { StocksSlice } from './slices/stocks';
import { stocksInitialState } from './slices/stocks';
import type { UISlice } from './slices/ui';
import { uiInitialState } from './slices/ui';
import type { WeatherSlice } from './slices/weather';
import { weatherInitialState } from './slices/weather';
import type { WorkspacesSlice } from './slices/workspaces';
import { workspacesInitialState } from './slices/workspaces';

export type RootState = SettingsSlice &
  AppsSlice &
  WeatherSlice &
  NotesSlice &
  PomodoroSlice &
  HabitsSlice &
  WorkspacesSlice &
  StocksSlice &
  IntegrationsSlice &
  UISlice;

const initialState: RootState = {
  ...settingsInitialState,
  ...appsInitialState,
  ...weatherInitialState,
  ...notesInitialState,
  ...pomodoroInitialState,
  ...habitsInitialState,
  ...workspacesInitialState,
  ...stocksInitialState,
  ...integrationsInitialState,
  ...uiInitialState,
};

export const useStore = create<RootState>(() => initialState);

