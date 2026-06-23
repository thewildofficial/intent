import { useUIStore } from '../stores/uiStore';

// ─────────────────────────────────────────────────────────────
// Intent — Original design system
// Light purple primary, rose gold accent, warm neutrals
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
  // Soft lavender purple — the app's signature
  primary: '#8B5CF6',
  primaryDark: '#7C3AED',
  primaryLight: '#A78BFA',

  // Rose gold — warm, elegant accent
  secondary: '#E8A098',
  secondaryDark: '#D4857A',

  // Rose gold deeper tone for accents/awards
  accent: '#D4A574',
  accentDark: '#B8860B',

  success: '#8B5CF6',
  warning: '#F59E0B',
  error: '#EF4444',
  errorDark: '#DC2626',

  // Warm flame for streaks
  flame: '#F97316',
  flameDark: '#EA580C',

  background: '#FAF8F5',
  surface: '#F3F0EB',
  surfaceAlt: '#ECE7DF',
  cardBg: '#FFFFFF',

  text: '#2D2A26',
  textDark: '#1A1A1A',
  textLight: '#8B8580',
  textMuted: '#B5AFA8',
  white: '#FFFFFF',

  border: '#E5E0D8',
  borderLight: '#EDE9E2',

  moodGreat: '#8B5CF6',
  moodGood: '#D4A574',
  moodNeutral: '#F59E0B',
  moodHard: '#EF4444',

  // Heat scale: warm cream → rose gold
  heat0: '#ECE7DF',
  heat1: '#F5DDD5',
  heat2: '#EDC6BA',
  heat3: '#E0A898',
  heat4: '#D4857A',
};

// ─── Dark palette ──────────────────────────────────────────────
const darkColors: ColorPalette = {
  // Slightly brighter purple for dark mode contrast
  primary: '#A78BFA',
  primaryDark: '#8B5CF6',
  primaryLight: '#C4B5FD',

  // Rose gold — warmer in dark
  secondary: '#F0A89E',
  secondaryDark: '#E8A098',

  accent: '#E0BC8A',
  accentDark: '#D4A574',

  success: '#A78BFA',
  warning: '#FBBF24',
  error: '#F87171',
  errorDark: '#EF4444',

  flame: '#FB923C',
  flameDark: '#F97316',

  // Deep warm charcoal — not pure black, warm undertone
  background: '#1A1720',
  surface: '#252130',
  surfaceAlt: '#322D3F',
  cardBg: '#252130',

  text: '#F0EDE8',
  textDark: '#FFFFFF',
  textLight: '#A8A29E',
  textMuted: '#6B6760',
  white: '#FFFFFF',

  border: '#3F3A4D',
  borderLight: '#322D3F',

  moodGreat: '#A78BFA',
  moodGood: '#E0BC8A',
  moodNeutral: '#FBBF24',
  moodHard: '#F87171',

  // Heat scale: muted purple → bright rose gold
  heat0: '#322D3F',
  heat1: '#4A3D52',
  heat2: '#5D4555',
  heat3: '#7D5560',
  heat4: '#B07060',
};

// ─── Hook: returns the active color palette ─────────────────────
export function useColors(): ColorPalette {
  const themeMode = useUIStore((s) => s.themeMode);
  return themeMode === 'dark' ? darkColors : lightColors;
}

// Static fallback (for non-component contexts)
export const Colors = lightColors;

export { lightColors, darkColors };

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
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  buttonSecondary: {
    shadowColor: '#D4857A',
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