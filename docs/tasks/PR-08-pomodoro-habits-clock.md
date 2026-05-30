# PR-08 — Pomodoro + Habits + World Clock

## Scope

Three productivity widgets: Pomodoro timer, Habit tracker, World Clock.
Each is independently toggleable in Settings.

---

## Pomodoro Timer (F-26)

### Tasks

#### 1. PomodoroWidget (`src/features/pomodoro/PomodoroWidget.tsx`)
- Displays: current mode (Work / Short Break / Long Break) + countdown MM:SS
- Controls: Start, Pause, Reset, Skip
- Session counter: "Session 3 of 4"
- After 4 work sessions → long break automatically
- `data-testid="pomodoro-widget"`

#### 2. Pomodoro store slice (`src/store/slices/pomodoro.ts`)
- `mode: 'work' | 'short-break' | 'long-break'`
- `status: 'idle' | 'running' | 'paused'`
- `remainingSeconds: number`
- `sessionCount: number`
- `settings: { workMin: 25, shortBreakMin: 5, longBreakMin: 15, sessionsBeforeLong: 4 }`
- Timer tick via `setInterval` when `status === 'running'`
- On session end: `chrome.notifications.create(...)` via SW message

#### 3. Timer persistence
- Persist `remainingSeconds`, `status`, `mode`, `sessionCount` to storage
- On page load: resume from stored state — running timer continues correctly

#### 4. Pomodoro settings
In Settings panel Widgets section: work/break duration inputs.

---

## Habit Tracker (F-27)

### Tasks

#### 1. HabitsWidget (`src/features/habits/HabitsWidget.tsx`)
- List of habits with checkbox + name + streak count
- "Add habit" inline input
- `data-testid="habits-widget"`, `data-testid="habit-item-{id}"`

#### 2. Habits store slice (`src/store/slices/habits.ts`)
Data model:
```typescript
interface Habit {
  id: string
  name: string
  streak: number
  lastCompletedDate: string  // YYYY-MM-DD
}
interface HabitsState {
  habits: Habit[]
  todayKey: string  // YYYY-MM-DD of today
  completedToday: string[]  // habit IDs completed today
}
```

Logic:
- On load: if `todayKey !== today` → reset `completedToday`, update streaks (streak++ if completed yesterday, else reset to 0)
- Toggle completion: add/remove from `completedToday`, update `lastCompletedDate`

#### 3. Streak calculation
- Streak increments if habit was completed on `lastCompletedDate = yesterday`
- Streak resets to 0 if `lastCompletedDate < yesterday` (missed a day)

---

## World Clock (F-29)

### Tasks

#### 1. WorldClock component (`src/features/worldclock/WorldClock.tsx`)
- Displays list of configured timezone clocks
- Each: city name + local time (HH:MM or H:MM AM/PM)
- Updates every second via `setInterval`
- `data-testid="world-clock"`

#### 2. World Clock settings
In Settings Widgets section: add/remove city-timezone pairs
- City name (free text) + timezone (IANA timezone string, e.g. `America/New_York`)
- Preset list of common cities with their timezones

#### 3. Time formatting
- Use `Intl.DateTimeFormat` with timezone option — no library needed
- 12h / 24h follows `settings.timeFormat`

#### 4. World Clock store slice
- `clocks: { city: string; timezone: string }[]`
- Default: user's local timezone only

## Acceptance Criteria

**Pomodoro:**
- [ ] Timer counts down correctly after Start
- [ ] Pause/Resume works
- [ ] Session cycles: 4× work → long break → repeat
- [ ] Chrome notification fired at session end
- [ ] Timer survives tab close/reopen (resumes from stored state)
- [ ] Settings: changing duration affects next session

**Habits:**
- [ ] Can add, remove, and toggle habits
- [ ] Streak increments on consecutive daily completion
- [ ] Streak resets on missed day
- [ ] Completion state resets at midnight (next day)

**World Clock:**
- [ ] Shows at least one clock (user's local timezone)
- [ ] Time updates every second
- [ ] Can add/remove clocks in settings
- [ ] Correct time for each timezone

## Out of Scope

- Pomodoro statistics / history charts
- Habit history beyond streak count
- World clock date display (time only)

## Technical Notes

- Pomodoro `setInterval` must be cleared on component unmount to avoid memory leaks
- Habits: daily reset check on every mount — use `new Date().toISOString().slice(0, 10)` for YYYY-MM-DD
- World Clock: `Intl.DateTimeFormat` is accurate and requires no external API
- All three widgets are conditionally rendered based on `settings.widgets.{name}.enabled`

## Test Requirements

- [ ] Unit: pomodoro state machine — transitions, session cycling, streak logic
- [ ] Unit: habit streak calculation — consecutive, missed, reset
- [ ] Unit: world clock timezone formatting
- [ ] E2E: `tests/pomodoro.spec.ts` — start, tick, pause, reset
- [ ] E2E: `tests/habits.spec.ts` — check habit, reload, verify persisted
