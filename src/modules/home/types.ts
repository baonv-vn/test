export type DayPeriod = 'Morning' | 'Noon' | 'Afternoon' | 'Evening';

export type ScheduleItem = {
  id: string;
  period: DayPeriod;
  time: string;
  type: 'workout' | 'cooking';
  title: string;
  linkedWorkoutId?: string;
  linkedRecipeId?: string;
};
