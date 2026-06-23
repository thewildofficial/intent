import { create } from 'zustand';

interface SessionState {
  intent: string;
  duration: number; // minutes
  startEpochMs: number | null;
  isActive: boolean;
  isPaused: boolean;
  pausedAt: number | null;
  totalPausedMs: number;
  
  setIntent: (intent: string) => void;
  setDuration: (duration: number) => void;
  startSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  finishSession: () => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  intent: '',
  duration: 0,
  startEpochMs: null,
  isActive: false,
  isPaused: false,
  pausedAt: null,
  totalPausedMs: 0,
  
  setIntent: (intent) => set({ intent }),
  setDuration: (duration) => set({ duration }),
  startSession: () => set({
    startEpochMs: Date.now(),
    isActive: true,
    isPaused: false,
    pausedAt: null,
    totalPausedMs: 0,
  }),
  pauseSession: () => set({
    isPaused: true,
    pausedAt: Date.now(),
  }),
  resumeSession: () => {
    const state = get();
    if (state.pausedAt) {
      const pauseDuration = Date.now() - state.pausedAt;
      set({
        isPaused: false,
        pausedAt: null,
        totalPausedMs: state.totalPausedMs + pauseDuration,
      });
    }
  },
  finishSession: () => set({ isActive: false }),
  reset: () => set({
    intent: '',
    duration: 0,
    startEpochMs: null,
    isActive: false,
    isPaused: false,
    pausedAt: null,
    totalPausedMs: 0,
  }),
}));
