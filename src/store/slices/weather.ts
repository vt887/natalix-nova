export interface WeatherSlice {
  weatherStatus: 'idle' | 'loading' | 'error';
  data: unknown | null;
}

export const weatherInitialState: WeatherSlice = {
  weatherStatus: 'idle',
  data: null,
};
