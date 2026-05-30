# PR-06 — Weather Widget

## Scope

Weather widget with current conditions, multi-day forecast, city search, and geolocation.

## Tasks

### 1. Service Worker handler (`src/background/handlers/weather.ts`)
- Message: `{ name: 'weather.fetch', payload: { lat, lon } }`
- Fetches from Open-Meteo: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`
- Cache result in `chrome.storage.local` key `weather.data` with TTL 30 min
- Returns cached data if within TTL without re-fetching
- Error response: `{ error: 'network' | 'api' }`

### 2. Geolocation handler (`src/background/handlers/geolocation.ts`)
- Message: `{ name: 'geo.fetch' }`
- Uses `self.navigator.geolocation.getCurrentPosition()` — available in extension pages, not SW
- **Correction:** geolocation must be called from the new tab page, not SW
- `useWeather.ts` calls `navigator.geolocation.getCurrentPosition()` directly
- On success: sends `weather.fetch` message with coords
- On failure: falls back to stored city coords or shows city input

### 3. WeatherWidget component (`src/features/weather/WeatherWidget.tsx`)
- Compact display in toolbar area: temperature + weather icon
- Click → opens `WeatherForecast` panel
- `data-testid="weather-widget"`

### 4. WeatherForecast panel (`src/features/weather/WeatherForecast.tsx`)
- Full forecast panel (slide-in or modal)
- Current: large temp, condition text, wind speed
- 7-day forecast: day name + icon + min/max temp
- °C / °F toggle (conversion client-side, no re-fetch)
- City search at top: `CitySearch.tsx`
- `data-testid="weather-forecast-panel"`

### 5. City search (`src/features/weather/CitySearch.tsx`)
- Input with debounced fetch to Open-Meteo Geocoding API:
  `https://geocoding-api.open-meteo.com/v1/search?name={query}&count=5&language=en`
- Autocomplete dropdown with city name + country
- Click → stores `{ name, lat, lon }` in `weather.city` storage key
- `data-testid="city-search-input"`

### 6. Weather conditions mapping (`src/features/weather/conditions.ts`)
Map WMO weather codes to:
- Description text ("Clear sky", "Partly cloudy", "Heavy rain", etc.)
- Icon name (lucide-react or custom SVG set)

### 7. Background integration
- When weather loads, update `weather.condition` in storage
- `useBackground.ts` reads `weather.condition` if background mode is `'weather'`
- Mapping: clear → bright photo, rain → gray/dark, snow → winter, storm → dark

### 8. Weather store slice (`src/store/slices/weather.ts`)
- `data: WeatherData | null`
- `city: CityConfig | null`
- `unit: 'celsius' | 'fahrenheit'`
- `status: 'idle' | 'loading' | 'success' | 'error'`

### 9. useWeather hook (`src/features/weather/useWeather.ts`)
- On mount: check stored city → send `weather.fetch` message
- If no stored city: request geolocation → on success send `weather.fetch`
- Poll every 30 min via `setInterval` (aligned with SW cache TTL)

## Acceptance Criteria

- [ ] Weather widget shows current temperature in toolbar area on load
- [ ] Clicking widget opens forecast panel with 7-day data
- [ ] °C/°F toggle works without re-fetch
- [ ] City search autocomplete shows results as user types
- [ ] Selecting a city updates weather data
- [ ] Geolocation auto-detects city on first load (when permission granted)
- [ ] Weather data cached — opening 5 new tabs in 1 min makes only 1 API call
- [ ] Error state shown if network fails (no crash)

## Out of Scope

- Weather-based notifications
- Hourly forecast
- Weather sounds

## Technical Notes

- Open-Meteo is free, no API key — do not add any key management for it
- WMO code reference: https://open-meteo.com/en/docs (codes 0–99)
- °C to °F: `(c * 9/5) + 32` — convert in component, not in stored data
- Cache key: `weather.data`, `weather.cachedAt` (timestamp ms)

## Test Requirements

- [ ] Unit: `conditions.ts` — every WMO code maps to a description + icon
- [ ] Unit: `useWeather.ts` — uses cache, doesn't re-fetch within TTL
- [ ] Unit: °C/°F conversion
- [ ] E2E: `tests/weather.spec.ts`
  - Widget renders (mock geolocation via `context.setGeolocation`)
  - Forecast panel opens
  - City search returns results (intercept Open-Meteo call)
  - Unit toggle switches between °C and °F
