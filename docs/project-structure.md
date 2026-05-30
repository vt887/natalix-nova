# Project Structure — Natalix Nova

## Repository Layout

```
natalix-nova/
├── docs/                         ← Architecture & planning docs (Claude owns)
│   ├── analysis.md
│   ├── feature-inventory.md
│   ├── ui-documentation.md
│   ├── architecture.md
│   ├── tech-stack.md
│   ├── project-structure.md      ← this file
│   ├── testing-strategy.md
│   └── tasks/                    ← PR-sized task specs
│       ├── PR-01-foundation.md
│       ├── PR-02-ui-shell.md
│       └── ...
│
├── src/                          ← All source code (Codex owns)
│   ├── background/               ← Service Worker context
│   ├── components/               ← Shared UI components
│   ├── features/                 ← Feature modules
│   ├── hooks/                    ← Shared React hooks
│   ├── services/                 ← Browser API + external APIs
│   ├── store/                    ← Zustand store slices
│   ├── styles/                   ← Global CSS tokens + resets
│   ├── types/                    ← Shared TypeScript types
│   ├── utils/                    ← Pure utility functions
│   └── main.ts                   ← New tab page entry point
│
├── tests/                        ← Playwright E2E specs
│   ├── fixtures/                 ← Extension fixture setup
│   ├── newtab.spec.ts
│   ├── weather.spec.ts
│   ├── search.spec.ts
│   └── ...
│
├── public/                       ← Static assets (copied as-is to dist/)
│   └── img/
│       └── backgrounds/
│
├── index.html                    ← New tab page HTML entry
├── manifest.json                 ← Extension manifest
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
├── playwright.config.ts
├── Makefile
└── package.json
```

---

## Source Tree — Detail

### `src/background/`
Service Worker code. No React, no DOM.

```
src/background/
├── index.ts              ← SW entry point, registers all handlers
├── handlers/
│   ├── weather.ts        ← fetch weather, cache, respond
│   ├── calendar.ts       ← Google Calendar OAuth + fetch
│   ├── drive.ts          ← Google Drive recent files
│   ├── github.ts         ← GitHub notifications + PRs
│   ├── todoist.ts        ← Todoist tasks
│   ├── notion.ts         ← Notion pages
│   ├── stocks.ts         ← Stock/crypto prices
│   ├── backup.ts         ← export/import/auto-backup logic
│   ├── workspace.ts      ← tab group save/restore
│   └── session.ts        ← recently closed + session history
└── alarms.ts             ← chrome.alarms registration + dispatch
```

### `src/services/`
Abstractions over browser APIs and external HTTP. No React.

```
src/services/
├── browser/
│   ├── storage.ts        ← chrome.storage.local wrapper
│   ├── tabs.ts           ← chrome.tabs wrapper
│   ├── bookmarks.ts      ← chrome.bookmarks wrapper
│   ├── identity.ts       ← chrome.identity (OAuth tokens)
│   ├── notifications.ts  ← chrome.notifications wrapper
│   ├── alarms.ts         ← chrome.alarms wrapper
│   └── management.ts     ← chrome.management wrapper
└── http.ts               ← fetch wrapper (timeout, retry, JSON)
```

### `src/types/`
Shared TypeScript interfaces — imported by both background and UI code.

```
src/types/
├── messages.ts           ← Message union type (SW ↔ page protocol)
├── storage.ts            ← Storage namespace key types
├── backup.ts             ← BackupPayload schema
├── weather.ts
├── calendar.ts
├── github.ts
├── workspace.ts
└── index.ts              ← re-exports
```

### `src/store/`
Zustand store with slices.

```
src/store/
├── index.ts              ← createStore() combining all slices
└── slices/
    ├── settings.ts       ← theme, search provider, language, units
    ├── apps.ts           ← app grid items, order
    ├── weather.ts        ← weather data + loading state
    ├── notes.ts          ← quick notes content
    ├── pomodoro.ts       ← timer mode, remaining time, session count
    ├── habits.ts         ← habit definitions + today's state
    ├── workspaces.ts     ← saved workspaces list
    ├── stocks.ts         ← price data per ticker
    ├── integrations.ts   ← GitHub / Drive / Todoist / Notion data
    └── ui.ts             ← activePanel, focusMode, panelHistory
```

### `src/features/`
Each feature is a self-contained module: component + its own hooks + local types.

```
src/features/
├── search/
│   ├── SearchBar.tsx
│   ├── Autocomplete.tsx
│   ├── VoiceSearch.tsx
│   ├── useSearch.ts
│   └── providers.ts
│
├── weather/
│   ├── WeatherWidget.tsx     ← compact display in toolbar area
│   ├── WeatherForecast.tsx   ← expanded panel
│   ├── CitySearch.tsx        ← autocomplete city input
│   └── useWeather.ts
│
├── apps/
│   ├── AppGrid.tsx
│   ├── AppItem.tsx
│   ├── DraggableGrid.tsx
│   └── useApps.ts
│
├── calendar/
│   ├── CalendarWidget.tsx
│   └── useCalendar.ts
│
├── notes/
│   ├── QuickNotes.tsx
│   └── useNotes.ts
│
├── pomodoro/
│   ├── PomodoroWidget.tsx
│   ├── PomodoroSettings.tsx
│   └── usePomodoro.ts
│
├── habits/
│   ├── HabitsWidget.tsx
│   ├── HabitItem.tsx
│   └── useHabits.ts
│
├── worldclock/
│   ├── WorldClock.tsx
│   └── useWorldClock.ts
│
├── stocks/
│   ├── StocksWidget.tsx
│   └── useStocks.ts
│
├── workspaces/
│   ├── WorkspacesPanel.tsx
│   ├── WorkspaceItem.tsx
│   └── useWorkspaces.ts
│
├── backup/
│   ├── BackupPanel.tsx
│   └── useBackup.ts
│
├── bookmarks/
│   ├── BookmarksPanel.tsx
│   ├── BookmarkTree.tsx
│   └── useBookmarks.ts
│
├── background/
│   ├── BackgroundPanel.tsx
│   └── useBackground.ts
│
├── ai/
│   ├── AIPanel.tsx
│   ├── AISearchSuggestions.tsx
│   └── useAI.ts
│
├── github/
│   ├── GithubWidget.tsx
│   └── useGithub.ts
│
├── drive/
│   ├── DriveWidget.tsx
│   └── useDrive.ts
│
├── todoist/
│   ├── TodoistWidget.tsx
│   └── useTodoist.ts
│
└── settings/
    ├── SettingsPanel.tsx
    ├── sections/
    │   ├── AppearanceSection.tsx
    │   ├── SearchSection.tsx
    │   ├── WidgetsSection.tsx
    │   └── IntegrationsSection.tsx
    └── useSettings.ts
```

### `src/components/`
Shared, feature-agnostic UI primitives.

```
src/components/
├── Button/
├── Icon/
├── Panel/               ← slide-in panel shell (header, close, portal)
├── Toggle/
├── Input/
├── Tooltip/
├── Badge/
└── Spinner/
```

### `src/hooks/`
Shared hooks used across multiple features.

```
src/hooks/
├── useStorage.ts        ← typed chrome.storage.local hook
├── useMessage.ts        ← sendMessage wrapper with typed responses
├── useTheme.ts          ← reads + applies active theme
├── useOnClickOutside.ts
└── useDebounce.ts
```

### `src/styles/`
Global CSS — no component styles here (those live in `.module.css` per component).

```
src/styles/
├── tokens.css           ← CSS custom properties for all themes
├── reset.css            ← minimal browser reset
├── global.css           ← body, html, scrollbar, selection styles
└── themes/
    ├── dark.css
    ├── light.css
    ├── midnight.css
    └── solarized.css
```

---

## Module Boundary Rules

1. **`src/background/`** — no React, no DOM, no `window.*`
2. **`src/services/browser/`** — no React, no store imports
3. **`src/types/`** — no runtime code, types and interfaces only
4. **`src/features/X/`** — may import from `src/components/`, `src/hooks/`, `src/store/`, `src/services/browser/`
5. **Features do not import from other features** — cross-feature data flows through the store
6. **`src/store/slices/`** — no React, no direct `chrome.*` calls — uses services

---

## Entry Points (Manifest → Vite)

| manifest.json field | File | Context |
|---|---|---|
| `chrome_url_overrides.newtab` | `index.html` → `src/main.ts` | New Tab Page |
| `background.service_worker` | `src/background/index.ts` | Service Worker |
| `content_scripts[0].js` | `src/content.ts` | Content Script (if needed) |

---

## Test File Placement

- Unit tests: co-located with source — `src/features/weather/useWeather.test.ts`
- E2E tests: `tests/*.spec.ts`
- Test utilities/fixtures: `tests/fixtures/`
