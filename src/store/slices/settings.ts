export type ThemeMode = 'auto' | 'dark' | 'light' | 'midnight' | 'solarized';
export type BackgroundKind = 'preset' | 'custom';

export interface BackgroundConfig {
  type: BackgroundKind;
  url: string;
  label?: string;
}

export interface SettingsState {
  theme: ThemeMode;
  background: BackgroundConfig;
}

export interface SettingsActions {
  setTheme: (theme: ThemeMode) => void;
  setBackground: (background: BackgroundConfig) => void;
  hydrateSettings: (state: Partial<SettingsState>) => void;
}

export const defaultBackground: BackgroundConfig = {
  type: 'preset',
  url: 'img/backgrounds/01.jpg',
  label: 'Preset 01',
};

export const settingsInitialState: SettingsState = {
  theme: 'dark',
  background: defaultBackground,
};
