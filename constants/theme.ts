import { useUIStore } from '../stores/uiStore';

// ─────────────────────────────────────────────────────────────
// Intent — Duolingo-inspired Playful Design System
// Light + Dark mode support via Zustand-driven palette
// ─────────────────────────────────────────────────────────────

export interface ColorPalette {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  secondaryDark: string;
  accent: string;
  accentDark: string;

  success: string;
  warning: string;
  error: string;
  errorDark: string;

  flame: string;
  flameDark: string;

  background: string;
  surface: string;
  surfaceAlt: string;
  cardBg: string;

  text: string;
  textDark: string;
  textLight: string;
  textMuted: string;
  white: string;

  border: string;
  borderLight: string;

  moodGreat: string;
  moodGood: string;
  moodNeutral: string;
  moodHard: string;

  heat0: string;
  heat1: string;
  heat2: string;
  heat3: string;
  heat4: string;
}

// ─── Light palette ─────────────────────────────────────────────
const lightColors: ColorPalette = {
  primary: '#58CC02',
  primaryDark: '#4FA90E',
  primaryLight: '#89E219',
  secondary: '#1CB0F6',
  secondaryDark: '#1899D6',
  accent: '#FFD93D',
  accentDark: '#E6C100',

  success: '#58CC02',
  warning: '#FF9600',
  error: '#FF4B4B',
  errorDark: '#E04545',

  flame: '#FF6B35',
  flameDark: '#E55A2B',

  background: '#FFFFFF',
  surface: '#F7F7F7',
  surfaceAlt: '#F0F0F0',
  cardBg: '#FFFFFF',

  text: '#3C3C3C',
  textDark: '#1A1A1A',
  textLight: '#777777',
  textMuted: '#A0A0A0',
  white: '#FFFFFF',

  border: '#E5E5E5',
  borderLight: '#F0F0F0',

  moodGreat: '#58CC02',
  moodGood: '#1CB0F6',
  moodNeutral: '#FFD93D',
  moodHard: '#FF9600',

  heat0: '#E5E5E5',
  heat1: '#C7E5A0',
  heat2: '#A0D860',
  heat3: '#7AC02E',
  heat4: '#58CC02',
};

// ─── Dark palette ──────────────────────────────────────────────
const darkColors: ColorPalette = {
  primary: '#7AD830',
  primaryDark: '#58CC02',
  primaryLight: '#89E219',
  secondary: '#3BC4FF',
  secondaryDark: '#1CB0F6',
  accent: '#FFE04D',
  accentDark: '#FFD93D',

  success: '#7AD830',
  warning: '#FFB020',
  error: '#FF6B6B',
  errorDark: '#FF4B4B',

  flame: '#FF8855',
  flameDark: '#FF6B35',

  background: '#131F2B',
  surface: '#1B2A3A',
  surfaceAlt: '#243444',
  cardBg: '#1B2A3A',

  text: '#F0F4F8',
  textDark: '#FFFFFF',
  textLight: '#9DB2C8',
  textMuted: '#6B7F94',
  white: '#FFFFFF',

  border: '#2D4054',
  borderLight: '#243444',

  moodGreat: '#7AD830',
  moodGood: '#3BC4FF',
  moodNeutral: '#FFE04D',
  moodHard: '#FFB020',

  heat0: '#243444',
  heat1: '#2A4A22',
  heat2: '#3A6B2E',
  heat3: '#4F9038',
  heat4: '#7AD830',
};

// ─── Hook: returns the active color palette ─────────────────────
export function useColors(): ColorPalette {
  const themeMode = useUIStore((s) => s.themeMode);
  return themeMode === 'dark' ? darkColors : lightColors;
}

// Static fallback (for non-component contexts)
export const Colors = lightColors;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const Typography = {
  display: { fontSize: 48, fontWeight: '800' as const },
  displaySm: { fontSize: 36, fontWeight: '800' as const },
  title: { fontSize: 28, fontWeight: '800' as const },
  subtitle: { fontSize: 20, fontWeight: '700' as const },
  body: { fontSize: 16, fontWeight: '500' as const },
  bodyBold: { fontSize: 16, fontWeight: '700' as const },
  caption: { fontSize: 14, fontWeight: '500' as const },
  small: { fontSize: 12, fontWeight: '500' as const },
  label: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1.2 },
  hero: { fontSize: 64, fontWeight: '900' as const },
} as const;

export const Shadows = {
  button: {
    shadowColor: '#00000020',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  buttonPrimary: {
    shadowColor: '#4FA90E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  buttonSecondary: {
    shadowColor: '#1899D6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  card: {
    shadowColor: '#00000010',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardRaised: {
    shadowColor: '#00000018',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const Springs = {
  bouncy: { damping: 12, stiffness: 400 },
  snappy: { damping: 20, stiffness: 500 },
  gentle: { damping: 16, stiffness: 150 },
  press: { damping: 15, stiffness: 300 },
} as const;

export function darken(hex: string, amount = 0.12): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const factor = 1 - amount;
  const dr = Math.round(r * factor);
  const dg = Math.round(g * factor);
  const db = Math.round(b * factor);
  return `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;
}