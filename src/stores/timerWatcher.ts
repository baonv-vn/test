type TimerWatcherOptions = {
  getEndsAt: () => number | undefined;
  onExpire: () => void;
  intervalMs?: number;
};

export const createTimerWatcher = ({
  getEndsAt,
  onExpire,
  intervalMs = 1000,
}: TimerWatcherOptions) => {
  let interval: ReturnType<typeof setInterval> | null = null;

  const stop = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  const tick = () => {
    const endsAt = getEndsAt();
    if (!endsAt) {
      stop();
      return;
    }
    if (Date.now() >= endsAt) {
      stop();
      onExpire();
    }
  };

  const start = () => {
    stop();
    const endsAt = getEndsAt();
    if (!endsAt) {
      return;
    }
    if (Date.now() >= endsAt) {
      onExpire();
      return;
    }
    interval = setInterval(tick, intervalMs);
  };

  return { start, stop };
};
