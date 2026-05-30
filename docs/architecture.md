# Architecture — Natalix Nova

## Extension Contexts

Chrome MV3 extensions run in three isolated JavaScript contexts that cannot share memory.
All communication between them happens via message passing.

```
┌─────────────────────────────────────────────────────────────────┐
│  BROWSER                                                        │
│                                                                 │
│  ┌─────────────────────────┐   ┌───────────────────────────┐   │
│  │  NEW TAB PAGE           │   │  SERVICE WORKER           │   │
│  │  (React app)            │◄──►  (background.ts)          │   │
│  │                         │   │                           │   │
│  │  - UI rendering         │   │  - chrome.alarms          │   │
│  │  - User interactions    │   │  - chrome.notifications   │   │
│  │  - Zustand store        │   │  - chrome.identity (OAuth)│   │
│  │  - Widget components    │   │  - chrome.management      │   │
│  │  - chrome.storage reads │   │  - External API calls     │   │
│  └─────────────────────────┘   │  - Auto backup scheduler  │   │
│                                │  - Alarm handlers         │   │
│  ┌─────────────────────────┐   └───────────────────────────┘   │
│  │  OFFSCREEN DOCUMENT     │                                    │
│  │  (offscreen.ts)         │                                    │
│  │                         │                                    │
│  │  - Web Speech API       │                                    │
│  │  - Audio playback       │                                    │
│  └─────────────────────────┘                                    │
└─────────────────────────────────────────────────────────────────┘
```

**Key difference from legacy:** localStorage is completely removed. All persistence goes
through `chrome.storage.local`. The offscreen document is used only for Web APIs unavailable
in service workers (Speech API, audio), not as a localStorage proxy.

---

## Message Passing

All messages follow a typed contract defined in `src/types/messages.ts`.

```typescript
// Every message has a name and typed payload
type Message =
  | { name: 'weather.fetch'; payload: { lat: number; lon: number } }
  | { name: 'calendar.getEvents' }
  | { name: 'calendar.authorize' }
  | { name: 'backup.export' }
  | { name: 'backup.import'; payload: BackupData }
  | { name: 'speech.start' }
  | { name: 'speech.stop' }
  | { name: 'tabs.getRecent' }
  | { name: 'workspace.save'; payload: { name: string } }
  | { name: 'workspace.restore'; payload: { id: string } }
```

**Pattern:** New Tab Page → `chrome.runtime.sendMessage` → Service Worker → `sendResponse`.

Service worker never initiates messages to the new tab page unprompted —
it uses `chrome.storage.onChanged` to push state updates passively.

---

## Browser API Abstraction Layer

All `chrome.*` calls are wrapped in an abstraction layer at `src/services/browser/`.
The new tab page never calls `chrome.*` APIs directly — it goes through services.

```
src/services/browser/
├── storage.ts       ← chrome.storage.local (get/set/remove/watch)
├── tabs.ts          ← chrome.tabs (query, recent, groups)
├── bookmarks.ts     ← chrome.bookmarks (getTree, search)
├── identity.ts      ← chrome.identity (getAuthToken, removeCachedToken)
├── notifications.ts ← chrome.notifications (create, clear)
├── alarms.ts        ← chrome.alarms (create, clear, onAlarm)
└── management.ts    ← chrome.management (getAll, onEnabled/Disabled)
```

**Benefits:**
- Testable: mock the service, not `chrome.*` globals
- Single place to handle `chrome.runtime.lastError`
- Easy to add caching or rate limiting per service

---

## Storage Strategy

**Single mechanism: `chrome.storage.local`** — no localStorage, no WebSQL.

### Storage Namespaces

| Namespace prefix | Content |
|---|---|
| `settings.*` | User preferences (search provider, units, theme, etc.) |
| `apps.*` | App grid order and custom icons |
| `weather.*` | Last fetched weather data + city + TTL |
| `backup.*` | Auto-backup data and metadata |
| `pomodoro.*` | Timer state, session history |
| `habits.*` | Habit definitions + daily completion records |
| `workspaces.*` | Saved tab workspaces |
| `widgets.*` | Widget layout configuration |
| `notes.content` | Quick notes text |
| `tokens.*` | External service tokens (GitHub, Todoist, Notion) |

### Storage Service API

```typescript
// src/services/browser/storage.ts
export const storage = {
  get<T>(key: string): Promise<T | undefined>
  set<T>(key: string, value: T): Promise<void>
  remove(key: string): Promise<void>
  watch<T>(key: string, cb: (newValue: T) => void): () => void  // returns unsubscribe
}
```

`chrome.storage.onChanged` drives Zustand store updates reactively —
the store subscribes to storage changes and updates its slices automatically.

---

## State Management

**Zustand** with slices per feature domain. The store lives entirely in the new tab page context.

```
src/store/
├── index.ts              ← combine all slices
├── slices/
│   ├── settings.ts       ← theme, search provider, units
│   ├── apps.ts           ← app grid items and order
│   ├── weather.ts        ← current weather data
│   ├── notes.ts          ← quick notes content
│   ├── pomodoro.ts       ← timer state
│   ├── habits.ts         ← habit list + today's completion
│   ├── workspaces.ts     ← saved tab workspaces
│   └── ui.ts             ← panel open/close, focus mode
```

**Data flow:**
```
chrome.storage.local
       │  onChange
       ▼
  Zustand store  ──► React components (via useStore hooks)
       ▲
  User action → service call → chrome.storage.set → onChange fires → store updates
```

Components never write to storage directly — they dispatch store actions
which call services, which persist to `chrome.storage.local`.

---

## React Architecture

### Component Hierarchy

```
<App>
├── <Background />           ← full-page background image
├── <SearchBar />            ← search input + provider + voice
│   └── <Autocomplete />     ← suggestions dropdown
├── <AppGrid />              ← pinned apps/speed dial
│   └── <AppItem />          ← individual app with badge
├── <FocusBar />             ← daily focus / todo line
├── <WeatherWidget />        ← compact weather display
│   └── <WeatherForecast />  ← expanded forecast panel
├── <LeftToolbar />          ← vertical sidebar
│   └── <ToolbarButton />    ← icon + tooltip
├── <PomodoroWidget />       ← timer display
├── <HabitsWidget />         ← daily habits
├── <WorldClock />           ← timezone clocks
├── <StocksWidget />         ← price tickers
│
└── <PanelContainer />       ← portal-based panels
    ├── <SettingsPanel />
    ├── <BookmarksPanel />
    ├── <NotificationsPanel />
    ├── <BackgroundPanel />
    ├── <WorkspacesPanel />
    ├── <AIPanel />
    └── <BackupPanel />
```

### Panels

Panels are rendered in a React Portal to `document.body`.
Only one panel is open at a time (controlled by `ui.activePanel` in the store).
Panels slide in/out via CSS transitions — no iframe, no separate HTML files.

---

## External API Strategy

| Service | Auth | Where called | Caching |
|---|---|---|---|
| Open-Meteo Weather | None | Service Worker | 30 min TTL in storage |
| Open-Meteo Geocoding | None | New Tab Page (direct) | No cache needed |
| Google Calendar | OAuth2 (`chrome.identity`) | Service Worker | 5 min TTL |
| Google Drive | OAuth2 (`chrome.identity`) | Service Worker | 5 min TTL |
| GitHub API | PAT token | Service Worker | 5 min TTL |
| Todoist API | API token | Service Worker | 5 min TTL |
| Notion API | Integration token | Service Worker | 5 min TTL |
| CoinGecko / Stocks | None / API key | Service Worker | 1 min TTL |

**Rule:** All authenticated external calls go through the Service Worker.
The new tab page sends a message, the service worker fetches and returns data.
This keeps auth tokens out of page context and centralizes rate limiting.

---

## OAuth2 Flow (Google Services)

```
New Tab Page                Service Worker             chrome.identity
     │                           │                          │
     │── { name: 'calendar.getEvents' } ──►                │
     │                           │── getAuthToken() ───────►│
     │                           │◄── token ───────────────│
     │                           │── fetch(Google API, token)
     │                           │◄── events data
     │◄── sendResponse(events) ──│
```

Token is **never stored** — `chrome.identity` manages the token cache.
On 401 response: call `removeCachedToken` then retry once.

---

## Backup / Restore Architecture

Export payload schema (v2):
```typescript
interface BackupPayload {
  version: 2
  exportedAt: string           // ISO date
  settings: SettingsState
  apps: AppItem[]
  notes: string
  habits: HabitDefinition[]
  workspaces: Workspace[]
  widgets: WidgetConfig
}
```

**Export:** Service Worker collects all namespaces from `chrome.storage.local`,
serializes to JSON, sends to new tab page as a Blob download.

**Import:** New tab page reads the file, sends payload to Service Worker for validation
and write to `chrome.storage.local`. Storage `onChange` events then refresh the store.

**Auto-backup:** `chrome.alarms` fires daily. Stores compressed JSON in
`backup.auto_data` with timestamp. Max 7 rolling auto-backups kept.

---

## Theme System

Themes are implemented as CSS custom properties on `:root`.

```css
:root[data-theme="dark"] {
  --color-bg: #0f0f0f;
  --color-surface: rgba(255,255,255,0.08);
  --color-text: #f0f0f0;
  --color-accent: #6366f1;
}
```

Active theme is read from `settings.theme` in storage.
`F-36 Auto dark/light` uses `window.matchMedia('(prefers-color-scheme: dark)')`
and sets `data-theme` on `<html>` accordingly when mode is `auto`.

---

## Content Security Policy

```json
"content_security_policy": {
  "extension_pages": "script-src 'self'; object-src 'none'; style-src 'self' 'unsafe-inline'"
}
```

- No inline scripts
- No `eval`
- `unsafe-inline` allowed for styles only (required for dynamic theming via CSS vars)
- External scripts: none — all third-party code is bundled by Vite

---

## Key Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| No localStorage | `chrome.storage.local` only | MV3 compliance, no offscreen proxy needed |
| No WebSQL | Not implemented | Deprecated API — frecency search replaced with simpler history API |
| React for UI | Yes | Component model, ecosystem, hooks for async state |
| Zustand for state | Yes | Minimal boilerplate, slice pattern, no Provider required |
| No iframe panels | React Portals | Single DOM, shared styles, no postMessage complexity |
| All external calls via SW | Yes | Centralized auth, rate limiting, caching |
| TypeScript strict | Yes | Catch errors at compile time, self-documenting APIs |
| Vite + crxjs | Yes | HMR for extension development, Manifest V3 support |
