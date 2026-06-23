// ─────────────────────────────────────────────────────────────
// Intent — Duolingo-inspired Playful Design System
// ─────────────────────────────────────────────────────────────

// Core palette: vibrant, saturated, joyful — like Duolingo
export const Colors = {
  // Brand
  primary: '#58CC02',        // Duolingo green
  primaryDark: '#4FA90E',     // pressed state
  primaryLight: '#89E219',    // light accent
  secondary: '#1CB0F6',      // Duolingo blue
  secondaryDark: '#1899D6',
  accent: '#FFD93D',          // warm yellow (XP, achievements)
  accentDark: '#E6C100',

  // Semantic
  success: '#58CC02',
  warning: '#FF9600',
  error: '#FF4B4B',
  errorDark: '#E04545',

  // Streak / fire
  flame: '#FF6B35',
  flameDark: '#E55A2B',

  // Backgrounds
  background: '#FFFFFF',
  surface: '#F7F7F7',
  surfaceAlt: '#F0F0F0',
  cardBg: '#FFFFFF',

  // Text
  text: '#3C3C3C',
  textDark: '#1A1A1A',
  textLight: '#777777',
  textMuted: '#A0A0A0',
  white: '#FFFFFF',

  // Borders & dividers
  border: '#E5E5E5',
  borderLight: '#F0F0F0',

  // Mood colors
  moodGreat: '#58CC02',
  moodGood: '#1CB0F6',
  moodNeutral: '#FFD93D',
  moodHard: '#FF9600',

  // Heatmap intensity (0 = none, 4 = max)
  heat0: '#E5E5E5',
  heat1: '#C7E5A0',
  heat2: '#A0D860',
  heat3: '#7AC02E',
  heat4: '#58CC02',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

// Duolingo uses bold, rounded typography
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

// Duolingo-style 3D button shadows (bottom-edge offset, no blur)
export const Shadows = {
  // 3D bottom shadow: translateY creates the "thickness"
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

// Duolingo-style rounded corners
export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

// Animation spring configs matching Duolingo's bouncy feel
export const Springs = {
  bouncy: { damping: 12, stiffness: 400 },
  snappy: { damping: 20, stiffness: 500 },
  gentle: { damping: 16, stiffness: 150 },
  press: { damping: 15, stiffness: 300 },
} as const;

// Helper: get a color N steps darker (for 3D button bottom edge)
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