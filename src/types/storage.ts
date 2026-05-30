export type StorageNamespace =
  | 'settings'
  | 'apps'
  | 'weather'
  | 'backup'
  | 'pomodoro'
  | 'habits'
  | 'workspaces'
  | 'widgets'
  | 'tokens'
  | 'ai'
  | 'github'
  | 'drive';

export type StorageKey =
  | `${StorageNamespace}.${string}`
  | 'notes.content';

export const STORAGE_KEYS = {
  notesContent: 'notes.content',
  settingsTheme: 'settings.theme',
  settingsBackground: 'settings.background',
  settingsSearchProvider: 'settings.searchProvider',
  tokensGithub: 'tokens.github',
  tokensTodoist: 'tokens.todoist',
  tokensNotion: 'tokens.notion',
} as const;
