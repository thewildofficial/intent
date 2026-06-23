import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useReducedMotion,
} from 'react-native-reanimated';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { useSessionStore } from '../../stores/sessionStore';
import { createSession, recomputeStreaks } from '../../db/queries';
import { useNotifications } from '../../hooks/useNotifications';
import { streakIncrement, buttonPress } from '../../utils/haptics';

const MOODS = [
  { label: 'Great', emoji: '🙂' },
  { label: 'Good', emoji: '😊' },
  { label: 'Neutral', emoji: '😐' },
  { label: 'Hard', emoji: '☹️' },
];

const AnimatedView = Animated.createAnimatedComponent(View);

export default function ReflectionScreen() {
  const router = useRouter();
  const { intent, duration, startEpochMs, reset } = useSessionStore();
  const [reflection, setReflection] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { scheduleSessionComplete } = useNotifications();
  const reduceMotion = useReducedMotion();

  const titleScale = useSharedValue(0.96);
  const titleOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    titleOpacity.value = withSpring(1, { damping: 12, stiffness: 100 });
    titleScale.value = withSpring(1, { damping: 12, stiffness: 100 });
  }, [reduceMotion]);

  const titleStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
      transform: [{ scale: titleScale.value }],
    };
  });

  const buttonPressStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

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

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <View style={styles.container}>
      <AnimatedView style={[styles.titleRow, titleStyle]}>
        <Text style={styles.title}>Session Complete 🎯</Text>
      </AnimatedView>
      <Text style={styles.subtitle}>What did you accomplish?</Text>

      <TextInput
        style={styles.input}
        placeholder="Type bullet points..."
        placeholderTextColor={Colors.textLight}
        value={reflection}
        onChangeText={setReflection}
        multiline
        maxLength={500}
        autoFocus
      />

      <Text style={styles.moodLabel}>How did it feel?</Text>
      <View style={styles.moods}>
        {MOODS.map((mood) => (
          <TouchableOpacity
            key={mood.label}
            style={[
              styles.moodButton,
              selectedMood === mood.label && styles.moodButtonSelected,
            ]}
            onPress={() => setSelectedMood(mood.label)}
          >
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={styles.moodLabel}>{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Animated.View style={buttonPressStyle}>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleComplete}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.completeText}>Complete</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  titleRow: {
    marginTop: Spacing.xxl,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.title,
    color: Colors.text,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textLight,
    marginBottom: Spacing.lg,
  },
  input: {
    ...Typography.body,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: Spacing.md,
    minHeight: 120,
    textAlignVertical: 'top',
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  moodLabel: {
    ...Typography.subtitle,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  moods: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.xl,
  },
  moodButton: {
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  moodButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '20',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  completeButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
  },
  completeText: {
    ...Typography.subtitle,
    color: Colors.white,
    fontWeight: '600',
  },
});
