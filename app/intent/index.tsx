import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Colors, Spacing, Typography, Radii } from '../../constants/theme';
import { useSessionStore } from '../../stores/sessionStore';
import { DuoButton } from '../../components/DuoButton';
import { ArrowLeftIcon, SparkleIcon } from '../../components/Icons';
import { buttonPress } from '../../utils/haptics';

const EXAMPLE_INTENTS = [
  { label: 'Read a paper', emoji: '📖' },
  { label: 'Walk outside', emoji: '🚶' },
  { label: 'Lift weights', emoji: '🏋️' },
  { label: 'Study German', emoji: '🇩🇪' },
  { label: 'Journal', emoji: '✍️' },
  { label: 'Meditate', emoji: '🧘' },
  { label: 'Deep work', emoji: '💻' },
  { label: 'Draw something', emoji: '🎨' },
];

export default function IntentScreen() {
  const router = useRouter();
  const setIntent = useSessionStore((state) => state.setIntent);
  const [text, setText] = useState('');

  const handleContinue = async () => {
    if (!text.trim()) return;
    await buttonPress();
    setIntent(text.trim());
    router.push('/duration');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeftIcon size={28} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleSection}>
        <View style={styles.titleRow}>
          <SparkleIcon size={28} color={Colors.accent} />
          <Text style={styles.title}>What's your intention?</Text>
        </View>
        <Text style={styles.subtitle}>Pick one thing to focus on</Text>
      </View>

      {/* Input */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Type your intention..."
          placeholderTextColor={Colors.textMuted}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={100}
          autoFocus
        />
        <Text style={styles.charCount}>{text.length}/100</Text>
      </View>

      {/* Quick pick chips */}
      <Text style={styles.chipsTitle}>QUICK PICK</Text>
      <View style={styles.chipsContainer}>
        {EXAMPLE_INTENTS.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.chip,
              text === item.label && styles.chipSelected,
            ]}
            onPress={() => setText(item.label)}
            activeOpacity={0.7}
          >
            <Text style={styles.chipEmoji}>{item.emoji}</Text>
            <Text
              style={[
                styles.chipText,
                text === item.label && styles.chipTextSelected,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue button */}
      <View style={styles.footer}>
        <DuoButton
          label="CONTINUE"
          onPress={handleContinue}
          fullWidth
          size="lg"
          disabled={!text.trim()}
          variant="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  header: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    marginBottom: Spacing.xl,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textLight,
    marginTop: 4,
    marginLeft: 36,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  input: {
    fontSize: 18,
    fontWeight: '600',
    borderWidth: 2,
    borderColor: Colors.borderLight,
    borderRadius: Radii.md,
    padding: Spacing.md,
    minHeight: 80,
    textAlignVertical: 'top',
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  charCount: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  chipsTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    borderRadius: Radii.pill,
  },
  chipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '12',
  },
  chipEmoji: {
    fontSize: 18,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  chipTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  footer: {
    paddingBottom: Spacing.lg,
  },
});