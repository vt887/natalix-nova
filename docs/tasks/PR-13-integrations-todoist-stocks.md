# PR-13 — Integrations: Todoist + Stocks/Crypto

## Scope

Todoist/Notion tasks widget and Stocks/Crypto price widget.

---

## Todoist / Notion Widget (F-35)

### Tasks

#### 1. SW handler (`src/background/handlers/todoist.ts`)
- Message: `{ name: 'todoist.fetch' }`
- Token from `tokens.todoist`
- Fetch today's tasks:
  ```
  GET https://api.todoist.com/rest/v2/tasks?filter=today
  Authorization: Bearer {token}
  ```
- Cache: 5 min TTL
- Complete task message: `{ name: 'todoist.complete', payload: { taskId } }`
  - `POST https://api.todoist.com/rest/v2/tasks/{taskId}/close`

#### 2. SW handler (`src/background/handlers/notion.ts`)
- Message: `{ name: 'notion.fetch' }`
- Token from `tokens.notion` (Notion Integration token)
- Fetch assigned pages: Notion API requires a database query — user must provide a Database ID
- Storage: `tokens.notionDatabaseId`
- Query: `POST https://api.notion.com/v1/databases/{databaseId}/query`
  - Filter: assigned to user, not done
  - Headers: `Authorization: Bearer {token}`, `Notion-Version: 2022-06-28`
- Cache: 5 min TTL

#### 3. TodoistWidget (`src/features/todoist/TodoistWidget.tsx`)
- Shows today's tasks (max 10)
- Checkbox to complete task → optimistic UI update → `todoist.complete` message
- "Connect Todoist" → settings if no token
- `data-testid="todoist-widget"`

#### 4. Settings — Integrations
- Todoist: token input + test connection
- Notion: token input + database ID input + test connection

---

## Stocks / Crypto Widget (F-28)

### Tasks

#### 1. SW handler (`src/background/handlers/stocks.ts`)
- Message: `{ name: 'stocks.fetch' }`
- Tickers from `widgets.stocks.tickers` (array of symbols)
- **Crypto** (default): CoinGecko API — no key required
  ```
  GET https://api.coingecko.com/api/v3/simple/price
    ?ids={ids}&vs_currencies=usd&include_24hr_change=true
  ```
- **Stocks**: Use Yahoo Finance unofficial endpoint or Alpha Vantage (requires API key from user)
- Cache: 1 min TTL (stocks change fast)
- Rate limit guard: skip fetch if last fetch < 30s ago

#### 2. StocksWidget (`src/features/stocks/StocksWidget.tsx`)
- Row per ticker: symbol + price + 24h change % (color-coded)
- Default tickers: BTC, ETH (crypto, no API key needed)
- "Add ticker" button → input → saved to `widgets.stocks.tickers`
- `data-testid="stocks-widget"`, `data-testid="stock-item-{symbol}"`

#### 3. Stocks store slice (`src/store/slices/stocks.ts`)
```typescript
interface StockQuote {
  symbol: string
  price: number
  change24h: number   // percent
  updatedAt: number
}
interface StocksState {
  quotes: Record<string, StockQuote>
  tickers: string[]
  status: 'idle' | 'loading' | 'success' | 'error'
}
```

#### 4. Settings — Stocks
In Settings Widgets section:
- List of tickers with remove button
- Add ticker input
- Alpha Vantage API key input (optional, for stock support)

## Acceptance Criteria

**Todoist:**
- [ ] Today's tasks shown after token connected
- [ ] Checking a task marks it complete (optimistic UI)
- [ ] "No tasks today" empty state shown
- [ ] No token state shows connect button

**Notion:**
- [ ] Pages from configured database shown after token connected
- [ ] No token / no database ID → guided setup shown

**Stocks:**
- [ ] BTC and ETH prices shown by default (no API key)
- [ ] Price updates every 1 min
- [ ] 24h change shown in green (positive) or red (negative)
- [ ] Can add/remove tickers in settings
- [ ] Error state (network down) doesn't crash widget

## Out of Scope

- Todoist task creation from extension
- Notion page editing
- Stock portfolio tracking / P&L
- Real-time websocket price feeds

## Technical Notes

- CoinGecko free tier: 30 calls/min — 1 min TTL is safe for reasonable ticker counts
- CoinGecko uses coin IDs not symbols (`bitcoin` not `BTC`) — maintain a symbol→id map for common coins
- Notion API requires CORS-friendly access — all calls from SW
- Todoist: optimistic complete → if SW returns error, revert checkbox state

## Test Requirements

- [ ] Unit: CoinGecko symbol → id mapping
- [ ] Unit: stocks store — cache TTL, optimistic complete revert
- [ ] E2E: `tests/newtab.spec.ts` — widgets render in no-token state without crash
