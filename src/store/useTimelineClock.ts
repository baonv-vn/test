import { useEffect } from 'react';
import { useScheduleStore } from './schedule.store';

export const useTimelineClock = () => {
  useEffect(() => {
    useScheduleStore.getState().refreshByTime(Date.now());
    const interval = setInterval(() => {
      useScheduleStore.getState().refreshByTime(Date.now());
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, []);
};
