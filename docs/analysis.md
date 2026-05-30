# Analysis — Legacy Extension (chatgpt-home-tab)

## Extension Identity

| Field | Value |
|---|---|
| Name | Natalix Nova — Smart Start Page |
| Version | 2026.5 |
| Manifest Version | 3 (MV3) |
| Minimum Chrome | 120 |
| Entry Point | index.html (chrome_url_overrides → newtab) |
| Service Worker | js/service_worker.js |

---

## Permissions Audit

### Declared Permissions
| Permission | Purpose | Risk |
|---|---|---|
| `bookmarks` | Read/display user bookmarks | Low |
| `tabs` | Track tab navigation for history search | Medium |
| `scripting` | Inject content scripts dynamically | Medium |
| `management` | List/manage installed Chrome apps | High — broad access |
| `notifications` | Display Chrome notifications | Low |
| `webNavigation` | Track visited URLs for frecency engine | Medium |
| `storage` | chrome.storage.local for settings/state | Low |
| `unlimitedStorage` | Large WebSQL database for history search | Medium |
| `cookies` | Unknown usage — likely legacy | High — review needed |
| `idle` | Detect idle state | Low |
| `identity` | Google OAuth2 for Calendar | Medium |
| `offscreen` | localStorage proxy via offscreen document | Medium |
| `alarms` | Scheduled background tasks | Low |
| `geolocation` | Weather location detection | Medium |

### Optional Permissions
| Permission | Purpose |
|---|---|
| `history` | Read browser history |

### Host Permissions
- `http://*/*`, `https://*/*`, `<all_urls>` — **very broad**, needs narrowing

### OAuth2
- Scope: `https://www.googleapis.com/auth/calendar.readonly`
- Used for Google Calendar events integration

---

## Architecture Analysis

### Tech Stack (Legacy)
| Layer | Technology | Issues |
|---|---|---|
| Language | Vanilla JavaScript (ES5/ES6 mixed) | No type safety |
| Bundler | None — raw script tags | No tree-shaking, no HMR |
| Framework | None | Manual DOM manipulation |
| State | Global variables + localStorage | Race conditions, no reactivity |
| Storage | chrome.storage.local + WebSQL + localStorage via offscreen | Three separate mechanisms, no unified API |
| Build | None | No lint pipeline, no CI gate |
| Tests | Playwright (e2e only) | No unit tests |

### Critical Architecture Problems

#### 1. Global Scope Pollution
```js
window.$ = function (sel, ctx) { return (ctx||document).querySelectorAll(sel); }
NodeList.prototype.__proto__ = Array.prototype;
Node.prototype.on = window.on = function (name, fn, capture) { ... }
```
Every module writes to `window.*` — no encapsulation, naming collisions possible.

#### 2. Manual Lazy Loading
```js
include_js_once('js/widgets/notes.js');
include_js_once('js/widgets/notifications.js', function () { ... });
```
Custom module loader — fragile ordering, no static analysis possible.

#### 3. WebSQL (Deprecated API)
Used in `js/search/background.js` for storing browsing history and frecency scores.
WebSQL was deprecated and removed from Chrome standards. Replacement: IndexedDB or OPFS.

#### 4. localStorage via Offscreen Document
MV3 service workers cannot access `localStorage`. The extension uses an offscreen document
(`pages/offscreen.html`) as a proxy via message passing. This adds latency and complexity.

#### 5. Callback Hell
Majority of async code uses callbacks instead of Promises/async-await, making flow
hard to follow and error-prone.

#### 6. No TypeScript
No type checking. Runtime errors discovered only in testing or production.

#### 7. Overly Broad host_permissions
`<all_urls>` + `http://*/*` + `https://*/*` — more than required for a new tab extension.

---

## Storage Mechanisms

| Mechanism | Where Used | Data Stored |
|---|---|---|
| `chrome.storage.local` | lib/storage.js, service_worker.js | Settings, search providers, app ordering |
| `localStorage` (via offscreen) | background/offscreen_worker.js | Legacy settings keys (FB_option_*) |
| WebSQL / SQLite | js/search/background.js | URLs, frecency scores, visit history |

### Storage Keys (from service_worker.js / storage.js)
- `user_app_ids` — ordered list of pinned app IDs
- `search_provider` — active search engine
- `FB_option_*` — legacy settings namespace

---

## Browser API Usage

| API | File | Notes |
|---|---|---|
| `chrome.management` | service_worker.js | Full installed apps access |
| `chrome.bookmarks` | panels/bookmarks | Read user bookmarks |
| `chrome.tabs` | service_worker.js | Track navigations |
| `chrome.storage.local` | lib/storage.js | Main storage |
| `chrome.runtime.sendMessage` | All files | Message passing |
| `chrome.identity` | service_worker.js | Google OAuth |
| `chrome.notifications` | service_worker.js | Push notifications |
| `chrome.alarms` | service_worker.js | Scheduled jobs |
| `chrome.offscreen` | service_worker.js | localStorage proxy |
| `chrome.webNavigation` | service_worker.js | History tracking |
| `navigator.geolocation` | js/weather/weather.js | Location for weather |

---

## External API Integrations

| Service | API | Auth | Notes |
|---|---|---|---|
| Open-Meteo Geocoding | `geocoding-api.open-meteo.com/v1/search` | None | City search for weather |
| Open-Meteo Weather | Likely weather.open-meteo.com | None | Free, no API key |
| Google Calendar | `googleapis.com/auth/calendar.readonly` | OAuth2 | Events in widget |
| Gmail | Detected via app ID heuristics | Via management API | Badge count only |

---

## Security & Privacy Concerns

1. **`cookies` permission** — declared but purpose unclear. Should be audited and removed if unused.
2. **`management` permission** — allows reading all installed Chrome apps. Requires user trust.
3. **`<all_urls>` host permission** — full network access. Narrow to specific hosts needed for integrations.
4. **OAuth client_id** in manifest.json — acceptable for extensions (public key), but must not store refresh tokens in localStorage.
5. **`offscreen` + localStorage** — localStorage data is plaintext, visible via DevTools.
6. **No CSP hardening** — current CSP allows extension pages to load resources without strict restrictions.

---

## Performance Concerns

1. **WebSQL full table scans** — `SELECT * FROM urls WHERE type = 1` on large history databases.
2. **No code splitting** — all JS loaded upfront via `<script>` tags in index.html.
3. **Lazy loading via include_js_once** — widgets loaded on demand but with no caching guarantee.
4. **Weather re-fetched on every new tab** — no caching strategy visible.
5. **Offscreen roundtrip** — every localStorage read/write goes through a message hop to offscreen document.

---

## Test Coverage (Playwright)

| Spec | Coverage |
|---|---|
| newtab.spec.ts | Page load, app grid, search provider, background |
| weather.spec.ts | Weather widget display |
| search.spec.ts | Search input, provider switching |
| storage.spec.ts | chrome.storage read/write |
| focus.spec.ts | Focus mode behavior |
| menus.spec.ts | Context menus |
| network.spec.ts | Network request validation |
| notifications.spec.ts | Chrome notifications |
| options.spec.ts | Settings panel |
| popup.spec.ts | Popup window |
| sidepanel.spec.ts | Side panel |
| soak.spec.ts | Stress/endurance |
| icons.spec.ts | App icons |
| service-worker.spec.ts | Service worker messaging |

**Gap:** No unit tests. All tests are integration/e2e via Playwright.

---

## Summary of Risks for Rewrite

| Risk | Severity | Mitigation |
|---|---|---|
| WebSQL removal | Critical | Migrate to IndexedDB or remove history-based search |
| localStorage via offscreen | High | Replace with chrome.storage or IndexedDB |
| Global state management | High | Introduce proper state (Zustand/Redux) |
| `cookies` + broad host_permissions | Medium | Audit and narrow permissions |
| No TypeScript | Medium | Full TypeScript from day one in natalix-nova |
| No unit tests | Medium | Add Vitest unit tests alongside Playwright |
| Gmail detection via app ID | Low | Consider proper Gmail API or drop feature |
