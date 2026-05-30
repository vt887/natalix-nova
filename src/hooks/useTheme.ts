import { useEffect } from 'react';

import { storage } from '../services/browser/storage';
import { STORAGE_KEYS } from '../types/storage';
import { useStore } from '../store';
import type { ThemeMode } from '../store/slices/settings';

function resolveTheme(theme: ThemeMode, prefersDark: boolean): Exclude<ThemeMode, 'auto'> {
  if (theme === 'auto') {
    return prefersDark ? 'dark' : 'light';
  }

  return theme;
}

function applyTheme(theme: ThemeMode): void {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = resolveTheme(theme, prefersDark);
}

export function useTheme(): ThemeMode {
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  const hydrateSettings = useStore((state) => state.hydrateSettings);

  useEffect(() => {
    let canceled = false;

    void (async () => {
      const stored = await storage.get<ThemeMode>(STORAGE_KEYS.settingsTheme);
      if (canceled) return;

      if (stored) {
        hydrateSettings({ theme: stored });
        return;
      }

      await storage.set(STORAGE_KEYS.settingsTheme, 'dark');
      hydrateSettings({ theme: 'dark' });
    })();

    const unsubscribe = storage.watch<ThemeMode>(STORAGE_KEYS.settingsTheme, (value) => {
      if (value) {
        setTheme(value);
      }
    });

    return () => {
      canceled = true;
      unsubscribe();
    };
  }, [hydrateSettings, setTheme]);

  useEffect(() => {
    applyTheme(theme);

    if (theme !== 'auto') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      applyTheme('auto');
    };

    mediaQuery.addEventListener('change', listener);
    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, [theme]);

  return theme;
}

export { applyTheme, resolveTheme };

