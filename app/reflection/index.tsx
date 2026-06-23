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
import { useColors, Spacing, Radii } from '../../constants/theme';
import { useSessionStore } from '../../stores/sessionStore';
import { createSession, recomputeStreaks } from '../../db/queries';
import { useNotifications } from '../../hooks/useNotifications';
import { streakIncrement, buttonPress } from '../../utils/haptics';
import { DuoButton } from '../../components/DuoButton';
import { HeartIcon, SmileIcon, MehIcon, ToughIcon, CheckIcon, ArrowLeftIcon } from '../../components/Icons';

const MOODS = [
  { label: 'Great',   value: 'great',   Icon: HeartIcon,  colorKey: 'moodGreat' },
  { label: 'Good',    value: 'good',    Icon: SmileIcon,  colorKey: 'moodGood' },
  { label: 'Neutral', value: 'neutral', Icon: MehIcon,    colorKey: 'moodNeutral' },
  { label: 'Hard',    value: 'hard',    Icon: ToughIcon,  colorKey: 'moodHard' },
] as const;

export default function ReflectionScreen() {
  const Colors = useColors();
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
    <ScrollView style={[styles.container, { backgroundColor: Colors.background }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: Colors.surfaceAlt }]}>
        <ArrowLeftIcon size={28} color={Colors.text} />
      </TouchableOpacity>

      <Animated.View style={[styles.header, titleStyle]}>
        <View style={[styles.checkCircle, { backgroundColor: Colors.primary + '15' }]}>
          <CheckIcon size={48} color={Colors.primary} />
        </View>
        <Text style={[styles.title, { color: Colors.text }]}>Session Complete!</Text>
        <Text style={[styles.subtitle, { color: Colors.textLight }]}>You focused for {duration} minutes</Text>
      </Animated.View>

      <Text style={[styles.sectionLabel, { color: Colors.textMuted }]}>WHAT DID YOU ACCOMPLISH?</Text>
      <TextInput
        style={[styles.input, { color: Colors.text, backgroundColor: Colors.cardBg, borderColor: Colors.borderLight }]}
        placeholder="Type bullet points..."
        placeholderTextColor={Colors.textMuted}
        value={reflection}
        onChangeText={setReflection}
        multiline
        maxLength={500}
      />

      <Text style={[styles.sectionLabel, { color: Colors.textMuted }]}>HOW DID IT FEEL?</Text>
      <View style={styles.moodsRow}>
        {MOODS.map((mood) => {
          const Icon = mood.Icon;
          const isSelected = selectedMood === mood.value;
          const moodColor = Colors[mood.colorKey];
          return (
            <TouchableOpacity
              key={mood.value}
              style={[
                styles.moodButton,
                { backgroundColor: Colors.cardBg, borderColor: Colors.borderLight },
                isSelected && { borderColor: moodColor, backgroundColor: moodColor + '15' },
              ]}
              onPress={() => setSelectedMood(mood.value)}
              activeOpacity={0.7}
            >
              <Icon size={36} />
              <Text style={[styles.moodLabel, { color: Colors.text }, isSelected && { color: moodColor }]}>
                {mood.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footer}>
        <DuoButton label="COMPLETE SESSION" onPress={handleComplete} fullWidth size="lg" variant="primary" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  backButton: { marginTop: Spacing.xl, marginBottom: Spacing.md, width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  header: { alignItems: 'center', marginBottom: Spacing.xl },
  checkCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '900' },
  subtitle: { fontSize: 15, fontWeight: '500', marginTop: 4 },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 12 },
  input: { fontSize: 16, fontWeight: '500', borderWidth: 2, borderRadius: Radii.md, padding: Spacing.md, minHeight: 120, textAlignVertical: 'top', marginBottom: Spacing.xl },
  moodsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xl, gap: 8 },
  moodButton: { flex: 1, alignItems: 'center', padding: 14, borderRadius: Radii.md, borderWidth: 2 },
  moodLabel: { fontSize: 13, fontWeight: '700', marginTop: 8 },
  footer: { marginTop: Spacing.lg },
});