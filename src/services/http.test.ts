import { describe, expect, it, vi } from 'vitest';

import {
  fetchJson,
  HttpJsonParseError,
  HttpStatusError,
  HttpTimeoutError,
} from './http';

describe('services/http', () => {
  it('parses JSON on 200', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 })),
    );

    await expect(fetchJson<{ ok: boolean }>('https://example.test', undefined)).resolves.toEqual({
      ok: true,
    });
  });

  it('throws HttpStatusError on non-2xx', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('nope', { status: 401 })));
    await expect(fetchJson('https://example.test', undefined)).rejects.toBeInstanceOf(HttpStatusError);
  });

  it('throws HttpJsonParseError on invalid JSON', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('not-json', { status: 200 })));
    await expect(fetchJson('https://example.test', undefined)).rejects.toBeInstanceOf(
      HttpJsonParseError,
    );
  });

  it('times out', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async (_input: RequestInfo | URL, init?: RequestInit) =>
          await new Promise<Response>((_resolve, reject) => {
            const signal = init?.signal;
            if (signal) {
              signal.addEventListener('abort', () => {
                reject(new DOMException('Aborted', 'AbortError'));
              });
            }
          }),
      ),
    );

    const p = fetchJson('https://example.test', undefined, { timeoutMs: 10 });
    await vi.advanceTimersByTimeAsync(11);
    await expect(p).rejects.toBeInstanceOf(HttpTimeoutError);
    vi.useRealTimers();
  });
});

