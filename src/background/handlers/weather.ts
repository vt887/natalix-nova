import type { WeatherFetchMessage } from '../../types/messages';

export async function handleWeatherFetch(_message: WeatherFetchMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

