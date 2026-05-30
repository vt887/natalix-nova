import type { SearchProviderId, ThemeMode } from '../../types/backup';

export interface SettingsSlice {
  theme: ThemeMode;
  searchProvider: SearchProviderId;
  units: 'metric' | 'imperial';
  language: string;
}

export const settingsInitialState: SettingsSlice = {
  theme: 'auto',
  searchProvider: 'google',
  units: 'metric',
  language: 'en',
};

