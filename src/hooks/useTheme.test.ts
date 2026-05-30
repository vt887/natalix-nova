import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useTheme } from './useTheme';

type StoredValue = string;

function installChromeMock(stored: Map<string, StoredValue>): void {
  Object.defineProperty(globalThis, 'chrome', {
    configurable: true,
    value: {
      runtime: {
        getURL: (path: string) => `chrome-extension://test/${path}`,
        lastError: undefined,
      },
      storage: {
        local: {
          get: (key: string, cb: (items: Record<string, StoredValue | undefined>) => void) => {
            cb({ [key]: stored.get(key) });
          },
          set: (items: Record<string, StoredValue>, cb: () => void) => {
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

describe('useTheme', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  it('resolves auto mode from the system theme and cleans up the listener', async () => {
    const stored = new Map<string, StoredValue>([['settings.theme', 'auto']]);
    installChromeMock(stored);

    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();
    const matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener,
    });

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: matchMedia,
    });

    const { unmount } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe('light');
    });

    expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function));

    unmount();

    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});

