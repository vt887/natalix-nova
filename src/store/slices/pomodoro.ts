export interface PomodoroSlice {
  mode: 'focus' | 'break';
  remainingSeconds: number;
  status: 'idle' | 'running' | 'paused';
}

export const pomodoroInitialState: PomodoroSlice = {
  mode: 'focus',
  remainingSeconds: 25 * 60,
  status: 'idle',
};

