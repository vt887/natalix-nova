# Testing Strategy — Natalix Nova

## Principles

1. Every PR must pass all test gates before merge — no exceptions
2. Unit tests cover logic; E2E tests cover user-visible behavior
3. Tests run against real code paths — no mocking of `chrome.storage` in E2E
4. A green test suite is a prerequisite for Codex to mark a task done

---

## Test Pyramid

```
        ┌──────────────┐
        │   E2E (Playwright)    ← ~30% of tests
        │   Full extension      ← real Chrome, real dist/
        ├──────────────┤
        │   Integration         ← ~30% of tests
        │   SW message handlers ← Vitest + chrome mock
        ├──────────────┤
        │   Unit                ← ~40% of tests
        │   Pure functions,     ← Vitest, no DOM
        │   hooks, utils        ← no chrome mock needed
        └──────────────┘
```

---

## Unit Tests — Vitest

**What to test:**
- Pure utility functions (`src/utils/`)
- Storage namespace key builders
- Backup payload normalization and validation
- Frecency / sorting algorithms
- Date/time formatting (world clock, calendar, pomodoro)
- Theme resolution logic
- Message type guards

**What NOT to unit test:**
- React components (covered by E2E)
- `chrome.*` API wrappers (covered by integration tests)
- External API responses (covered by E2E with fixtures)

**Setup:**
```ts
// vitest.config.ts
export default {
  test: {
    environment: 'node',       // pure logic: node
    // environment: 'jsdom',   // for hook tests
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      thresholds: { lines: 80, functions: 80 }
    }
  }
}
```

**Example:**
```ts
// src/utils/backup.test.ts
import { normalizeBackupPayload } from './backup'

test('accepts v2 payload', () => {
  const payload = { version: 2, settings: {}, apps: [], notes: '' }
  expect(normalizeBackupPayload(payload)).toMatchObject({ version: 2 })
})

test('rejects invalid payload', () => {
  expect(normalizeBackupPayload(null)).toBeNull()
  expect(normalizeBackupPayload('garbage')).toBeNull()
})
```

---

## Integration Tests — Vitest + Chrome Mock

**What to test:**
- Service Worker message handlers (`src/background/handlers/`)
- Storage service read/write/watch
- OAuth token refresh flow (identity mock)
- Auto-backup trigger logic (alarm mock)

**Chrome API mock:**
Use `vitest-chrome` or a hand-rolled mock at `tests/mocks/chrome.ts`:

```ts
// tests/mocks/chrome.ts
export const chromeMock = {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
      onChanged: { addListener: vi.fn() }
    }
  },
  identity: {
    getAuthToken: vi.fn(),
    removeCachedToken: vi.fn()
  },
  alarms: {
    create: vi.fn(),
    onAlarm: { addListener: vi.fn() }
  }
}

// Applied in vitest.setup.ts
global.chrome = chromeMock as any
```

**Example:**
```ts
// src/background/handlers/weather.test.ts
import { handleWeatherFetch } from './weather'

test('returns cached data within TTL', async () => {
  chromeMock.storage.local.get.mockResolvedValue({
    'weather.data': { temp: 20 },
    'weather.cachedAt': Date.now() - 60_000  // 1 min ago
  })
  const result = await handleWeatherFetch({ lat: 50, lon: 30 })
  expect(result.temp).toBe(20)
  expect(fetch).not.toHaveBeenCalled()
})
```

---

## E2E Tests — Playwright

**What to test:**
- Full user flows in a real Chrome instance with the extension loaded
- Visual presence of UI elements (app grid, search bar, widgets)
- User interactions (search, panel open/close, drag-and-drop)
- Feature integration (weather displayed, calendar events shown)
- Storage persistence (data survives tab reload)

**Extension fixture:**
```ts
// tests/fixtures/extension.ts
import { test as base, chromium, type BrowserContext } from '@playwright/test'
import path from 'path'

export const test = base.extend<{ context: BrowserContext; extensionId: string }>({
  context: async ({}, use) => {
    const distPath = path.resolve(__dirname, '../../dist')
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${distPath}`,
        `--load-extension=${distPath}`,
      ],
    })
    await use(context)
    await context.close()
  },
  extensionId: async ({ context }, use) => {
    const [background] = context.serviceWorkers()
    const url = background?.url() ?? ''
    const [, , id] = url.split('/')
    await use(id)
  },
})
```

**Spec structure:**
```
tests/
├── fixtures/
│   └── extension.ts
├── newtab.spec.ts          ← page load, layout, app grid
├── search.spec.ts          ← search input, providers, autocomplete
├── weather.spec.ts         ← widget display, city change, units
├── calendar.spec.ts        ← events display, auth flow
├── notes.spec.ts           ← edit, persist, reload
├── pomodoro.spec.ts        ← timer start/pause/reset
├── habits.spec.ts          ← check, persist, streak
├── backup.spec.ts          ← export file, import restore
├── workspaces.spec.ts      ← save, restore tab group
├── themes.spec.ts          ← theme switch, auto dark/light
├── focus.spec.ts           ← focus mode on/off
├── settings.spec.ts        ← options panel
├── storage.spec.ts         ← persistence across reloads
├── service-worker.spec.ts  ← SW message handling
└── soak.spec.ts            ← open/close 50 tabs, memory stability
```

**Example spec:**
```ts
// tests/newtab.spec.ts
import { test, expect } from './fixtures/extension'

test('renders app grid on load', async ({ context, extensionId }) => {
  const page = await context.newPage()
  await page.goto(`chrome-extension://${extensionId}/index.html`)
  await expect(page.locator('#app-grid')).toBeVisible()
  const items = page.locator('[data-testid="app-item"]')
  await expect(items).toHaveCount.above(0)
})

test('search bar is focused by default', async ({ context, extensionId }) => {
  const page = await context.newPage()
  await page.goto(`chrome-extension://${extensionId}/index.html`)
  await expect(page.locator('[data-testid="search-input"]')).toBeFocused()
})
```

---

## Test Attributes Convention

Components expose `data-testid` attributes for E2E selectors.
Never use CSS classes or IDs as E2E selectors — they change during styling work.

```tsx
// Good
<input data-testid="search-input" ... />
<div data-testid="app-item" ... />
<button data-testid="settings-button" ... />

// Bad — brittle
page.locator('#search')
page.locator('.tbar-btn')
```

---

## CI Gates (All Required)

```bash
npm run lint          # ESLint — zero errors
npm run typecheck     # tsc --noEmit — zero type errors
npm run test          # Vitest unit + integration
npm run build         # Vite production build must succeed
npx playwright test   # E2E — all specs pass
```

Order matters: lint and typecheck run first (fast), then unit tests, then build,
then E2E (slowest). CI fails fast on first gate failure.

---

## Coverage Targets

| Layer | Target |
|---|---|
| Unit (utils, pure logic) | 80% lines |
| Integration (SW handlers) | 70% lines |
| E2E (user flows) | All P0 + P1 features have at least one spec |

Coverage is measured by Vitest (`--coverage`). E2E coverage is tracked by spec existence,
not line coverage.

---

## What Playwright Cannot Test

These must be verified manually or with separate tooling:

- Chrome Web Store submission validation (`web-ext lint`)
- Extension install/update flow from CRX
- Cross-browser behavior on Edge vs Chrome
- Real OAuth2 consent screen (requires real Google account)
- Real geolocation (use `context.setGeolocation` mock in tests instead)
