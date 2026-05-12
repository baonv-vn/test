export type ScheduleItemType = 'workout' | 'cooking' | 'study' | 'rest';

export type ScheduleItemStatus = 'pending' | 'active' | 'done';

export type ScheduleItem = {
  id: string;
  title: string;
  type: ScheduleItemType;
  startTime: string;
  endTime: string;
  status: ScheduleItemStatus;
  workoutId?: string;
  recipeId?: string;
};
