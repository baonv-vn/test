import { create } from 'zustand';
import type { DayPeriod, ScheduleItem } from '../modules/home/types';

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
  },
  {
    id: 'sch-2',
    period: 'Noon',
    time: '12:30',
    type: 'cooking',
    title: 'Lunch Meal Prep',
  },
  {
    id: 'sch-3',
    period: 'Evening',
    time: '19:00',
    type: 'cooking',
    title: 'Dinner Cooking Block',
  },
];

const createId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

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
