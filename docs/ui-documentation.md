# UI Documentation — Legacy Extension (chatgpt-home-tab)

## Overview

The extension renders a single HTML page (`index.html`) that replaces Chrome's new tab.
All UI is self-contained: no popup, no side panel page (though a side panel spec exists).

---

## Page Layout

```
┌─────────────────────────────────────────────────────┐
│  LEFT TOOLBAR (vertical, left edge)                 │
│  ┌────┐                                             │
│  │info│  ← top section                              │
│  │revw│                                             │
│  │stng│                                             │
│  │swch│                                             │
│  ├────┤                                             │
│  │apps│  ← bottom section                           │
│  │bkma│                                             │
│  │notf│ [●] ← global badge                          │
│  │note│                                             │
│  │wthr│                                             │
│  │fcus│                                             │
│  │bgnd│                                             │
│  └────┘                                             │
│                                                     │
│         BACKGROUND IMAGE (full-page)                │
│                                                     │
│              ┌─────────────────┐                    │
│              │   SEARCH BAR    │  [🎙] [provider]   │
│              └─────────────────┘                    │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │  APP GRID  (apps-pages-list)                  │   │
│  │  [icon] [icon] [icon] [icon] [icon] ...       │   │
│  │  [icon] [icon] [icon] ...                     │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  [recently-closed-button]  [add-app-button: +]      │
│                                                     │
│  ┌─────────────────────────────────────────┐        │
│  │  FOCUS BAR (focus-today)                │        │
│  │  "TODAY" [checkbox] [text input] [✕]   │        │
│  └─────────────────────────────────────────┘        │
│                                                     │
│  WEATHER WIDGET (bottom-right)                      │
│  [temp] [conditions] [icon]                         │
└─────────────────────────────────────────────────────┘
```

---

## UI Zones

### Zone 1 — Left Toolbar (`#left-toolbar`)

Vertical sidebar fixed to the left edge of the page.

**Top section (`#left-toolbar-top`)**
| Element ID | Type | Action |
|---|---|---|
| `#info-button` | `<a>` | Extension info / about |
| `#review-button` | `<a>` | Rate extension link |
| `#settings-button` | `<a>` | Opens options panel |
| `#switches-button` | `<a>` | Quick toggles |

**Bottom section (`#left-toolbar-bottom`)**
| Element ID | Type | Action |
|---|---|---|
| `#apps-button` | `<a>` | Opens add-app panel |
| `#bookmarks-button` | `<a>` | Opens bookmarks panel |
| `#notifications-button` | `<a>` | Opens notifications panel |
| `#indicator-global` | `<div>` | Global unread count badge |
| `#qnotes-button` | `<a>` | Toggles quick notes |
| `#weather` (icon) | `<a>` | Toggles weather widget |
| `#focus-button` | `<a>` | Toggles focus mode |
| `#background-button` | `<a>` | Opens background panel |

All toolbar buttons use `.tbar-btn` class with `data-title` tooltip.

---

### Zone 2 — Search Bar

Positioned center-top on the page.

**Elements:**
| Element ID | Description |
|---|---|
| `#search` | Main search input |
| `#search-badge` | Provider logo/icon inside input |
| `#search-badge-img` | Provider image |
| `#search-provider-title` | Provider name text |
| `#voice-search-button` | Speech-to-text trigger |
| `#search-provider` | Provider selector dropdown |

**Behavior:**
- Typing triggers autocomplete suggestions
- Provider icon click opens provider selector
- Voice button opens speech recognition panel
- Enter key submits to active search provider URL

---

### Zone 3 — App Grid

Center of the page, below search.

**Elements:**
| Element ID | Description |
|---|---|
| `#apps-pages-list` | Container for all app grid items |
| `#apps-page` | Single page of apps |

**App Item Structure (per app):**
```html
<div class="test-item app-item" data-id="...">
  <img src="_favicon/..." />
  <div class="indicator" id="indicator-{appId}">...</div>
  <span class="title">App Name</span>
</div>
```

**Behavior:**
- Draggable via `js/draggable.js`
- Badges/indicators overlay the icon
- Click opens the app/URL in current tab

---

### Zone 4 — Focus Bar (`#focus-today`)

Horizontal bar near the top (hidden by default).

**Elements:**
| Element ID | Description |
|---|---|
| `#focus-today-title` | "TODAY" label |
| `#focus-today-checkbox` | Visual checkbox with circle + checkmark |
| `#focus-today-span` | User-entered focus text |
| `.delete` (within) | Clear/reset button (✕) |
| `#focus-today-help` | Hint text |

---

### Zone 5 — Weather Widget (`#weather`)

Bottom-right corner, compact display.

**Main widget elements:**
| Element ID | Description |
|---|---|
| `#weather` | Container (visible in toolbar, clickable) |
| Weather icon | SVG/img weather condition icon |
| Temperature | Current °C/°F |

**Expanded forecast panel (`#weather-forecast`)**
| Element ID | Description |
|---|---|
| `#weather-forecast-header` | Clickable city name header |
| `#weather-forecast-city` | City name input (editable) |
| `#weather-unit-option` | °C/°F toggle |
| `#weather-forecast-cond` | Conditions text |
| `#weather-forecast-data` | Multi-day forecast data |
| `#weather-autocomplete` | City autocomplete dropdown |
| `#weather-close` | Close button |
| `#weather-forecast-help` | Help/instruction text |

---

### Zone 6 — Panels (Slide-in Overlays)

Panels are separate HTML files loaded into iframes or injected into DOM.

| Panel | File | Trigger |
|---|---|---|
| Background | `panels/background/background_panel.html` | `#background-button` |
| Options/Settings | `panels/options/options_panel.html` | `#settings-button` |
| Add App | `panels/new_app/new_app_panel.html` | `#apps-button` |
| Speech | `panels/speech/speech_panel.html` | `#voice-search-button` |
| Bookmarks | `panels/bookmarks/bookmarks_panel.html` | `#bookmarks-button` |
| App Store | `panels/new_app/store/store.html` | From add-app panel |

All panels use `panels_anim.js` for slide-in/out animations.

---

### Zone 7 — Recently Closed Tabs

| Element ID | Description |
|---|---|
| `#recently-closed-button` | Trigger button |
| `#recently-closed-box` | Dropdown container (.frostable — frosted glass) |
| `#recently-closed-list` | List of recently closed tab items |
| `#recently-closed-clear-button` | Clear all button |

---

### Zone 8 — Quick Notes

Activated via `#qnotes-button`.

| Element ID | Description |
|---|---|
| `#qnote-text` | Contenteditable note area |

Notes are auto-saved to localStorage. Plain text only (paste is sanitized).

---

## CSS Architecture

| File | Purpose |
|---|---|
| `css/style.css` | Main layout and component styles (~1200+ lines) |
| `css/themes.css` | Dark/light and color theme overrides |
| `css/weather.css` | Weather widget specific styles |
| `css/widgets.css` | Notes, calendar, notifications widgets |
| `css/search_extra.css` | Search suggestions and autocomplete |
| `css/search_promo.css` | Search promo banner styles |

**CSS Patterns:**
- IDs for unique elements, classes for reusable components
- `.frostable` = frosted glass (blur + transparency)
- `.fit` = position absolute, 100% width/height (full overlay)
- `.tbar-btn` = toolbar button base style
- `.indicator` = notification badge overlay

---

## Overlay / Z-index Layers

From bottom to top:
1. Background image (z-index: 0)
2. App grid content
3. Search bar
4. Panels (slide-in, high z-index)
5. `#mouse-move-overlay` — captures mouse events globally
6. `#screenshot-overlay` — for screenshot/capture feature (commented out)

---

## Responsive / Adaptive Behavior

- Designed primarily for 1280×800+ desktop screens
- No explicit mobile breakpoints (extension context = desktop only)
- Background image always full-screen (`background-size: cover`)
- Toolbar is fixed-width vertical column

---

## Accessibility Gaps (Observations)

- Most interactive elements (`<a>` tags) lack `href` and `role` attributes
- No keyboard navigation documented for panels
- Focus mode checkbox is visual-only (no `<input type="checkbox">`)
- Weather close button has `aria-label="Close weather"` ✅ — rare exception
- No ARIA live regions for dynamic content (notifications, weather updates)

---

## Internal Pages

| Page | Purpose |
|---|---|
| `pages/offscreen.html` | MV3 localStorage proxy (invisible) |
| `pages/blank.html` | Blank page (exact purpose unclear) |
| `pages/questions.html` | Questions/survey (onboarding or settings) |
| `pages/search.html` | Dedicated search page |
| `pages/onboard/onboard.html` | First-run onboarding flow |
