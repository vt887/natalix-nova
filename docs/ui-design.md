# UI Design — Natalix Nova

## Design Intent

The visual design of the legacy extension (`chatgpt-home-tab`) is **preserved as-is** in natalix-nova.
Codex must replicate the exact visual style — colors, spacing, effects, typography — not invent a new one.

---

## Asset Migration

The following directories must be **copied verbatim** from `chatgpt-home-tab/` to `natalix-nova/`:

| Source | Destination | Contents |
|---|---|---|
| `css/` | `src/styles/legacy/` | All CSS files (see below) |
| `css/fonts/` | `public/fonts/` | Meteocons weather font |
| `js/weather/condition_icons/svg_output/` | `public/icons/weather/` | Weather condition SVGs |
| `icons/` | `public/icons/` | App, toolbar, search, weather icons |
| `public/img/backgrounds/` | `public/img/backgrounds/` | Preset background images |

### CSS Files to Copy

| File | Lines | Purpose |
|---|---|---|
| `css/style.css` | 2130 | Main layout, app grid, toolbar, search bar, focus mode |
| `css/themes.css` | 170 | CSS custom property theme definitions |
| `css/panels.css` | 280 | Frosted glass panel styles |
| `css/widgets.css` | 820 | Notes, calendar, notifications widgets |
| `css/weather.css` | 299 | Weather widget and forecast panel |
| `css/search_extra.css` | 339 | Autocomplete suggestions dropdown |
| `css/recently_closed.css` | 123 | Recently closed tabs box |
| `css/context_menu.css` | 93 | Right-click context menu |

**Strategy:** Copy these files as-is into `src/styles/legacy/`. Import them in `src/main.ts`.
Do not rewrite them in CSS Modules. New feature styles (PR-08+) use CSS Modules alongside legacy CSS.

---

## Themes

The extension uses `data-theme` attribute on `:root` for theme switching.
Five themes are defined in `css/themes.css`:

### 1. `neon-cyber-glass` (default dark)
```
Background:    #050e18 (primary) / #091525 (secondary)
Panel:         rgba(8, 24, 40, 0.82) / rgba(10, 30, 50, 0.92)
Text:          #e8f4ff (primary) / #a0c4e0 (secondary)
Accent:        #22d3ee (primary) / #14b8a6 (secondary) / #38bdf8 (tertiary)
Border soft:   rgba(34, 211, 238, 0.24)
Border strong: rgba(20, 184, 166, 0.48)
Shadow soft:   0 12px 32px rgba(20, 184, 166, 0.18)
Shadow strong: 0 18px 48px rgba(34, 211, 238, 0.28)
Input bg:      rgba(11, 39, 51, 0.82)
Input border:  rgba(20, 184, 166, 0.32)
Overlay soft:  rgba(6, 25, 35, 0.38)
Overlay strong: rgba(6, 25, 35, 0.62)
color-scheme:  dark
```

### 2. `graphite-minimal` (dark neutral)
```
Background:    #111214 (primary) / #18191d (secondary)
Text:          #e8e8ec (primary) / #9b9baa (secondary)
Accent:        #818cf8 (primary) / #6366f1 / #a78bfa
color-scheme:  dark
```

### 3. `ocean-calm` (dark teal)
```
Background:    #041520 (primary) / #061c2c (secondary)
Text:          #dff5f5 (primary) / #8ecfcf (secondary)
Accent:        #2dd4bf (primary) / #0ea5e9 / #67e8f9
color-scheme:  dark
```

### 4. `solar-warm` (dark amber)
```
Background:    #1a120b (primary) / #24170f (secondary)
Text:          #fff7ed (primary) / #e7c9a9 (secondary)
Accent:        #f59e0b (primary) / #fb923c / #fcd34d
color-scheme:  dark
```

### 5. `light-frost` (light)
```
Background:    #f4f7fb (primary) / #eaeef5 (secondary)
Text:          #1a1f2e (primary) / #4a5568 (secondary)
Accent:        #6366f1 (primary) / #8b5cf6 / #06b6d4
color-scheme:  light
```

### CSS Custom Property Names (full token set)
```css
:root[data-theme="..."] {
  --theme-name: "...";

  /* Backgrounds */
  --color-bg-primary
  --color-bg-secondary

  /* Panels / surfaces */
  --color-panel          /* panel background, semi-transparent */
  --color-panel-strong   /* stronger variant */

  /* Text */
  --color-text-primary
  --color-text-secondary

  /* Accents */
  --color-accent-primary
  --color-accent-secondary
  --color-accent-tertiary

  /* Borders */
  --color-border-soft
  --color-border-strong

  /* Shadows */
  --shadow-soft
  --shadow-strong

  /* Links */
  --color-link           /* = var(--color-accent-primary) */

  /* Inputs */
  --color-input-bg
  --color-input-border

  /* Buttons */
  --color-button-text

  /* Overlays */
  --color-overlay-soft
  --color-overlay-strong

  /* Scrollbar */
  --color-scrollbar

  /* Color scheme (light/dark) */
  color-scheme: dark | light;
}
```

---

## Typography

### Font Stack
```css
body, input, button, select, textarea {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans",
    "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

### Secondary (time display)
```css
.old-font {
  font-family: 'HelveticaNeueLTCom-Thin', 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, sans-serif;
  font-weight: 200;
}
```

### Mac-specific
```css
html.mac > body {
  letter-spacing: -0.022em;
}
```

---

## Layout & Measurements

### Left Toolbar
```css
#left-toolbar {
  width: 52px;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
}
#left-toolbar-top > a { margin-top: 12px; left: 15px; }
#left-toolbar-bottom { width: 52px; bottom: 6px; position: absolute; }
#left-toolbar-bottom > #focus-button { margin-bottom: 6px; margin-top: 16px; }
```

### Toolbar Buttons
```css
.tbar-btn {
  width: 40px;   /* .btn-40 */
  height: 40px;
  border-radius: 100%;
  /* CSS ::after tooltip via data-title attribute */
}
```

### App Grid
```css
:root {
  --item-size: 128px;
  --item-img-size: 80%;
  --item-font-size: 16px;
}
.test-item {
  width: var(--item-size);
  height: var(--item-size);
  margin: 10px;
  border-radius: 5px;
  transition: background-color .15s, transform .15s ease-out;
}
.test-item img {
  width: var(--item-img-size);
  height: var(--item-img-size);
}
.test-item .title {
  font-size: var(--item-font-size);
  text-shadow: 0 0 3px rgba(0,0,0,.2), 0 3px 4px rgba(0,0,0,.1);
}
```

### Search Bar
```css
#search-box {
  width: 65%;
  max-width: 880px;
  margin: 0 auto;
  top: 10px;
  z-index: 50;
}
#search-box input {
  font-size: 17px;
  height: 34px;
  line-height: 34px;
  padding: 2px 75px 2px 9px;
  border-radius: 2px;
  background: transparent;
  border: 0;
}
#search-input-bg {
  /* semi-transparent white background behind input */
  background: rgba(255,255,255,0.88);  /* light mode */
  background: rgba(0,0,0,0.5);          /* over dark backgrounds */
  border-radius: 4px;
}
```

### Options / Settings Panel
```css
#options-wrapper {
  position: fixed;
  left: 50%;
  top: 20px;
  bottom: 20px;
  width: 470px;
  transform: translateX(-50%);
  z-index: 100;
  box-shadow: 0 0 30px rgba(0,0,0,.35);
}
```

---

## Visual Effects

### Frosted Glass (`.frostable`)
Used on panels, dropdowns, widgets overlaid on background images.
```css
/* Light frosted (panels) */
backdrop-filter: blur(16px) saturate(0.6);

/* Heavy frosted (widgets, boxes) */
backdrop-filter: blur(40px) saturate(2.0);

/* Weather / forecast */
backdrop-filter: saturate(4) contrast(.4) blur(10px) sepia(.3);
```

### `.fit` — Full overlay helper
```css
.fit {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100%; height: 100%;
}
```

### Text shadows (for legibility over background images)
```css
/* App titles and main content */
text-shadow: 0 0 3px rgba(0,0,0,.2), 0 3px 4px rgba(0,0,0,.1);

/* Time / clock */
text-shadow: 0 0 40px rgba(0,0,0,.7);

/* Search input area */
/* No text-shadow — input has its own bg */
```

### Night Theme (old modifier, keep for compat)
```css
html.night-theme {
  filter: saturate(70%) contrast(90%) brightness(90%);
}
```

### Transitions
```css
/* Standard interactive transition */
transition: background-color .15s, transform .15s ease-out;

/* Color / border transitions */
transition: color .5s, border .5s;

/* Opacity fade */
transition: opacity .2s ease;

/* Panel slide */
transition: left .2s ease-in-out, right .2s ease-in-out;
```

---

## Class Naming Conventions (legacy, must match)

| Class / ID | Use |
|---|---|
| `.test-item` | App grid item (keep this name — used in E2E specs) |
| `.frostable` | Frosted glass surface |
| `.fit` | Absolute full-cover overlay |
| `.tbar-btn` | Toolbar button |
| `.btn-40` | 40×40 circle button |
| `.floating.box` | Widget container (frosted) |
| `.old-font` | Thin Helvetica font for time display |
| `.indicator` | Unread badge overlay on app icons |
| `html.focus` | Focus mode active (class on `<html>`) |
| `html.show-search` | Search bar visible |
| `html.mac` | Mac-specific font tuning |
| `html.night-theme` | Legacy night mode |
| `html.frosted-theme` | Heavy frosted glass mode |
| `.show-search-logo` | Show provider logo in search |

---

## Weather Icons

Custom SVG icon set in `js/weather/condition_icons/svg_output/`.
Copy to `public/icons/weather/` and reference by WMO condition code.

Key icons available:
`clear-n`, `partly-cloudy`, `partly-cloudy-d`, `mostly-cloudy-d`,
`rain`, `drizzle`, `snow`, `snow-flurries`, `snow-showers`, `light-snow-showers`,
`blowing-snow`, `sleet`, `rain-and-sleet`, `rain-and-hail`,
`thunderstorms`, `severe-thunderstorms`, `scattered-thunderstorms-n`, `isolated-thunderstorms`,
`tornado`, `hurricane`, `windy`, `haze`, `smoky`, `dust`,
`precip_0` through `precip_100` (probability icons)

Weather font: `css/fonts/meteocons-webfont.*` (custom icon font for weather symbols)

---

## Backgrounds

Preset background images are in `public/img/backgrounds/` (numbered JPEGs).
The legacy manifest uses `public/img/backgrounds/21.jpg` as the extension icon — keep this.

---

## What Codex Must NOT Change

1. The color values in `css/themes.css` — copy as-is
2. The `--item-size: 128px` app grid sizing
3. The `.test-item` class name — E2E tests rely on it
4. The `data-theme` attribute approach for theme switching
5. The `html.focus`, `html.show-search` class-on-html pattern
6. The `.frostable` / `backdrop-filter` glass effect values
7. The toolbar width of 52px
8. The search bar `width: 65%; max-width: 880px` proportions

---

## What Is New (natalix-nova additions)

New widgets (Pomodoro, Habits, World Clock, Stocks, AI Panel, etc.) should follow
the same visual language:
- Use `var(--color-panel)` for widget backgrounds
- Use `backdrop-filter: blur(40px) saturate(2.0)` for frosted glass
- Use `var(--color-accent-primary)` for highlights
- Use `var(--color-text-primary)` / `var(--color-text-secondary)` for text
- Use `.floating.box` class pattern for widget containers
- Use `var(--shadow-soft)` for elevation
- Transitions: `0.15s ease-out` for interactions
