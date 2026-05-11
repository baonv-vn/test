import { useEffect, useRef, useState } from 'react';

type SessionTimerOptions = {
  sessionId?: string;
  durationSeconds: number;
  onComplete?: () => void;
};

type SessionTimerState = {
  remainingSeconds: number;
  isRunning: boolean;
};

export const useSessionTimer = ({
  sessionId,
  durationSeconds,
  onComplete,
}: SessionTimerOptions): SessionTimerState => {
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const runningRef = useRef(false);
  const firedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const durationRef = useRef(durationSeconds);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    durationRef.current = durationSeconds;
  }, [durationSeconds]);

  useEffect(() => {
    if (!sessionId) {
      setRemainingSeconds(durationSeconds);
    }
  }, [durationSeconds, sessionId]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    runningRef.current = false;
    firedRef.current = false;

    if (!sessionId) {
      setRemainingSeconds(durationRef.current);
      return undefined;
    }

    setRemainingSeconds(durationRef.current);
    intervalRef.current = setInterval(() => {
      setRemainingSeconds((previous) => {
        const next = previous - 1;
        if (next <= 0) {
          if (!firedRef.current) {
            firedRef.current = true;
            onCompleteRef.current?.();
          }
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          runningRef.current = false;
          return 0;
        }
        return next;
      });
    }, 1000);
    runningRef.current = true;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      runningRef.current = false;
    };
  }, [sessionId]);

  return {
    remainingSeconds,
    isRunning: runningRef.current,
  };
};
