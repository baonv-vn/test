const MINUTES_PER_HOUR = 60;
const MAX_HOUR = 23;
const MAX_MINUTE = 59;

export const toMinutes = (time: string): number => {
  const [hour, minute] = time.split(':').map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return 0;
  }
  return (
    Math.max(0, Math.min(MAX_HOUR, hour)) * MINUTES_PER_HOUR +
    Math.max(0, Math.min(MAX_MINUTE, minute))
  );
};

export const getNowMinutes = (timestamp = Date.now()): number => {
  const now = new Date(timestamp);
  return now.getHours() * 60 + now.getMinutes();
};

export const formatClock = (timestamp = Date.now()): string => {
  const now = new Date(timestamp);
  return now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

export const isTimeInRange = (nowMinutes: number, startTime: string, endTime: string): boolean => {
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);
  // Handle overnight ranges (e.g., 23:00 to 01:00 next day).
  if (end < start) {
    return nowMinutes >= start || nowMinutes < end;
  }
  return nowMinutes >= start && nowMinutes < end;
};

export const isValidTime = (time: string): boolean => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
