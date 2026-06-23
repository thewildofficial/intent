import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  interpolate,
  useReducedMotion,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { Colors, Spacing, Typography, Radii } from '../../constants/theme';
import { useStreaks } from '../../hooks/useStreaks';
import { startSession as startSessionHaptic } from '../../utils/haptics';
import { FireIcon, TrophyIcon, TargetIcon, SparkleIcon, BoltIcon } from '../../components/Icons';
import { DuoButton, StreakBadge, DuoCard } from '../../components/DuoButton';

const AnimatedPressable = Animated.createAnimatedComponent(Animated.View);

export default function HomeScreen() {
  const router = useRouter();
  const { current, longest, isIntentionalToday, loading } = useStreaks();
  const reduceMotion = useReducedMotion();

  // Pulse animation for the start button glow
  const pulse = useSharedValue(0);
  const scale = useSharedValue(1);
  const bounceY = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    pulse.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);
    bounceY.value = withRepeat(withSpring(-6, { damping: 12, stiffness: 200 }), -1, true);
  }, [reduceMotion]);

  const glowStyle = useAnimatedStyle(() => {
    if (reduceMotion) return {};
    const glowOpacity = interpolate(pulse.value, [0, 1], [0.15, 0.35]);
    const glowScale = interpolate(pulse.value, [0, 1], [1, 1.2]);
    return {
      opacity: glowOpacity,
      transform: [{ scale: glowScale }],
    };
  });

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceY.value }],
  }));

  const handleStart = async () => {
    await startSessionHaptic();
    scale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      router.push('/intent');
    }, 100);
  };

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Date + greeting */}
      <View style={styles.header}>
        <Text style={styles.dateLabel}>{todayLabel}</Text>
        <Text style={styles.greeting}>Let's focus</Text>
      </View>

      {/* Streak cards */}
      <View style={styles.streakRow}>
        <View style={styles.streakCard}>
          <View style={[styles.streakIconWrap, { backgroundColor: Colors.flame + '18' }]}>
            <FireIcon size={32} color={Colors.flame} />
          </View>
          <Text style={[styles.streakNumber, { color: Colors.flame }]}>
            {loading ? '–' : current}
          </Text>
          <Text style={styles.streakCardLabel}>Current streak</Text>
        </View>

        <View style={styles.streakCard}>
          <View style={[styles.streakIconWrap, { backgroundColor: Colors.accent + '30' }]}>
            <TrophyIcon size={28} color={Colors.accent} />
          </View>
          <Text style={[styles.streakNumber, { color: Colors.accent }]}>
            {loading ? '–' : longest}
          </Text>
          <Text style={styles.streakCardLabel}>Longest streak</Text>
        </View>
      </View>

      {/* Completed today badge */}
      {isIntentionalToday && !loading && (
        <View style={styles.completedBadge}>
          <TargetIcon size={18} color={Colors.primary} />
          <Text style={styles.completedBadgeText}>Intention set for today</Text>
        </View>
      )}

      {/* Big playful start button */}
      <View style={styles.startButtonSection}>
        <Animated.View style={[styles.glow, glowStyle]} />
        <Animated.View style={bounceStyle}>
          <Animated.View style={pressStyle}>
            <AnimatedPressable
              style={styles.startButtonOuter}
              onTouchStart={() => scale.value = withSpring(0.93, { damping: 15, stiffness: 400 })}
              onTouchEnd={() => {
                scale.value = withSpring(1, { damping: 15, stiffness: 400 });
                handleStart();
              }}
            >
              <View style={styles.startButtonInner}>
                <TargetIcon size={56} color={Colors.white} strokeWidth={2} />
                <Text style={styles.startButtonText}>START</Text>
                <Text style={styles.startButtonSubtext}>Set your intention</Text>
              </View>
            </AnimatedPressable>
          </Animated.View>
        </Animated.View>
      </View>

      {/* Quick stat cards */}
      <View style={styles.tipRow}>
        <DuoCard style={styles.tipCard}>
          <View style={[styles.tipIconWrap, { backgroundColor: Colors.secondary + '18' }]}>
            <BoltIcon size={24} color={Colors.secondary} />
          </View>
          <Text style={styles.tipTitle}>Quick Start</Text>
          <Text style={styles.tipText}>Pick a 10-minute session to build the habit</Text>
        </DuoCard>
        <DuoCard style={styles.tipCard}>
          <View style={[styles.tipIconWrap, { backgroundColor: Colors.accent + '30' }]}>
            <SparkleIcon size={24} color={Colors.accent} />
          </View>
          <Text style={styles.tipTitle}>Stay Consistent</Text>
          <Text style={styles.tipText}>Daily sessions keep your streak alive</Text>
        </DuoCard>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.text,
    marginTop: 4,
  },
  streakRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  streakCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    paddingVertical: Spacing.lg,
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
  streakCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textLight,
    marginTop: 4,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary + '15',
    borderRadius: Radii.pill,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: Spacing.xl,
    alignSelf: 'center',
  },
  completedBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  startButtonSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.xl,
  },
  glow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.primary,
  },
  startButtonOuter: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonInner: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00000030',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.white,
    marginTop: 8,
    letterSpacing: 2,
  },
  startButtonSubtext: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.white,
    opacity: 0.8,
    marginTop: 4,
  },
  tipRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  tipCard: {
    flex: 1,
    padding: 16,
  },
  tipIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textLight,
    lineHeight: 18,
  },
});