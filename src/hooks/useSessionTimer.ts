import { useEffect, useRef, useState } from 'react';

type SessionTimerOptions = {
  endsAt?: number;
};

type SessionTimerState = {
  remainingSeconds: number;
};

export const useSessionTimer = ({ endsAt }: SessionTimerOptions): SessionTimerState => {
  const [now, setNow] = useState(() => Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!endsAt) {
      setNow(Date.now());
      return undefined;
    }

    const initialNow = Date.now();
    setNow(initialNow);
    if (initialNow >= endsAt) {
      return undefined;
    }

    intervalRef.current = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= endsAt && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [endsAt]);

  const remainingSeconds = endsAt
    ? Math.max(0, Math.ceil((endsAt - now) / 1000))
    : 0;

  return {
    remainingSeconds,
  };
};
