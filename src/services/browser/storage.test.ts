import { describe, expect, it, vi } from 'vitest';

import { storage } from './storage';

type ChromeMock = {
  runtime: { lastError?: { message: string } };
  storage: {
    local: {
      get: (key: string, cb: (items: Record<string, unknown>) => void) => void;
      set: (items: Record<string, unknown>, cb: () => void) => void;
      remove: (key: string, cb: () => void) => void;
    };
    onChanged: {
      addListener: (
        cb: (changes: Record<string, { newValue?: unknown }>, area: string) => void,
      ) => void;
      removeListener: (
        cb: (changes: Record<string, { newValue?: unknown }>, area: string) => void,
      ) => void;
    };
  };
};

function installChromeMock(mock: ChromeMock): void {
  Object.defineProperty(globalThis, 'chrome', { value: mock, configurable: true });
}

describe('services/browser/storage', () => {
  it('get/set/remove roundtrip', async () => {
    const db = new Map<string, unknown>();
    const chromeMock: ChromeMock = {
      runtime: {},
      storage: {
        local: {
          get: (key, cb) => cb({ [key]: db.get(key) }),
          set: (items, cb) => {
            for (const [k, v] of Object.entries(items)) db.set(k, v);
            cb();
          },
          remove: (key, cb) => {
            db.delete(key);
            cb();
          },
        },
        onChanged: {
          addListener: () => undefined,
          removeListener: () => undefined,
        },
      },
    };
    installChromeMock(chromeMock);

    await storage.set('k', { a: 1 });
    await expect(storage.get<{ a: number }>('k')).resolves.toEqual({ a: 1 });
    await storage.remove('k');
    await expect(storage.get('k')).resolves.toBeUndefined();
  });

  it('watch emits new values and unsubscribes', async () => {
    let listener:
      | ((changes: Record<string, { newValue?: unknown }>, area: string) => void)
      | undefined;

    const chromeMock: ChromeMock = {
      runtime: {},
      storage: {
        local: {
          get: (_key, cb) => cb({}),
          set: (_items, cb) => cb(),
          remove: (_key, cb) => cb(),
        },
        onChanged: {
          addListener: (cb) => {
            listener = cb;
          },
          removeListener: (cb) => {
            if (listener === cb) listener = undefined;
          },
        },
      },
    };
    installChromeMock(chromeMock);

    const seen: number[] = [];
    const unsub = storage.watch<number>('k', (v) => seen.push(v));

    listener?.({ k: { newValue: 123 } }, 'local');
    listener?.({ other: { newValue: 1 } }, 'local');
    listener?.({ k: { newValue: 456 } }, 'sync');

    expect(seen).toEqual([123]);

    unsub();
    listener?.({ k: { newValue: 999 } }, 'local');
    expect(seen).toEqual([123]);
  });

  it('rejects on chrome.runtime.lastError', async () => {
    const chromeMock: ChromeMock = {
      runtime: { lastError: { message: 'boom' } },
      storage: {
        local: {
          get: (_key, cb) => cb({}),
          set: (_items, cb) => cb(),
          remove: (_key, cb) => cb(),
        },
        onChanged: {
          addListener: vi.fn(),
          removeListener: vi.fn(),
        },
      },
    };
    installChromeMock(chromeMock);

    await expect(storage.get('k')).rejects.toThrow('boom');
  });
});

