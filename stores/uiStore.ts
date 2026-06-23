import { create } from 'zustand';

interface UIState {
  theme: 'light' | 'dark';
  reduceMotion: boolean;
  
  setTheme: (theme: 'light' | 'dark') => void;
  setReduceMotion: (reduce: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'light',
  reduceMotion: false,
  
  setTheme: (theme) => set({ theme }),
  setReduceMotion: (reduceMotion) => set({ reduceMotion }),
}));
