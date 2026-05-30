import type { StocksFetchMessage } from '../../types/messages';

export async function handleStocksFetch(_message: StocksFetchMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

