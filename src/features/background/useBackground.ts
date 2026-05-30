import { useEffect, useMemo } from 'react';

import { storage } from '../../services/browser/storage';
import { runtime } from '../../services/browser/runtime';
import { STORAGE_KEYS } from '../../types/storage';
import { defaultBackground, type BackgroundConfig } from '../../store/slices/settings';
import { useStore } from '../../store';

const STORAGE_KEY = STORAGE_KEYS.settingsBackground;

function resolveBackgroundUrl(url: string): string {
  if (url.startsWith('chrome-extension://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  return runtime.getURL(url);
}

export function useBackground(): BackgroundConfig {
  const background = useStore((state) => state.background);
  const setBackground = useStore((state) => state.setBackground);
  const hydrateSettings = useStore((state) => state.hydrateSettings);

  useEffect(() => {
    let unsubscribed = false;

    void (async () => {
      const stored = await storage.get<BackgroundConfig>(STORAGE_KEY);
      if (unsubscribed) return;

      if (stored) {
        const resolved = {
          ...stored,
          url: resolveBackgroundUrl(stored.url),
        };
        hydrateSettings({ background: resolved });
        if (resolved.url !== stored.url) {
          await storage.set(STORAGE_KEY, resolved);
        }
      } else {
        const fallback = {
          ...defaultBackground,
          url: resolveBackgroundUrl(defaultBackground.url),
        };
        await storage.set(STORAGE_KEY, fallback);
        hydrateSettings({ background: fallback });
      }
    })();

    const unsubscribe = storage.watch<BackgroundConfig>(STORAGE_KEY, (value) => {
      if (value) {
        setBackground(value);
      }
    });

    return () => {
      unsubscribed = true;
      unsubscribe();
    };
  }, [hydrateSettings, setBackground]);

  return useMemo(() => {
    return {
      ...background,
      url: resolveBackgroundUrl(background.url || defaultBackground.url),
    };
  }, [background]);
}
