import { create } from 'zustand';
import type { DayPeriod, ScheduleItem } from '../modules/home/types';
import { createId } from '../utils/id';

type ScheduleState = {
  items: ScheduleItem[];
  addItem: (payload: Omit<ScheduleItem, 'id'>) => void;
  editItem: (id: string, payload: Omit<ScheduleItem, 'id'>) => void;
  deleteItem: (id: string) => void;
};

const initialItems: ScheduleItem[] = [
  {
    id: 'sch-1',
    period: 'Morning',
    time: '07:00',
    type: 'workout',
    title: 'Monday Pull Session',
    linkedWorkoutId: 'mon-pull',
  },
  {
    id: 'sch-2',
    period: 'Noon',
    time: '12:30',
    type: 'cooking',
    title: 'Lunch Meal Prep',
    linkedRecipeId: 'r2',
  },
  {
    id: 'sch-3',
    period: 'Evening',
    time: '19:00',
    type: 'cooking',
    title: 'Dinner Cooking Block',
    linkedRecipeId: 'r3',
  },
];

export const useScheduleStore = create<ScheduleState>((set) => ({
  items: initialItems,
  addItem: (payload) =>
    set((state) => ({
      items: [...state.items, { ...payload, id: createId('schedule') }],
    })),
  editItem: (id, payload) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, ...payload } : item)),
    })),
  deleteItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
}));
