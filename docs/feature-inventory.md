# Feature Inventory — Legacy Extension (chatgpt-home-tab)

## Feature Status Legend
- ✅ Implemented & working
- ⚠️ Implemented with issues / deprecated API
- ❌ Broken / disabled in code
- 🔄 Partially implemented

---

## Core Features

### F-01 — New Tab Override
- **Status:** ✅
- **Description:** Replaces Chrome's default new tab page with a custom start page.
- **Entry:** `manifest.json → chrome_url_overrides.newtab → index.html`
- **Notes:** Entire extension UX lives inside this page.

---

### F-02 — App Grid (Pinned Apps / Speed Dial)
- **Status:** ✅
- **Description:** Grid of pinned Chrome apps and websites. Drag-and-drop reordering. Custom icons.
- **Files:** `js/main.js`, `js/draggable.js`, `panels/new_app/`
- **Storage:** `user_app_ids` in chrome.storage.local
- **APIs:** `chrome.management` (list all installed apps)
- **Notes:**
  - Apps sorted by `user_app_ids` ordering key
  - Custom add-app panel with Fuse.js fuzzy search (`panels/new_app/store/fuse.min.js`)
  - Indicators/badges for unread counts (Gmail, notifications)

---

### F-03 — Search Bar
- **Status:** ✅
- **Description:** Multi-engine search with provider switching.
- **Files:** `js/search/search_provider.js`, `js/search/providers.js`, `js/search/common.js`
- **Providers:** Google, Bing + configurable
- **Features:**
  - Provider logo badge shown in search bar
  - Voice/speech search input
  - Autocomplete suggestions (js/search/suggest.js)
  - History-based suggestions via WebSQL frecency engine
- **Issues:** WebSQL deprecated. `fauxmine.js` appears to be a SQLite/WebSQL wrapper.

---

### F-04 — History-Based Search / Frecency Engine
- **Status:** ⚠️
- **Description:** Ranks search suggestions by browsing history frequency + recency score.
- **Files:** `js/search/background.js`, `js/search/words_index.js`, `js/search/fauxmine.js`
- **Storage:** WebSQL database (deprecated)
- **APIs:** `chrome.webNavigation`, `chrome.tabs`, optional `history`
- **Issues:**
  - WebSQL is removed from Chrome standards — **must be migrated**
  - Full table scans on large datasets

---

### F-05 — Weather Widget
- **Status:** ✅
- **Description:** Current weather + forecast displayed on the new tab page.
- **Files:** `js/weather/weather.js`, `js/weather/weather_background.js`, `js/weather/weather_conditions.js`, `css/weather.css`
- **External APIs:**
  - Open-Meteo Geocoding: `geocoding-api.open-meteo.com/v1/search` — city name → coordinates
  - Weather API: likely `api.open-meteo.com` (free, no API key)
- **APIs:** `navigator.geolocation`, `chrome.runtime.sendMessage({name: 'geo.fetch'})`
- **Features:**
  - City name search with autocomplete (from geocoding API)
  - Geolocation-based auto-detect
  - Background image changes with weather conditions (`weather_background.js`)
  - Forecast panel (hover/click)

---

### F-06 — Google Calendar Widget
- **Status:** ✅
- **Description:** Shows upcoming calendar events from Google Calendar.
- **Files:** `js/widgets/calendar.js`, `js/service_worker.js`
- **External APIs:** Google Calendar API (read-only)
- **Auth:** OAuth2 via `chrome.identity` — scope: `calendar.readonly`
- **Messages:** `get-calendar-events`, `is-calendar-authorized`, `prompt-calendar-auth`
- **Features:**
  - Shows next/upcoming events
  - Day/time formatting
  - Click to open Google Calendar
  - Disabled in "privacy-clean mode"

---

### F-07 — Gmail Badge Integration
- **Status:** ⚠️
- **Description:** Shows unread Gmail count as badge on Gmail app icon.
- **Files:** `js/service_worker.js`, `js/main.js`
- **Detection method:** Heuristic — detects Gmail by Chrome app ID (`pjkljhegncpnkpknbcohdijeoejaedia`) or URL pattern
- **APIs:** `chrome.management` (to identify Gmail app)
- **Issues:** Relies on hardcoded app IDs — fragile. No Gmail API used.

---

### F-08 — Notifications Widget
- **Status:** ✅
- **Description:** Shows recent Chrome notifications. Displays global unread badge.
- **Files:** `js/widgets/notifications.js`
- **APIs:** `chrome.notifications`
- **Features:**
  - Unread counter badge on toolbar
  - Notification list in panel
  - Badge indicators per app

---

### F-09 — Quick Notes
- **Status:** ✅
- **Description:** Inline editable text note area on the new tab page.
- **Files:** `js/widgets/notes.js`
- **Storage:** localStorage (via offscreen document)
- **Features:**
  - Plain-text paste enforcement
  - Auto-save on edit
  - Persistent across sessions

---

### F-10 — Background Image Panel
- **Status:** ✅
- **Description:** Manages the new tab background image. Supports custom and preset backgrounds.
- **Files:** `panels/background/background_panel.html`, `js/toolbar/background_button_hover.js`
- **Storage:** chrome.storage.local
- **Features:**
  - Background slideshow / rotation
  - Weather-based background changes
  - Hover preview

---

### F-11 — Options / Settings Panel
- **Status:** ✅
- **Description:** User-configurable settings for the extension.
- **Files:** `panels/options/options_panel.html`, `panels/options/options_panel.js`
- **Features:** Search provider selection, notification settings, weather preferences, etc.

---

### F-12 — Bookmarks Panel
- **Status:** ✅
- **Description:** Slide-out panel showing user bookmarks.
- **Files:** `panels/bookmarks/bookmarks_panel.html`
- **APIs:** `chrome.bookmarks`
- **Features:** Hierarchical bookmark tree, search within bookmarks

---

### F-13 — Voice / Speech Search
- **Status:** ✅
- **Description:** Voice input for search using Web Speech API.
- **Files:** `js/search/search_by_speach.js`, `panels/speech/speech_panel.html`
- **APIs:** `webkitSpeechRecognition` (Web Speech API)
- **Notes:** Typo in filename (`speach` → `speech`). Panel shown in modal.

---

### F-14 — Toolbar
- **Status:** ✅
- **Description:** Top toolbar with action buttons.
- **Files:** `js/toolbar/toolbar.js`, `js/toolbar/apps_button.js`, `js/toolbar/focus_click.js`
- **Features:**
  - Apps button (opens add-app panel)
  - Focus mode toggle
  - Background button (hover preview)

---

### F-15 — Focus Mode
- **Status:** ✅
- **Description:** Hides distracting elements, shows only search bar.
- **Files:** `js/toolbar/focus_click.js`
- **Tests:** `tests/focus.spec.ts`

---

### F-16 — Onboarding
- **Status:** ✅
- **Description:** First-run onboarding flow for new users.
- **Files:** `pages/onboard/onboard.html`
- **Notes:** Shown once after install via `chrome.runtime.onInstalled`

---

### F-17 — Side Panel
- **Status:** 🔄
- **Description:** Chrome Side Panel integration.
- **Tests:** `tests/sidepanel.spec.ts` exists — functionality unclear
- **Notes:** May be partially implemented or experimental

---

### F-18 — App Store Panel
- **Status:** ⚠️
- **Description:** In-extension panel for browsing/adding Chrome apps.
- **Files:** `panels/new_app/store/store.html`, `panels/new_app/store/store.js`
- **Notes:** Has `old/` subdirectory — suggests previous redesign. Fuse.js for search.

---

### F-19 — Draggable App Icons
- **Status:** ✅
- **Description:** Drag-and-drop reordering of app grid icons.
- **Files:** `js/draggable.js`
- **Storage:** Persisted order in `user_app_ids`

---

### F-20 — Themes
- **Status:** ✅
- **Description:** Visual theme support (dark/light/custom).
- **Files:** `css/themes.css`, `js/style.js`

---

### F-21 — AI Panel
- **Status:** ❌ / 🔄
- **Description:** Panel directory exists (`panels/ai/`) — no JS files found. Likely planned.
- **Files:** `panels/ai/` (empty or stub)

---

### F-22 — Recently Closed Tabs
- **Status:** ✅
- **Description:** Shows recently closed browser tabs.
- **Files:** `js/recently_closed.js`
- **APIs:** `chrome.sessions`

---

### F-23 — Search Promo
- **Status:** ⚠️
- **Description:** Promotional banner for search provider.
- **Files:** `js/search/promo/search_promo.js`, `js/search/promo/search_promo.html`
- **Notes:** Likely monetization feature — should be reviewed for natalix-nova

---

### F-24 — Page Navigation (Questions / Blank)
- **Status:** 🔄
- **Description:** Internal pages for special states.
- **Files:** `pages/questions.html`, `pages/blank.html`
- **Notes:** `questions.html` may be part of onboarding or settings flow

---

### F-25 — Backup / Restore
- **Status:** ✅ (legacy, `js/backup.js`)
- **Description:** Export/import all user data as a JSON file. Auto-backup once per day.
- **Files:** `js/backup.js` (585 lines)
- **Features:**
  - Manual export → `HomeNewTab_Backup_<date>.json` (settings + app icons as base64)
  - Manual import — full restore or apps-only restore
  - Auto backup triggered by `chrome.idle` (idle/locked state), max once per day
  - Auto backup stored in localStorage: `BAK_auto_backup_data`, `BAK_auto_backup_time`
  - Two backup schema versions with normalization (`normalizeBackupPayload`)
- **Storage:** localStorage (via offscreen) → must migrate to `chrome.storage.local`

---

### F-26 — Pomodoro Timer
- **Status:** ❌ (new)
- **Description:** Focus timer with work/break intervals directly on the new tab page.
- **Features:**
  - Configurable work (25 min) / short break (5 min) / long break (15 min) intervals
  - Visual countdown, session counter
  - Chrome notification when session ends
  - Persisted session state across tab reloads

---

### F-27 — Habit Tracker
- **Status:** ❌ (new)
- **Description:** Daily habit checkboxes that reset each day.
- **Features:**
  - User-defined list of habits
  - Daily completion tracking with streak counter
  - History stored in `chrome.storage.local` (rolling 30-day window)

---

### F-28 — Stocks / Crypto Widget
- **Status:** ❌ (new)
- **Description:** Real-time price display for user-configured stocks and crypto.
- **External APIs:** Public finance API (e.g. Yahoo Finance unofficial, CoinGecko for crypto)
- **Features:**
  - User-configurable ticker symbols
  - Price + % change display
  - Color-coded (green/red)
  - Cached with TTL to avoid rate limits

---

### F-29 — World Clock
- **Status:** ❌ (new)
- **Description:** Multiple timezone clocks displayed on the new tab.
- **Features:**
  - User-configurable list of cities/timezones
  - Live clock updates (1s interval)
  - 12h / 24h format option
  - No external API needed (Intl.DateTimeFormat)

---

### F-30 — AI Search Suggestions
- **Status:** ❌ (new, `panels/ai/` exists but empty)
- **Description:** AI-powered query suggestions and answer previews in the search bar.
- **Features:**
  - Inline AI suggestions as user types
  - "Ask AI" shortcut key to open AI chat panel
  - Configurable AI provider (Claude, OpenAI, Gemini)
  - Privacy mode: disable AI suggestions

---

### F-31 — Tab Workspace (Save / Restore Tab Groups)
- **Status:** ❌ (new)
- **Description:** Save the current set of open tabs as a named workspace. Restore later.
- **APIs:** `chrome.tabs`, `chrome.tabGroups`, `chrome.sessions`
- **Features:**
  - Save current window tabs as a named workspace
  - List saved workspaces with tab count and favicon previews
  - One-click restore (open all tabs in new window or current window)
  - Stored in `chrome.storage.local`

---

### F-32 — Session Restore
- **Status:** ❌ (new, extends F-22 Recently Closed)
- **Description:** Full session history — restore any previous browsing session, not just the last closed tab.
- **APIs:** `chrome.sessions`
- **Features:**
  - List of past sessions grouped by date
  - Restore individual tabs or full sessions
  - Search within session history

---

### F-33 — Google Drive Widget
- **Status:** ❌ (new)
- **Description:** Shows recent Google Drive files directly on the new tab.
- **External APIs:** Google Drive API v3 (files.list)
- **Auth:** OAuth2 via `chrome.identity` (scope: `drive.readonly` or `drive.metadata.readonly`)
- **Features:**
  - Last 5–10 recently modified files
  - File type icons (Docs, Sheets, Slides, PDF)
  - Click to open in browser

---

### F-34 — GitHub Widget
- **Status:** ❌ (new)
- **Description:** Shows GitHub notifications and open PRs for the user.
- **External APIs:** GitHub REST API (`/notifications`, `/pulls`)
- **Auth:** GitHub Personal Access Token stored in `chrome.storage.local`
- **Features:**
  - Unread notifications count + list
  - Open PRs assigned to user
  - Click to open in GitHub

---

### F-35 — Notion / Todoist Widget
- **Status:** ❌ (new)
- **Description:** Show tasks/pages from Notion or Todoist on the new tab.
- **External APIs:** Notion API, Todoist REST API
- **Auth:** API token per service, stored in `chrome.storage.local`
- **Features:**
  - Today's tasks from Todoist
  - Recent Notion pages / assigned tasks
  - Quick task completion toggle (Todoist)

---

### F-36 — Auto Dark / Light Theme
- **Status:** ❌ (new)
- **Description:** Automatically switch between dark and light theme based on OS preference.
- **Implementation:** `window.matchMedia('(prefers-color-scheme: dark)')` + listener
- **Features:**
  - Auto mode (follows OS)
  - Manual override (always dark / always light)
  - Smooth CSS transition on switch
  - Persisted preference in `chrome.storage.local`

---

### F-37 — Themes (full system)
- **Status:** ⚠️ (partial in legacy — `css/themes.css`, `js/style.js`)
- **Description:** Full theme system with preset and custom themes.
- **Legacy:** `css/themes.css` has color overrides; `js/style.js` applies them
- **New scope:**
  - Named theme presets (Dark, Light, Midnight, Solarized, etc.)
  - Custom color picker for accent, background, text
  - Auto dark/light integration (F-36)
  - Theme export/import as part of backup (F-25)

---

## Feature Priority for natalix-nova Rewrite

| Priority | Feature |
|---|---|
| P0 — Must Have | F-01 New Tab, F-02 App Grid, F-03 Search, F-05 Weather, F-10 Background, F-11 Options |
| P1 — Should Have | F-06 Calendar, F-09 Notes, F-08 Notifications, F-14 Toolbar, F-12 Bookmarks, F-15 Focus Mode, F-25 Backup/Restore, F-36 Auto Dark/Light, F-37 Themes |
| P2 — Nice to Have | F-13 Voice Search, F-16 Onboarding, F-17 Side Panel, F-19 Drag & Drop, F-26 Pomodoro, F-27 Habit Tracker, F-29 World Clock, F-31 Tab Workspace, F-32 Session Restore |
| P3 — Integrations | F-28 Stocks/Crypto, F-30 AI Search, F-33 Google Drive, F-34 GitHub, F-35 Notion/Todoist |
| Review | F-07 Gmail Badge, F-04 Frecency Engine, F-21 AI Panel |
| Drop | F-23 Search Promo (monetization not needed), F-18 App Store (Chrome apps deprecated) |
