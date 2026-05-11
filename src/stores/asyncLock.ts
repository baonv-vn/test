export const createAsyncLock = () => {
  const locks = new Set<string>();

  return async <T>(key: string, action: () => Promise<T> | T) => {
    if (locks.has(key)) {
      return undefined;
    }
    locks.add(key);
    try {
      return await action();
    } finally {
      locks.delete(key);
    }
  };
};
