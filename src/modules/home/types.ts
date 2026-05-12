export type DayPeriod = 'Morning' | 'Noon' | 'Evening';

export type ScheduleItem = {
  id: string;
  period: DayPeriod;
  time: string;
  type: 'workout' | 'cooking';
  title: string;
};
