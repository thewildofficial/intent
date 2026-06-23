import { create } from 'zustand';

type ThemeMode = 'light' | 'dark';

interface UIState {
  themeMode: ThemeMode;
  reduceMotion: boolean;

  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  setReduceMotion: (reduce: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  themeMode: 'dark',
  reduceMotion: false,

  setThemeMode: (themeMode) => set({ themeMode }),
  toggleTheme: () =>
    set((state) => ({
      themeMode: state.themeMode === 'light' ? 'dark' : 'light',
    })),
  setReduceMotion: (reduceMotion) => set({ reduceMotion }),
}));