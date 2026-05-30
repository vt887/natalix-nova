# Tech Stack — Natalix Nova

## Runtime

| Layer | Technology | Version |
|---|---|---|
| Extension Platform | Chrome MV3 | manifest_version: 3 |
| Minimum Chrome | Chrome 120+ | Required for stable MV3 APIs |
| Target Browsers | Chrome, Edge (Chromium) | Edge supports Chrome extensions natively |

---

## Language

### TypeScript
- **Version:** 5.x (latest stable)
- **Mode:** `strict: true` — all strict checks enabled
- **Why:** Catches API contract mismatches at compile time, especially important for
  Chrome API callbacks and message passing types.

```json
// tsconfig.json key options
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true,
  "noImplicitReturns": true
}
```

---

## Build System

### Vite
- **Version:** 8.x
- **Plugin:** `@crxjs/vite-plugin` ^2.0.0-beta
- **Why:** Native MV3 support, HMR that reloads the extension automatically during
  development, code splitting, tree-shaking out of the box.

**Key Vite config points:**
- Entry points defined in `manifest.json` — crxjs handles chunking
- `public/` assets copied as-is (icons, backgrounds)
- Production build outputs to `dist/` — upload directly to Chrome Web Store

---

## UI Framework

### React
- **Version:** 19.x
- **Mode:** No class components — function components + hooks only
- **Why:** Component model fits the widget-based new tab architecture, mature ecosystem,
  concurrent features (Suspense, transitions) for async data loading.

**Key patterns used:**
- `React.lazy` + `Suspense` for panel code splitting
- `useEffect` with cleanup for `chrome.storage.onChanged` subscriptions
- `createPortal` for panels (rendered to `document.body`)
- No React Router — single-page app with panel state in Zustand

---

## State Management

### Zustand
- **Version:** 5.x
- **Why:** Minimal API surface, no Provider boilerplate, slice pattern scales well,
  easy to subscribe to individual slices without re-renders.

```typescript
// Example slice pattern
const useSettingsSlice = (set) => ({
  theme: 'auto' as ThemeMode,
  searchProvider: 'google',
  setTheme: (theme: ThemeMode) => set({ theme }),
})
```

**Not Redux:** Redux overhead is not justified for an extension with no server sync.
**Not Context API:** Context causes unnecessary re-renders across unrelated components.

---

## Styling

### CSS Modules + CSS Custom Properties
- **Why CSS Modules:** Scoped styles per component, no class name collisions,
  works natively with Vite, no runtime overhead.
- **Why Custom Properties:** Theme switching without JS class manipulation —
  change `:root[data-theme]` and all components update instantly.

**Not Tailwind:** Utility classes create verbose JSX and make the CSS architecture
harder to read when debugging in Chrome DevTools Extension panels.

```css
/* Component styles: Button.module.css */
.root { background: var(--color-surface); }

/* Global tokens: src/styles/tokens.css */
:root[data-theme="dark"] { --color-surface: rgba(255,255,255,0.08); }
```

---

## Storage

### `chrome.storage.local`
- **Why:** MV3-compliant, available in service worker and extension pages,
  persistent across browser restarts, supports `onChanged` events for reactivity.
- **Capacity:** Unlimited (extension declares `unlimitedStorage` permission)
- **Not localStorage:** Not available in service workers without an offscreen proxy
- **Not IndexedDB:** Overkill for this use case; `chrome.storage.local` is simpler
  and already handles concurrent reads/writes safely

---

## External HTTP

### Native `fetch`
- Available in MV3 service workers natively
- No axios or other HTTP library needed
- Wrapper in `src/services/http.ts` adds: timeout, retry on network error, JSON parsing

---

## Icons

### Lucide React
- **Version:** latest
- **Why:** Tree-shakeable SVG icons, consistent style, TypeScript-typed,
  matches a clean minimal UI aesthetic

---

## Testing

### Vitest (Unit & Integration)
- **Version:** 3.x
- **Why:** Vite-native, same config as build, fast, supports jsdom for DOM tests

### Playwright (E2E)
- **Version:** 1.x (already in legacy)
- **Why:** Only test framework with first-class Chrome Extension support
  (`--load-extension` + `extensionPage` fixture)
- E2E tests run against the built `dist/` — tests what users actually see

### Testing Library
- `@testing-library/react` for component unit tests
- `@testing-library/user-event` for interaction simulation

---

## Linting & Formatting

### ESLint
- **Version:** 9.x (flat config)
- **Plugins:** `@typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`

### Prettier (optional)
- Consistent formatting enforced in CI

---

## CI / Validation Pipeline

Every PR must pass all four gates before merge:

```bash
npm run lint        # ESLint (no errors, no warnings)
npm run typecheck   # tsc --noEmit (zero type errors)
npm run test        # Vitest unit + integration
npm run build       # Vite production build
npx playwright test # E2E against built dist/
```

---

## Package Summary

```json
{
  "dependencies": {
    "react": "^19",
    "react-dom": "^19",
    "zustand": "^5",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "@crxjs/vite-plugin": "^2.0.0-beta",
    "@eslint/js": "^9",
    "@playwright/test": "^1",
    "@testing-library/react": "^16",
    "@testing-library/user-event": "^14",
    "@types/chrome": "^0",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@typescript-eslint/eslint-plugin": "^8",
    "eslint": "^9",
    "typescript": "^5",
    "vite": "^8",
    "vitest": "^3"
  }
}
```
