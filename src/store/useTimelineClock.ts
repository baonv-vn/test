import { useEffect } from 'react';
import { useScheduleStore } from './schedule.store';

const TIMELINE_REFRESH_INTERVAL_MS = 15000;

export const useTimelineClock = () => {
  useEffect(() => {
    useScheduleStore.getState().refreshByTime(Date.now());
    const interval = setInterval(() => {
      useScheduleStore.getState().refreshByTime(Date.now());
    }, TIMELINE_REFRESH_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, []);
};
