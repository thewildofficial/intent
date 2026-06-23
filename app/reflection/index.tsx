import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useReducedMotion,
} from 'react-native-reanimated';
import { Colors, Spacing, Radii } from '../../constants/theme';
import { useSessionStore } from '../../stores/sessionStore';
import { createSession, recomputeStreaks } from '../../db/queries';
import { useNotifications } from '../../hooks/useNotifications';
import { streakIncrement, buttonPress } from '../../utils/haptics';
import { DuoButton } from '../../components/DuoButton';
import { HeartIcon, SmileIcon, MehIcon, ToughIcon, CheckIcon, ArrowLeftIcon } from '../../components/Icons';

const MOODS = [
  { label: 'Great',   value: 'great',   Icon: HeartIcon,  color: Colors.moodGreat },
  { label: 'Good',    value: 'good',    Icon: SmileIcon,  color: Colors.moodGood },
  { label: 'Neutral', value: 'neutral', Icon: MehIcon,    color: Colors.moodNeutral },
  { label: 'Hard',    value: 'hard',    Icon: ToughIcon,  color: Colors.moodHard },
];

export default function ReflectionScreen() {
  const router = useRouter();
  const { intent, duration, startEpochMs, reset } = useSessionStore();
  const [reflection, setReflection] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { scheduleSessionComplete } = useNotifications();
  const reduceMotion = useReducedMotion();

  const titleScale = useSharedValue(0.92);
  const titleOpacity = useSharedValue(0);

  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: reduceMotion ? 0 : 500 });
    titleScale.value = withSpring(1, { damping: 12, stiffness: 200 });
  }, [reduceMotion]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ scale: titleScale.value }],
  }));

  const handleComplete = async () => {
    if (!startEpochMs) return;

    await buttonPress();

    const now = new Date();
    await createSession({
      intentText: intent,
      durationMin: duration,
      startedAt: new Date(startEpochMs),
      completedAt: now,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      reflectionText: reflection.trim() || null,
      mood: selectedMood,
      createdAt: now,
    });

    await recomputeStreaks();
    await streakIncrement();
    await scheduleSessionComplete();

    reset();
    router.replace('/(tabs)');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Back */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeftIcon size={28} color={Colors.text} />
      </TouchableOpacity>

      {/* Completion header */}
      <Animated.View style={[styles.header, titleStyle]}>
        <View style={styles.checkCircle}>
          <CheckIcon size={48} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Session Complete!</Text>
        <Text style={styles.subtitle}>You focused for {duration} minutes</Text>
      </Animated.View>

      {/* Reflection input */}
      <Text style={styles.sectionLabel}>WHAT DID YOU ACCOMPLISH?</Text>
      <TextInput
        style={styles.input}
        placeholder="Type bullet points..."
        placeholderTextColor={Colors.textMuted}
        value={reflection}
        onChangeText={setReflection}
        multiline
        maxLength={500}
      />

      {/* Mood selector */}
      <Text style={styles.sectionLabel}>HOW DID IT FEEL?</Text>
      <View style={styles.moodsRow}>
        {MOODS.map((mood) => {
          const Icon = mood.Icon;
          const isSelected = selectedMood === mood.value;
          return (
            <TouchableOpacity
              key={mood.value}
              style={[
                styles.moodButton,
                isSelected && { borderColor: mood.color, backgroundColor: mood.color + '15' },
              ]}
              onPress={() => setSelectedMood(mood.value)}
              activeOpacity={0.7}
            >
              <Icon size={36} />
              <Text style={[
                styles.moodLabel,
                isSelected && { color: mood.color },
              ]}>{mood.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Complete button */}
      <View style={styles.footer}>
        <DuoButton
          label="COMPLETE SESSION"
          onPress={handleComplete}
          fullWidth
          size="lg"
          variant="primary"
        />
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
  backButton: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textLight,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  input: {
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 2,
    borderColor: Colors.borderLight,
    borderRadius: Radii.md,
    padding: Spacing.md,
    minHeight: 120,
    textAlignVertical: 'top',
    color: Colors.text,
    backgroundColor: Colors.white,
    marginBottom: Spacing.xl,
  },
  moodsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    gap: 8,
  },
  moodButton: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: Radii.md,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  moodLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 8,
  },
  footer: {
    marginTop: Spacing.lg,
  },
});