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
import { useColors, Spacing, Radii } from '../../constants/theme';
import { useStreaks } from '../../hooks/useStreaks';
import { startSession as startSessionHaptic } from '../../utils/haptics';
import { FireIcon, TrophyIcon, TargetIcon, SparkleIcon, BoltIcon } from '../../components/Icons';
import { DuoCard } from '../../components/DuoButton';

const AnimatedPressable = Animated.createAnimatedComponent(Animated.View);

export default function HomeScreen() {
  const Colors = useColors();
  const router = useRouter();
  const { current, longest, isIntentionalToday, loading } = useStreaks();
  const reduceMotion = useReducedMotion();

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
    return {
      opacity: interpolate(pulse.value, [0, 1], [0.15, 0.35]),
      transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.2]) }],
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
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.dateLabel, { color: Colors.textLight }]}>{todayLabel}</Text>
        <Text style={[styles.greeting, { color: Colors.text }]}>Let's focus</Text>
      </View>

      <View style={styles.streakRow}>
        <View style={[styles.streakCard, { backgroundColor: Colors.cardBg, borderColor: Colors.borderLight }]}>
          <View style={[styles.streakIconWrap, { backgroundColor: Colors.flame + '18' }]}>
            <FireIcon size={32} color={Colors.flame} />
          </View>
          <Text style={[styles.streakNumber, { color: Colors.flame }]}>
            {loading ? '–' : current}
          </Text>
          <Text style={[styles.streakCardLabel, { color: Colors.textLight }]}>Current streak</Text>
        </View>

        <View style={[styles.streakCard, { backgroundColor: Colors.cardBg, borderColor: Colors.borderLight }]}>
          <View style={[styles.streakIconWrap, { backgroundColor: Colors.accent + '30' }]}>
            <TrophyIcon size={28} color={Colors.accent} />
          </View>
          <Text style={[styles.streakNumber, { color: Colors.accent }]}>
            {loading ? '–' : longest}
          </Text>
          <Text style={[styles.streakCardLabel, { color: Colors.textLight }]}>Longest streak</Text>
        </View>
      </View>

      {isIntentionalToday && !loading && (
        <View style={[styles.completedBadge, { backgroundColor: Colors.primary + '15' }]}>
          <TargetIcon size={18} color={Colors.primary} />
          <Text style={[styles.completedBadgeText, { color: Colors.primary }]}>Intention set for today</Text>
        </View>
      )}

      <View style={styles.startButtonSection}>
        <Animated.View style={[styles.glow, glowStyle, { backgroundColor: Colors.primary }]} />
        <Animated.View style={bounceStyle}>
          <Animated.View style={pressStyle}>
            <AnimatedPressable
              style={[styles.startButtonOuter, { backgroundColor: Colors.primaryDark }]}
              onTouchStart={() => scale.value = withSpring(0.93, { damping: 15, stiffness: 400 })}
              onTouchEnd={() => {
                scale.value = withSpring(1, { damping: 15, stiffness: 400 });
                handleStart();
              }}
            >
              <View style={[styles.startButtonInner, { backgroundColor: Colors.primary }]}>
                <TargetIcon size={56} color={Colors.white} strokeWidth={2} />
                <Text style={[styles.startButtonText, { color: Colors.white }]}>START</Text>
                <Text style={[styles.startButtonSubtext, { color: Colors.white }]}>Set your intention</Text>
              </View>
            </AnimatedPressable>
          </Animated.View>
        </Animated.View>
      </View>

      <View style={styles.tipRow}>
        <DuoCard style={styles.tipCard}>
          <View style={[styles.tipIconWrap, { backgroundColor: Colors.secondary + '18' }]}>
            <BoltIcon size={24} color={Colors.secondary} />
          </View>
          <Text style={[styles.tipTitle, { color: Colors.text }]}>Quick Start</Text>
          <Text style={[styles.tipText, { color: Colors.textLight }]}>Pick a 10-minute session to build the habit</Text>
        </DuoCard>
        <DuoCard style={styles.tipCard}>
          <View style={[styles.tipIconWrap, { backgroundColor: Colors.accent + '30' }]}>
            <SparkleIcon size={24} color={Colors.accent} />
          </View>
          <Text style={[styles.tipTitle, { color: Colors.text }]}>Stay Consistent</Text>
          <Text style={[styles.tipText, { color: Colors.textLight }]}>Daily sessions keep your streak alive</Text>
        </DuoCard>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  header: { marginTop: Spacing.xxl, marginBottom: Spacing.xl },
  dateLabel: { fontSize: 14, fontWeight: '600' },
  greeting: { fontSize: 32, fontWeight: '900', marginTop: 4 },
  streakRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  streakCard: { flex: 1, alignItems: 'center', borderRadius: Radii.lg, borderWidth: 2, paddingVertical: Spacing.lg },
  streakIconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  streakNumber: { fontSize: 40, fontWeight: '900' },
  streakCardLabel: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  completedBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: Radii.pill, paddingVertical: 10, paddingHorizontal: 16, marginBottom: Spacing.xl, alignSelf: 'center' },
  completedBadgeText: { fontSize: 14, fontWeight: '700' },
  startButtonSection: { alignItems: 'center', justifyContent: 'center', marginVertical: Spacing.xl },
  glow: { position: 'absolute', width: 260, height: 260, borderRadius: 130 },
  startButtonOuter: { width: 220, height: 220, borderRadius: 110, alignItems: 'center', justifyContent: 'center' },
  startButtonInner: { width: 200, height: 200, borderRadius: 100, alignItems: 'center', justifyContent: 'center', shadowColor: '#00000030', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 0, elevation: 8 },
  startButtonText: { fontSize: 28, fontWeight: '900', marginTop: 8, letterSpacing: 2 },
  startButtonSubtext: { fontSize: 13, fontWeight: '600', opacity: 0.8, marginTop: 4 },
  tipRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.lg },
  tipCard: { flex: 1, padding: 16 },
  tipIconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  tipTitle: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
  tipText: { fontSize: 13, fontWeight: '500', lineHeight: 18 },
});