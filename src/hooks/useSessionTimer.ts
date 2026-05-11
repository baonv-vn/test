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

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    runningRef.current = false;
    firedRef.current = false;

    if (!sessionId) {
      setRemainingSeconds(durationSeconds);
      return undefined;
    }

    setRemainingSeconds(durationSeconds);
    intervalRef.current = setInterval(() => {
      setRemainingSeconds((previous) => {
        if (previous <= 1) {
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
        return previous - 1;
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
