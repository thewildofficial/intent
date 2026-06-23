import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { useSessionStore } from '../../stores/sessionStore';
import { createSession, completeSession } from '../../db/queries';

const MOODS = [
  { label: 'Great', emoji: '🙂' },
  { label: 'Good', emoji: '😊' },
  { label: 'Neutral', emoji: '😐' },
  { label: 'Hard', emoji: '☹️' },
];

export default function ReflectionScreen() {
  const router = useRouter();
  const { intent, duration, startEpochMs, reset } = useSessionStore();
  const [reflection, setReflection] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleComplete = async () => {
    if (!startEpochMs) return;

    const now = new Date();
    const session = await createSession({
      intentText: intent,
      durationMin: duration,
      startedAt: new Date(startEpochMs),
      completedAt: now,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      reflectionText: reflection.trim() || null,
      mood: selectedMood,
      createdAt: now,
    });

    reset();
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session Complete 🎯</Text>
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

      <TouchableOpacity
        style={styles.completeButton}
        onPress={handleComplete}
      >
        <Text style={styles.completeText}>Complete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  title: {
    ...Typography.title,
    color: Colors.text,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.sm,
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
