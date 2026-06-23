import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import { useSessionStore } from '../stores/sessionStore';

export function useTimer() {
  const { isActive, isPaused, startEpochMs, totalPausedMs, duration } = useSessionStore();
  const [elapsedMs, setElapsedMs] = useState(0);

  useKeepAwake(isActive ? 'session-active' : undefined);

  useEffect(() => {
    if (!isActive || isPaused || !startEpochMs) {
      setElapsedMs(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startEpochMs - totalPausedMs;
      setElapsedMs(Math.max(0, elapsed));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused, startEpochMs, totalPausedMs]);

  // Recalculate when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && isActive && startEpochMs) {
        const elapsed = Date.now() - startEpochMs - totalPausedMs;
        setElapsedMs(Math.max(0, elapsed));
      }
    });

    return () => subscription.remove();
  }, [isActive, startEpochMs, totalPausedMs]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const remainingMs = useSessionStore.getState().duration * 60 * 1000 - elapsedMs;
  const isComplete = remainingMs <= 0;

  return {
    elapsedMs,
    remainingMs,
    isComplete,
    formattedElapsed: formatTime(elapsedMs),
    formattedRemaining: formatTime(Math.max(0, remainingMs)),
  };
}
