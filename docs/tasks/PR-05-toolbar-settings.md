# PR-05 — Toolbar + Settings + Focus Mode + Onboarding

## Scope

Fully functional left toolbar, settings panel, focus mode, and first-run onboarding.

## Tasks

### 1. LeftToolbar (functional) (`src/components/LeftToolbar/`)
- All buttons wired to open/close their respective panels via `ui.activePanel` store slice
- Buttons: Settings, Bookmarks, Notifications, Notes, Weather, Focus, Background, Apps
- Active panel button gets highlighted state
- `data-testid="toolbar-button-{name}"`

### 2. Settings panel (`src/features/settings/`)
- `SettingsPanel.tsx` — slide-in from left, full-height
- Sections (tabs or accordion):
  - **Appearance** — theme picker, background (links to background panel)
  - **Search** — default provider, open in new tab toggle
  - **Widgets** — enable/disable each widget (weather, notes, calendar, etc.)
  - **Integrations** — GitHub token, Todoist token, Notion token (empty fields, saved to storage)
  - **Privacy** — toggle history permission request button
- `data-testid="settings-panel"`

### 3. Focus mode (`src/features/search/FocusBar.tsx`)
- Toggle button in toolbar hides: app grid, widgets, toolbar bottom section
- Shows only: search bar + focus input
- Focus input: single line text, placeholder "What is your focus today?"
- Persists text to `chrome.storage.local` key `notes.focus`
- Daily reset: check date on load, clear if new day
- `data-testid="focus-bar"`, `data-testid="focus-input"`

### 4. UI store slice (src/store/slices/ui.ts`)
- `activePanel: string | null`
- `focusModeActive: boolean`
- `openPanel(name)`, `closePanel()`, `toggleFocusMode()`

### 5. Panel shell component (`src/components/Panel/Panel.tsx`)
- Reusable slide-in panel wrapper
- Props: `title`, `children`, `onClose`, `testId`
- Renders via `createPortal` to `#panel-root`
- Slide-in animation: CSS `transform: translateX(-100%)` → `translateX(0)`
- Click outside / Esc to close
- `data-testid={testId}`

### 6. Onboarding (`src/features/settings/Onboarding.tsx`)
- Shown once on first install via `chrome.runtime.onInstalled` reason `'install'`
- Stored flag: `settings.onboardingComplete: boolean`
- 3-step modal: Welcome → Choose theme → Choose search provider → Done
- Skip button on every step

## Acceptance Criteria

- [ ] Clicking Settings button opens settings panel
- [ ] All settings sections render without errors
- [ ] Changing theme in settings applies immediately to the page
- [ ] Changing search provider in settings is used on next search
- [ ] Focus mode toggle hides app grid and widgets
- [ ] Focus text persists across new tabs; clears the next day
- [ ] Esc key closes any open panel
- [ ] Click outside panel closes it
- [ ] Onboarding shown on first install only
- [ ] All toolbar buttons open their respective panel placeholders

## Out of Scope

- Actually implementing each settings section's feature (done in feature PRs)
- Integrations token validation (just store the value)

## Technical Notes

- `chrome.runtime.onInstalled` fires in the service worker, not the page
- SW must write `settings.onboardingComplete = false` on install; page reads it on load
- Panel `z-index` hierarchy: panel (100) > toolbar (50) > content (10)
- Focus mode state must survive page reload — store in `chrome.storage.local`, not only Zustand

## Test Requirements

- [ ] Unit: `ui` store slice — openPanel, closePanel, toggleFocusMode
- [ ] Unit: focus daily reset logic
- [ ] E2E: `tests/focus.spec.ts` — focus mode hides grid, text persists
- [ ] E2E: `tests/options.spec.ts` — settings panel opens, theme changes
- [ ] E2E: `tests/newtab.spec.ts` — onboarding shown on clean install
