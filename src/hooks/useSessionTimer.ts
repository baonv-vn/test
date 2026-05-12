import { useEffect, useRef, useState } from 'react';

type SessionTimerOptions = {
  sessionId?: string;
  durationSeconds: number;
  onComplete?: () => void;
};

type SessionTimerState = {
  remainingSeconds: number;
};

export const useSessionTimer = ({
  sessionId,
  durationSeconds,
  onComplete,
}: SessionTimerOptions): SessionTimerState => {
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [sessionId]);

  return {
    remainingSeconds,
  };
};
