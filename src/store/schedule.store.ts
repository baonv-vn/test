import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultScheduleItems } from '../modules/timeline/defaultData';
import { getNowMinutes, isTimeInRange, toMinutes } from '../modules/timeline/time';
import type { ScheduleItem, ScheduleItemType } from '../modules/timeline/types';
import { createId } from '../utils/id';
import { appStorage } from './storage';

type ScheduleInput = {
  title: string;
  type: ScheduleItemType;
  startTime: string;
  endTime: string;
  workoutId?: string;
  recipeId?: string;
};

type ScheduleState = {
  items: ScheduleItem[];
  activeTask?: ScheduleItem;
  manualActiveId?: string;
  now: number;
  refreshByTime: (timestamp?: number) => void;
  startTask: (id: string) => void;
  markDone: (id: string) => void;
  addItem: (payload: ScheduleInput) => void;
  updateItem: (id: string, payload: ScheduleInput) => void;
  deleteItem: (id: string) => void;
};

const sortItems = (items: ScheduleItem[]): ScheduleItem[] =>
  [...items].sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));

const buildStatuses = (
  items: ScheduleItem[],
  now: number,
  manualActiveId?: string
): { items: ScheduleItem[]; activeTask?: ScheduleItem; manualActiveId?: string } => {
  const nowMinutes = getNowMinutes(now);
  const sorted = sortItems(items);
  const activeByTime = sorted.find(
    (item) => item.status !== 'done' && isTimeInRange(nowMinutes, item.startTime, item.endTime)
  );

  const manualStillValid = manualActiveId
    ? sorted.some((item) => item.id === manualActiveId && item.status !== 'done')
    : false;
  const resolvedManualActiveId = manualStillValid ? manualActiveId : undefined;
  const activeId = resolvedManualActiveId ?? activeByTime?.id;

  const nextItems = sorted.map((item) => {
    if (item.status === 'done') {
      return item;
    }
    return {
      ...item,
      status: item.id === activeId ? ('active' as const) : ('pending' as const),
    };
  });

  return {
    items: nextItems,
    activeTask: nextItems.find((item) => item.id === activeId),
    manualActiveId: resolvedManualActiveId,
  };
};

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      items: sortItems(defaultScheduleItems),
      activeTask: undefined,
      manualActiveId: undefined,
      now: Date.now(),
      refreshByTime: (timestamp = Date.now()) => {
        const next = buildStatuses(get().items, timestamp, get().manualActiveId);
        set({
          ...next,
          now: timestamp,
        });
      },
      startTask: (id) => {
        const timestamp = Date.now();
        const nextItems = get().items.map((item) => {
          if (item.id === id) {
            return { ...item, status: 'active' as const };
          }
          if (item.status === 'done') {
            return item;
          }
          return { ...item, status: 'pending' as const };
        });
        const next = buildStatuses(nextItems, timestamp, id);
        set({
          ...next,
          now: timestamp,
        });
      },
      markDone: (id) => {
        const timestamp = Date.now();
        const manualActiveId = get().manualActiveId;
        const nextManualActiveId = manualActiveId === id ? undefined : manualActiveId;
        const nextItems = get().items.map((item) =>
          item.id === id ? { ...item, status: 'done' as const } : item
        );
        const next = buildStatuses(nextItems, timestamp, nextManualActiveId);
        set({
          ...next,
          now: timestamp,
        });
      },
      addItem: (payload) => {
        const timestamp = Date.now();
        const nextItems = [
          ...get().items,
          {
            id: createId('s'),
            ...payload,
            status: 'pending' as const,
          },
        ];
        const next = buildStatuses(nextItems, timestamp, get().manualActiveId);
        set({
          ...next,
          now: timestamp,
        });
      },
      updateItem: (id, payload) => {
        const timestamp = Date.now();
        const manualActiveId = get().manualActiveId;
        const nextItems = get().items.map((item) =>
          item.id === id
            ? {
                ...item,
                ...payload,
                workoutId: payload.type === 'workout' ? payload.workoutId : undefined,
                recipeId: payload.type === 'cooking' ? payload.recipeId : undefined,
              }
            : item
        );
        const next = buildStatuses(nextItems, timestamp, manualActiveId);
        set({
          ...next,
          now: timestamp,
        });
      },
      deleteItem: (id) => {
        const timestamp = Date.now();
        const manualActiveId = get().manualActiveId;
        const nextManualActiveId = manualActiveId === id ? undefined : manualActiveId;
        const nextItems = get().items.filter((item) => item.id !== id);
        const next = buildStatuses(nextItems, timestamp, nextManualActiveId);
        set({
          ...next,
          now: timestamp,
        });
      },
    }),
    {
      name: 'daily-schedule-store',
      storage: appStorage,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.refreshByTime(Date.now());
        }
      },
    }
  )
);
