import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { runtime } from '../../services/browser/runtime';
import { useBackground } from './useBackground';

type StoredBackground = { type: 'preset' | 'custom'; url: string; label?: string };

function installChromeMock(stored: Map<string, StoredBackground | undefined>): void {
  Object.defineProperty(globalThis, 'chrome', {
    configurable: true,
    value: {
      runtime: {
        getURL: (path: string) => `chrome-extension://test/${path}`,
        lastError: undefined,
      },
      storage: {
        local: {
          get: (key: string, cb: (items: Record<string, StoredBackground | undefined>) => void) => {
            cb({ [key]: stored.get(key) });
          },
          set: (items: Record<string, StoredBackground>, cb: () => void) => {
            for (const [key, value] of Object.entries(items)) {
              stored.set(key, value);
            }
            cb();
          },
          remove: (_key: string, cb: () => void) => cb(),
        },
        onChanged: {
          addListener: vi.fn(),
          removeListener: vi.fn(),
        },
      },
    },
  });
}

describe('useBackground', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('falls back to the first preset and persists it when storage is empty', async () => {
    const stored = new Map<string, StoredBackground | undefined>();
    installChromeMock(stored);

    const { result } = renderHook(() => useBackground());

    await waitFor(() => {
      expect(result.current.url).toBe(runtime.getURL('img/backgrounds/01.jpg'));
    });

    expect(stored.get('settings.background')).toEqual({
      type: 'preset',
      url: runtime.getURL('img/backgrounds/01.jpg'),
      label: 'Preset 01',
    });
  });
});

