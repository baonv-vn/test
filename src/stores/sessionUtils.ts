export type TimerSnapshot = {
  startedAt: number;
  endsAt: number;
  durationSeconds: number;
};

export const createSessionId = (prefix: string) => `${prefix}-${Date.now()}`;

export const createTimerSnapshot = (durationSeconds: number): TimerSnapshot => {
  const startedAt = Date.now();
  return {
    startedAt,
    endsAt: startedAt + durationSeconds * 1000,
    durationSeconds,
  };
};
