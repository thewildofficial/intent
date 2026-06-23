import React, { useState } from 'react';
import { Pressable, Text, View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Radii, Typography, Springs } from '../constants/theme';
import { darken } from '../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface DuoButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const VARIANT_COLORS: Record<ButtonVariant, { bg: string; shadow: string }> = {
  primary:   { bg: Colors.primary,     shadow: darken(Colors.primary, 0.15) },
  secondary: { bg: Colors.secondary,   shadow: darken(Colors.secondary, 0.15) },
  accent:    { bg: Colors.accent,      shadow: darken(Colors.accent, 0.15) },
  danger:    { bg: Colors.error,       shadow: darken(Colors.error, 0.15) },
  ghost:     { bg: 'transparent',      shadow: 'transparent' },
};

const SIZE_CONFIG: Record<ButtonSize, { paddingV: number; paddingH: number; fontSize: number }> = {
  sm: { paddingV: 10, paddingH: 20, fontSize: 14 },
  md: { paddingV: 16, paddingH: 32, fontSize: 16 },
  lg: { paddingV: 20, paddingH: 40, fontSize: 18 },
};

export function DuoButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon,
  style,
  textStyle,
}: DuoButtonProps) {
  const pressed = useSharedValue(0);
  const colors = VARIANT_COLORS[variant];
  const sz = SIZE_CONFIG[size];

  const animatedStyle = useAnimatedStyle(() => {
    const offsetY = pressed.value ? 2 : 0;
    return {
      transform: [{ translateY: offsetY }],
    };
  });

  // The bottom "3D edge" that shows when button is raised
  const edgeStyle = useAnimatedStyle(() => {
    return {
      opacity: pressed.value ? 0 : 1,
    };
  });

  const handlePressIn = () => {
    pressed.value = withSpring(1, Springs.press);
  };

  const handlePressOut = () => {
    pressed.value = withSpring(0, Springs.press);
  };

  const textColor = variant === 'accent' ? Colors.textDark : Colors.white;
  const isGhost = variant === 'ghost';

  return (
    <View style={[styles.wrapper, fullWidth && { width: '100%' }, style]}>
      {/* Bottom 3D edge — sits behind the button */}
      {!isGhost && (
        <Animated.View
          style={[
            styles.bottomEdge,
            {
              backgroundColor: disabled ? Colors.border : colors.shadow,
              borderRadius: Radii.md,
            },
            edgeStyle,
          ]}
        />
      )}
      <AnimatedPressable
        style={[
          styles.button,
          {
            backgroundColor: isGhost ? 'transparent' : (disabled ? Colors.border : colors.bg),
            borderWidth: isGhost ? 2 : 0,
            borderColor: disabled ? Colors.border : colors.bg,
            borderRadius: Radii.md,
            paddingVertical: sz.paddingV,
            paddingHorizontal: sz.paddingH,
          },
          animatedStyle,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        <View style={styles.content}>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
          <Text
            style={[
              { fontSize: sz.fontSize, fontWeight: '800', color: isGhost ? colors.bg : textColor },
              textStyle,
            ]}
          >
            {label}
          </Text>
        </View>
      </AnimatedPressable>
    </View>
  );
}

// ─── Duolingo-style card ──────────────────────────────────────
interface DuoCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
}

export function DuoCard({ children, style, elevated = false }: DuoCardProps) {
  return (
    <View
      style={[
        styles.card,
        elevated ? styles.cardElevated : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

// ─── Duolingo-style pill badge ─────────────────────────────────
interface DuoBadgeProps {
  label: string;
  color?: string;
  textColor?: string;
  icon?: React.ReactNode;
}

export function DuoBadge({ label, color = Colors.primary, textColor = Colors.white, icon }: DuoBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '20', borderColor: color }]}>
      {icon}
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

// ─── Streak fire display ──────────────────────────────────────
interface StreakBadgeProps {
  count: number;
  label: string;
  color?: string;
  icon: React.ReactNode;
}

export function StreakBadge({ count, label, color = Colors.primary, icon }: StreakBadgeProps) {
  return (
    <View style={styles.streakBadge}>
      <View style={[styles.streakIconWrap, { backgroundColor: color + '18' }]}>
        {icon}
      </View>
      <Text style={[styles.streakNumber, { color }]}>{count}</Text>
      <Text style={styles.streakLabel}>{label}</Text>
    </View>
  );
}

// ─── Section header ───────────────────────────────────────────
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, icon }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderLeft}>
        {icon && <View style={styles.sectionIcon}>{icon}</View>}
        <View>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
    </View>
  );
}

// ─── Empty state ──────────────────────────────────────────────
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconWrap}>{icon}</View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}
    </View>
  );
}

// ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  bottomEdge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrapper: {
    marginRight: 4,
  },
  // Card
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radii.lg,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    padding: 20,
  },
  cardElevated: {
    borderWidth: 0,
    shadowColor: '#00000012',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  // Badge
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    borderWidth: 2,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '800',
  },
  // Streak badge
  streakBadge: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    minWidth: 120,
  },
  streakIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  streakNumber: {
    fontSize: 40,
    fontWeight: '900',
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textLight,
    marginTop: 2,
  },
  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 4,
  },
});