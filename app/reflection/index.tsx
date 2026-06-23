import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  useReducedMotion,
} from 'react-native-reanimated';
import { useColors, Spacing, Radii } from '../../constants/theme';
import { useSessionStore } from '../../stores/sessionStore';
import { createSession, recomputeStreaks, getStreak, getTodayDateString } from '../../db/queries';
import { useNotifications } from '../../hooks/useNotifications';
import { streakIncrement, buttonPress } from '../../utils/haptics';
import { DuoButton } from '../../components/DuoButton';
import { Confetti } from '../../components/Confetti';
import { CheckIcon, FireIcon, TargetIcon } from '../../components/Icons';

export default function ReflectionScreen() {
  const Colors = useColors();
  const router = useRouter();
  const { intent, duration, startEpochMs, reset, startSession } = useSessionStore();
  const [reflection, setReflection] = useState('');
  const [streakCount, setStreakCount] = useState(0);
  const { scheduleSessionComplete } = useNotifications();
  const reduceMotion = useReducedMotion();

  const [fire, setFire] = useState(false);
  const titleScale = useSharedValue(0.92);
  const titleOpacity = useSharedValue(0);
  const flameScale = useSharedValue(1);
  const flameOpacity = useSharedValue(0);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    setFire(true);
    titleOpacity.value = withTiming(1, { duration: reduceMotion ? 0 : 500 });
    titleScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    checkScale.value = withSpring(1, { damping: 10, stiffness: 250 });
    flameOpacity.value = withDelay(400, withTiming(1, { duration: 300 }));

    if (!reduceMotion) {
      flameScale.value = withDelay(
        400,
        withRepeat(
          withSequence(
            withSpring(1.18, { damping: 8, stiffness: 120 }),
            withSpring(1, { damping: 12, stiffness: 150 }),
          ),
          -1,
        ),
      );
    } else {
      flameScale.value = 1;
    }

    (async () => {
      await recomputeStreaks();
      const todayRow = await getStreak(getTodayDateString());
      setStreakCount(todayRow?.currentStreakCount ?? 0);
    })();
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ scale: titleScale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const flameStyle = useAnimatedStyle(() => ({
    opacity: flameOpacity.value,
    transform: [{ scale: flameScale.value }],
  }));

  const saveSession = async () => {
    if (!startEpochMs) return;
    const now = new Date();
    await createSession({
      intentText: intent,
      durationMin: duration,
      startedAt: new Date(startEpochMs),
      completedAt: now,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      reflectionText: reflection.trim() || null,
      mood: null,
      createdAt: now,
    });
    await recomputeStreaks();
    await streakIncrement();
    await scheduleSessionComplete();
  };

  const handleContinue = async () => {
    await buttonPress();
    await saveSession();
    startSession();
    router.replace('/session');
  };

  const handleFinish = async () => {
    await buttonPress();
    await saveSession();
    reset();
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <Confetti fire={fire} count={35} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Animated.View style={[styles.header, titleStyle]}>
          <Animated.View style={[styles.checkCircle, { backgroundColor: Colors.primary + '15' }, checkStyle]}>
            <CheckIcon size={48} color={Colors.primary} />
          </Animated.View>
          <Text style={[styles.title, { color: Colors.text }]}>Session Complete!</Text>
          <Text style={[styles.subtitle, { color: Colors.textLight }]}>
            You focused for {duration} minutes
          </Text>

          {streakCount > 0 && (
            <Animated.View style={[styles.streakBadge, { backgroundColor: Colors.flame + '15' }, flameStyle]}>
              <FireIcon size={20} color={Colors.flame} />
              <Text style={[styles.streakText, { color: Colors.flame }]}>
                {streakCount} day{streakCount === 1 ? '' : 's'}
              </Text>
            </Animated.View>
          )}
        </Animated.View>

        <View style={[styles.intentionCard, { backgroundColor: Colors.cardBg, borderColor: Colors.borderLight }]}>
          <View style={styles.intentionLabelRow}>
            <TargetIcon size={16} color={Colors.primary} strokeWidth={2} />
            <Text style={[styles.intentionLabel, { color: Colors.textMuted }]}>YOUR INTENTION</Text>
          </View>
          <Text style={[styles.intentionText, { color: Colors.text }]}>{intent}</Text>
        </View>

        <Text style={[styles.sectionLabel, { color: Colors.textMuted }]}>WHAT HAPPENED?</Text>
        <TextInput
          style={[styles.input, { color: Colors.text, backgroundColor: Colors.cardBg, borderColor: Colors.borderLight }]}
          placeholder="Type bullet points..."
          placeholderTextColor={Colors.textMuted}
          value={reflection}
          onChangeText={setReflection}
          multiline
          maxLength={500}
        />

        <View style={styles.footer}>
          <DuoButton
            label={`Continue ${duration}m`}
            onPress={handleContinue}
            fullWidth
            size="lg"
            variant="primary"
          />
          <DuoButton
            label="Finish"
            onPress={handleFinish}
            fullWidth
            size="md"
            variant="ghost"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  header: { alignItems: 'center', marginBottom: Spacing.xl },
  checkCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '900' },
  subtitle: { fontSize: 15, fontWeight: '500', marginTop: 4 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16, paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radii.pill },
  streakText: { fontSize: 14, fontWeight: '800' },
  intentionCard: { borderWidth: 2, borderRadius: Radii.md, padding: Spacing.md, marginBottom: Spacing.xl },
  intentionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  intentionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  intentionText: { fontSize: 17, fontWeight: '700', lineHeight: 22 },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 12 },
  input: { fontSize: 16, fontWeight: '500', borderWidth: 2, borderRadius: Radii.md, padding: Spacing.md, minHeight: 120, textAlignVertical: 'top', marginBottom: Spacing.xl },
  footer: { gap: 10, marginTop: Spacing.md },
});