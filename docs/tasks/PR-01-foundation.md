# PR-01 — Foundation

## Scope

Set up the complete project scaffold that all subsequent PRs build on.
No visible UI. The extension must install and load without errors.

## Tasks

### 1. manifest.json
- `manifest_version: 3`
- `chrome_url_overrides.newtab: "index.html"`
- `background.service_worker: "src/background/index.ts"`
- Permissions: `bookmarks, tabs, scripting, management, notifications, webNavigation, storage, unlimitedStorage, idle, identity, offscreen, alarms, geolocation`
- Optional permissions: `history`
- Host permissions: narrowed — remove `<all_urls>`, keep only what integrations need
- `oauth2` with `calendar.readonly` scope
- `minimum_chrome_version: "120"`

### 2. package.json + dependencies
Install all packages from `docs/tech-stack.md` Package Summary.

### 3. TypeScript config
- `tsconfig.json` with `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`
- Separate `tsconfig.node.json` for Vite config

### 4. Vite config
- `vite.config.ts` using `@crxjs/vite-plugin`
- Entry: manifest.json drives all entry points

### 5. ESLint config
- `eslint.config.js` (flat config, ESLint 9)
- Plugins: `@typescript-eslint`, `react-hooks`, `jsx-a11y`
- Rule: no `console.log` (warn), `@typescript-eslint/no-explicit-any` (error)

### 6. CSS design tokens
- `src/styles/tokens.css` — all CSS custom properties for all themes
- `src/styles/reset.css`
- `src/styles/global.css`
- `src/styles/themes/dark.css`, `light.css`, `midnight.css`, `solarized.css`

### 7. Browser API abstraction layer
Implement all files in `src/services/browser/`:
- `storage.ts` — `get<T>`, `set<T>`, `remove`, `watch`
- `tabs.ts` — `query`, `getRecent`, `getCurrent`
- `bookmarks.ts` — `getTree`, `search`
- `identity.ts` — `getAuthToken`, `removeCachedToken`
- `notifications.ts` — `create`, `clear`
- `alarms.ts` — `create`, `clear`, `onAlarm`
- `management.ts` — `getAll`, `get`, `onEnabled`, `onDisabled`

### 8. Shared types
- `src/types/messages.ts` — full Message union type
- `src/types/storage.ts` — storage key constants and value types
- `src/types/backup.ts` — BackupPayload v2 schema
- `src/types/index.ts` — re-exports

### 9. HTTP service
- `src/services/http.ts` — fetch wrapper with timeout (10s), JSON parse, typed errors

### 10. Service Worker skeleton
- `src/background/index.ts` — registers `chrome.runtime.onMessage` listener
- Routes messages by `name` to handler stubs (return `{ error: 'not implemented' }`)
- `src/background/alarms.ts` — registers alarm names as constants, onAlarm dispatch

### 11. Zustand store skeleton
- `src/store/index.ts` with all slice imports
- Each slice in `src/store/slices/` with initial state only (no logic yet)

### 12. Makefile
Targets: `install`, `dev`, `build`, `typecheck`, `lint`, `test`, `e2e`, `zip`, `clean`

### 13. Playwright config
- `playwright.config.ts` pointing to `dist/` for extension path
- Extension fixture in `tests/fixtures/extension.ts`

## Acceptance Criteria

- [ ] `make install` completes without errors
- [ ] `make lint` passes (zero errors)
- [ ] `make typecheck` passes (zero type errors)
- [ ] `make build` produces a valid `dist/` folder
- [ ] Loading `dist/` in Chrome as unpacked extension shows no errors in chrome://extensions
- [ ] Opening a new tab shows a blank white page (no JS errors in DevTools console)
- [ ] Service Worker starts and appears in chrome://extensions → Service Worker

## Out of Scope

- Any visible UI beyond a blank page
- Any feature implementation
- Data fetching

## Technical Notes

- `src/background/index.ts` must call `self.addEventListener('install', ...)` to activate SW immediately
- `storage.ts` `watch()` returns an unsubscribe function — this pattern must be consistent
- All `chrome.*` errors must be caught via `chrome.runtime.lastError` in callbacks or try/catch in promise wrappers
- Do not use `window` in `src/background/` — use `self` for SW context

## Test Requirements

- [ ] Unit: `src/services/browser/storage.test.ts` — get, set, remove, watch with chrome mock
- [ ] Unit: `src/services/http.test.ts` — timeout, JSON parse, error handling
- [ ] Unit: `src/types/messages.test.ts` — type guard functions for each message type
- [ ] E2E: `tests/newtab.spec.ts` — page loads, no console errors, SW active
