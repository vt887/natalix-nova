# PR-02 — New Tab Shell + Background + Themes

## Scope

Render the full page layout with background image and working theme system.
No features yet — placeholder zones for all widgets and panels.

## Tasks

### 0. Copy design assets from legacy (chatgpt-home-tab)
Before writing any React code — migrate all visual assets:
- Copy `css/*.css` → `src/styles/legacy/` (all 8 CSS files, see `docs/ui-design.md`)
- Copy `css/fonts/` → `public/fonts/`
- Copy `js/weather/condition_icons/svg_output/` → `public/icons/weather/`
- Copy `icons/` → `public/icons/`
- Copy `public/img/backgrounds/` → `public/img/backgrounds/`
- Import all legacy CSS files in `src/main.ts`:
  ```ts
  import './styles/legacy/style.css'
  import './styles/legacy/themes.css'
  import './styles/legacy/panels.css'
  import './styles/legacy/widgets.css'
  import './styles/legacy/weather.css'
  import './styles/legacy/search_extra.css'
  import './styles/legacy/recently_closed.css'
  import './styles/legacy/context_menu.css'
  ```
See `docs/ui-design.md` for the full design spec and measurements.

### 1. React entry point
- `index.html` — minimal HTML, loads `src/main.ts`
- `src/main.ts` — `createRoot(document.getElementById('root')).render(<App />)`

### 2. App shell layout (`src/App.tsx`)
Renders the structural skeleton:
```
<Background />
<LeftToolbar />       ← placeholder buttons, no actions yet
<SearchArea />        ← empty placeholder
<AppGridArea />       ← empty placeholder
<WidgetArea />        ← empty placeholder
<PanelContainer />    ← portal target, no panels yet
```

### 3. CSS layout
- Full-page background with `position: fixed; inset: 0`
- Left toolbar: fixed left column, `width: 52px`, full height
- Content area: `margin-left: 52px`, flex column
- All layout via CSS custom properties from tokens.css

### 4. Background feature (`src/features/background/`)
- `BackgroundPanel.tsx` — grid of preset background images + upload custom
- `useBackground.ts` — reads/writes `settings.background` from storage
- Background applied as CSS `background-image` on `<body>` or `<Background />`
- Preset backgrounds from `public/img/backgrounds/`
- Storage key: `settings.background` → `{ type: 'preset' | 'custom', url: string }`

### 5. Theme system (`src/features/settings/` + `src/hooks/useTheme.ts`)
- `useTheme.ts` — reads `settings.theme` from storage, applies `data-theme` to `<html>`
- Preset themes: `dark`, `light`, `midnight`, `solarized`
- CSS: `src/styles/themes/*.css` with custom property overrides

### 6. Auto dark/light (F-36)
- In `useTheme.ts`: when `settings.theme === 'auto'`, use `window.matchMedia('(prefers-color-scheme: dark)')`
- Add `change` listener — updates `data-theme` when OS theme changes without page reload

### 7. Settings store slice (`src/store/slices/settings.ts`)
- `theme: ThemeMode` (`'auto' | 'dark' | 'light' | 'midnight' | 'solarized'`)
- `background: BackgroundConfig`
- `setTheme(theme)`, `setBackground(bg)`
- On mount: load from `chrome.storage.local`, subscribe to `onChanged`

### 8. LeftToolbar placeholder
- `src/components/LeftToolbar/LeftToolbar.tsx`
- Renders icon buttons with `data-testid` attributes, no actions
- Tooltip on hover via CSS `::after` (no JS)

## Acceptance Criteria

- [ ] New tab page renders a background image (first preset by default)
- [ ] `data-theme="dark"` is set on `<html>` by default
- [ ] Background panel opens when background button is clicked (placeholder panel shell)
- [ ] Changing theme in storage (DevTools → Application → Storage) updates the page without reload
- [ ] Auto theme: matches OS dark/light setting; changes live when OS switches
- [ ] Left toolbar renders all icon placeholders with tooltips
- [ ] No layout overflow or scroll on a 1280×800 viewport
- [ ] `make lint && make typecheck && make build` all pass

## Out of Scope

- Any functional toolbar buttons (beyond background toggle)
- Search bar implementation
- App grid
- Any data fetching

## Technical Notes

- Use `React.StrictMode` in `main.ts` — catches double-effect bugs early
- `useTheme` must clean up the `matchMedia` listener on unmount
- Background image URL must not be inlined in JS — use `chrome.runtime.getURL('img/...')`
- Panel container: render a `<div id="panel-root">` in `index.html`, use `createPortal` in `<PanelContainer />`

## Test Requirements

- [ ] Unit: `useTheme.test.ts` — auto mode resolves correctly, listener attached/removed
- [ ] Unit: `useBackground.test.ts` — reads storage, falls back to first preset
- [ ] E2E: `tests/themes.spec.ts` — theme persists across tab open/close
- [ ] E2E: `tests/newtab.spec.ts` — background image visible, no console errors
