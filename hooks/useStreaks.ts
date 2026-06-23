import { useEffect, useState, useCallback } from 'react';
import { recomputeStreaks, getStreak, getTodayDateString } from '../db/queries';

export interface StreakData {
  current: number;
  longest: number;
  isIntentionalToday: boolean;
}

export function useStreaks() {
  const [streak, setStreak] = useState<StreakData>({
    current: 0,
    longest: 0,
    isIntentionalToday: false,
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    await recomputeStreaks();
    const todayRow = await getStreak(getTodayDateString());
    setStreak({
      current: todayRow?.currentStreakCount ?? 0,
      longest: todayRow?.longestStreakCount ?? 0,
      isIntentionalToday: todayRow?.isIntentional ?? false,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...streak, loading, refresh };
}
