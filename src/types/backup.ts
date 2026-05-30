export type ThemeMode = 'auto' | 'dark' | 'light' | 'midnight' | 'solarized';
export type SearchProviderId = 'google' | 'duckduckgo' | 'bing';

export interface SettingsState {
  theme: ThemeMode;
  searchProvider: SearchProviderId;
  units: 'metric' | 'imperial';
  language: string;
}

export interface AppItem {
  id: string;
  title: string;
  url: string;
  iconUrl?: string;
}

export interface HabitDefinition {
  id: string;
  name: string;
}

export interface Workspace {
  id: string;
  name: string;
  createdAt: string; // ISO date
}

export type WidgetConfig = Record<string, unknown>;

export interface BackupPayload {
  version: 2;
  exportedAt: string; // ISO date
  settings: SettingsState;
  apps: AppItem[];
  notes: string;
  habits: HabitDefinition[];
  workspaces: Workspace[];
  widgets: WidgetConfig;
}

