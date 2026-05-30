export interface StocksSlice {
  pricesByTicker: Record<string, number>;
  stocksStatus: 'idle' | 'loading' | 'error';
}

export const stocksInitialState: StocksSlice = {
  pricesByTicker: {},
  stocksStatus: 'idle',
};
