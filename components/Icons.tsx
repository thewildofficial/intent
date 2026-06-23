import React from 'react';
import Svg, { Path, Circle, Rect, G, Line, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '../constants/theme';

// ─────────────────────────────────────────────────────────────
// Custom SVG icon set — playful, Duolingo-style line icons
// All icons are 24x24 viewBox, stroke-based, rounded caps
// ─────────────────────────────────────────────────────────────

export interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// Helper: wraps children in an Svg with consistent props
function IconWrap({ size = 24, color = Colors.text, strokeWidth = 2, children }: IconProps & { children: React.ReactNode }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {children}
    </Svg>
  );
}

// Home — a simple house with a chimney
export function HomeIcon({ size = 24, color = Colors.text, strokeWidth = 2 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Path
        d="M3 12.5L12 4l9 8.5M5 11v9h14v-9"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconWrap>
  );
}

// Fire — streak icon with flames
export function FireIcon({ size = 24, color = Colors.flame, strokeWidth = 0 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Path
        d="M12 3C12 3 8.5 6 8.5 11C8.5 13.5 10 14.5 10 14.5C10 14.5 8.5 13.5 8.5 11C7 12 6 14 6 16C6 19.3 8.7 22 12 22C15.3 22 18 19.3 18 16C18 11 12 3 12 3Z"
        fill={color}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Path
        d="M12 11C12 11 10 13 10 15.5C10 17 11 18 12 18C13 18 14 17 14 15.5C14 13 12 11 12 11Z"
        fill={Colors.accent}
        stroke="none"
      />
    </IconWrap>
  );
}

// Clock — session timer
export function ClockIcon({ size = 24, color = Colors.text, strokeWidth = 2 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M12 7v5l3.5 2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </IconWrap>
  );
}

// Calendar — date picker
export function CalendarIcon({ size = 24, color = Colors.text, strokeWidth = 2 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Rect x="3.5" y="5" width="17" height="16" rx="3" stroke={color} strokeWidth={strokeWidth} />
      <Line x1="3.5" y1="9.5" x2="20.5" y2="9.5" stroke={color} strokeWidth={strokeWidth} />
      <Line x1="8" y1="3" x2="8" y2="6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="16" y1="3" x2="16" y2="6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Circle cx="8" cy="14" r="1.2" fill={color} />
      <Circle cx="12" cy="14" r="1.2" fill={color} />
      <Circle cx="16" cy="14" r="1.2" fill={color} />
    </IconWrap>
  );
}

// Review / chart — bar chart
export function ReviewIcon({ size = 24, color = Colors.text, strokeWidth = 2 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Line x1="4" y1="20" x2="20" y2="20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Rect x="5.5" y="13" width="3" height="6" rx="1" fill={color} />
      <Rect x="10.5" y="9" width="3" height="10" rx="1" fill={color} />
      <Rect x="15.5" y="6" width="3" height="13" rx="1" fill={color} />
    </IconWrap>
  );
}

// Settings — gear
export function SettingsIcon({ size = 24, color = Colors.text, strokeWidth = 2 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
      <Path
        d="M12 2v3M12 19v3M22 12h-3M5 12H2M19.07 4.93l-2.12 2.12M7.05 16.95l-2.12 2.12M19.07 19.07l-2.12-2.12M7.05 7.05L4.93 4.93"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </IconWrap>
  );
}

// Check / complete
export function CheckIcon({ size = 24, color = Colors.primary, strokeWidth = 3 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Circle cx="12" cy="12" r="9" fill={color} />
      <Path d="M8 12.5l2.5 2.5L16 9" stroke={Colors.white} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </IconWrap>
  );
}

// Plus / add
export function PlusIcon({ size = 24, color = Colors.text, strokeWidth = 2.5 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </IconWrap>
  );
}

// Arrow left
export function ArrowLeftIcon({ size = 24, color = Colors.text, strokeWidth = 2.5 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Path d="M15 5l-7 7 7 7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </IconWrap>
  );
}

// Arrow right
export function ArrowRightIcon({ size = 24, color = Colors.text, strokeWidth = 2.5 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Path d="M9 5l7 7-7 7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </IconWrap>
  );
}

// Target — the app's core icon
export function TargetIcon({ size = 24, color = Colors.primary, strokeWidth = 2 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth={strokeWidth} fill="none" />
      <Circle cx="12" cy="12" r="5.5" stroke={color} strokeWidth={strokeWidth} fill="none" />
      <Circle cx="12" cy="12" r="1.5" fill={color} />
    </IconWrap>
  );
}

// Trophy — achievement
export function TrophyIcon({ size = 24, color = Colors.accent, strokeWidth = 0 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Path
        d="M8 4h8v2h3v3c0 2.8-2.2 5-5 5h-1c0 1.5.5 3 1.5 3.5H15v2H9v-2h1.5c1-.5 1.5-2 1.5-3.5h-1C7.2 14 5 11.8 5 9V6h3V4Z"
        fill={color}
      />
      <Path d="M7 6.5C5.5 6.5 5 7.5 5 9M17 6.5C18.5 6.5 19 7.5 19 9" stroke={Colors.accentDark} strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />
    </IconWrap>
  );
}

// Pause
export function PauseIcon({ size = 24, color = Colors.text, strokeWidth = 0 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Rect x="7.5" y="5" width="3.5" height="14" rx="2" fill={color} />
      <Rect x="13" y="5" width="3.5" height="14" rx="2" fill={color} />
    </IconWrap>
  );
}

// Play
export function PlayIcon({ size = 24, color = Colors.text, strokeWidth = 0 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Path d="M7 5l12 7-12 7V5Z" fill={color} />
    </IconWrap>
  );
}

// Flag — finish
export function FlagIcon({ size = 24, color = Colors.error, strokeWidth = 0 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Path d="M6 3v18M6 4h11l-2 3.5L17 11H6V4Z" fill={color} stroke={color} strokeWidth={1} strokeLinejoin="round" />
    </IconWrap>
  );
}

// Heart — great mood
export function HeartIcon({ size = 24, color = Colors.moodGreat, strokeWidth = 0 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Path
        d="M12 21C12 21 4 15.5 4 9.5C4 6.5 6.5 4 9 4C10.5 4 11.5 5 12 6C12.5 5 13.5 4 15 4C17.5 4 20 6.5 20 9.5C20 15.5 12 21 12 21Z"
        fill={color}
      />
    </IconWrap>
  );
}

// Smile — good mood
export function SmileIcon({ size = 24, color = Colors.moodGood, strokeWidth = 2 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Circle cx="12" cy="12" r="9.5" fill={color} />
      <Circle cx="9" cy="10" r="1.2" fill={Colors.white} />
      <Circle cx="15" cy="10" r="1.2" fill={Colors.white} />
      <Path d="M8.5 14.5C8.5 14.5 10 17 12 17C14 17 15.5 14.5 15.5 14.5" stroke={Colors.white} strokeWidth={1.8} strokeLinecap="round" fill="none" />
    </IconWrap>
  );
}

// Meh — neutral mood
export function MehIcon({ size = 24, color = Colors.moodNeutral, strokeWidth = 2 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Circle cx="12" cy="12" r="9.5" fill={color} />
      <Circle cx="9" cy="10" r="1.2" fill={Colors.white} />
      <Circle cx="15" cy="10" r="1.2" fill={Colors.white} />
      <Line x1="8.5" y1="15.5" x2="15.5" y2="15.5" stroke={Colors.white} strokeWidth={1.8} strokeLinecap="round" />
    </IconWrap>
  );
}

// Tough — hard mood
export function ToughIcon({ size = 24, color = Colors.moodHard, strokeWidth = 2 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Circle cx="12" cy="12" r="9.5" fill={color} />
      <Path d="M7.5 9.5L10 10.5M16.5 9.5L14 10.5" stroke={Colors.white} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M9 15.5C9 15.5 10 14 12 14C14 14 15 15.5 15 15.5" stroke={Colors.white} strokeWidth={1.8} strokeLinecap="round" fill="none" />
    </IconWrap>
  );
}

// Download / export
export function DownloadIcon({ size = 24, color = Colors.text, strokeWidth = 2 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Path d="M12 3v12M8 11l4 4 4-4M4 19h16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </IconWrap>
  );
}

// Bell — notification
export function BellIcon({ size = 24, color = Colors.text, strokeWidth = 2 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Path
        d="M12 3C9 3 7 5 7 8v3l-2 3h14l-2-3V8C17 5 15 3 12 3Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Path d="M10 19c0 1 1 2 2 2s2-1 2-2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />
    </IconWrap>
  );
}

// Sparkle — decorative
export function SparkleIcon({ size = 24, color = Colors.accent, strokeWidth = 0 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Path
        d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
        fill={color}
      />
    </IconWrap>
  );
}

// Bolt — quick / energy
export function BoltIcon({ size = 24, color = Colors.accent, strokeWidth = 0 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Path d="M13 2L4 14h7l-1 8 9-12h-7l1-8Z" fill={color} stroke={color} strokeWidth={1} strokeLinejoin="round" />
    </IconWrap>
  );
}

// Lock
export function LockIcon({ size = 24, color = Colors.text, strokeWidth = 2 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Rect x="5" y="11" width="14" height="10" rx="3" stroke={color} strokeWidth={strokeWidth} fill="none" />
      <Path d="M8 11V8C8 5.8 9.8 4 12 4s4 1.8 4 4v3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />
    </IconWrap>
  );
}

// Pencil — edit
export function PencilIcon({ size = 24, color = Colors.text, strokeWidth = 2 }: IconProps) {
  return (
    <IconWrap size={size} color={color} strokeWidth={strokeWidth}>
      <Path d="M14.5 4.5L19.5 9.5L8 21H3v-5L14.5 4.5Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M12.5 6.5L17.5 11.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </IconWrap>
  );
}