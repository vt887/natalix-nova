import type { HabitDefinition } from '../../types/backup';

export interface HabitsSlice {
  habits: HabitDefinition[];
  completedTodayById: Record<string, boolean>;
}

export const habitsInitialState: HabitsSlice = {
  habits: [],
  completedTodayById: {},
};

