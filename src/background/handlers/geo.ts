import type { GeoFetchMessage } from '../../types/messages';

export async function handleGeoFetch(_message: GeoFetchMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

