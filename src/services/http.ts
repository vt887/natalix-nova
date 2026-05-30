export class HttpTimeoutError extends Error {
  readonly name = 'HttpTimeoutError';
}

export class HttpNetworkError extends Error {
  readonly name = 'HttpNetworkError';
}

export class HttpStatusError extends Error {
  readonly name = 'HttpStatusError';
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export class HttpJsonParseError extends Error {
  readonly name = 'HttpJsonParseError';
}

export interface FetchJsonOptions {
  timeoutMs?: number;
}

export async function fetchJson<T>(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  options: FetchJsonOptions | undefined = undefined,
): Promise<T> {
  const timeoutMs = options?.timeoutMs ?? 10_000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(input, { ...init, signal: controller.signal });
    const text = await res.text();

    if (!res.ok) {
      throw new HttpStatusError(res.status, `HTTP ${res.status}: ${text || res.statusText}`);
    }

    if (!text) {
      // Some endpoints return empty 204/200 bodies; treat as JSON null.
      return null as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new HttpJsonParseError(`Failed to parse JSON: ${msg}`);
    }
  } catch (err) {
    if (err instanceof HttpStatusError || err instanceof HttpJsonParseError) throw err;
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new HttpTimeoutError(`Request timed out after ${timeoutMs}ms`);
    }
    const msg = err instanceof Error ? err.message : String(err);
    throw new HttpNetworkError(msg);
  } finally {
    clearTimeout(timeoutId);
  }
}

