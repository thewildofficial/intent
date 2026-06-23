import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useColors, Spacing, Radii } from '../../constants/theme';
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
  const Colors = useColors();
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
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: Colors.surfaceAlt }]}>
          <ArrowLeftIcon size={28} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.titleSection}>
        <View style={styles.titleRow}>
          <SparkleIcon size={28} color={Colors.accent} />
          <Text style={[styles.title, { color: Colors.text }]}>What's your intention?</Text>
        </View>
        <Text style={[styles.subtitle, { color: Colors.textLight }]}>Pick one thing to focus on</Text>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, { color: Colors.text, backgroundColor: Colors.cardBg, borderColor: Colors.borderLight }]}
          placeholder="Type your intention..."
          placeholderTextColor={Colors.textMuted}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={100}
          autoFocus
        />
        <Text style={[styles.charCount, { color: Colors.textMuted }]}>{text.length}/100</Text>
      </View>

      <Text style={[styles.chipsTitle, { color: Colors.textMuted }]}>QUICK PICK</Text>
      <View style={styles.chipsContainer}>
        {EXAMPLE_INTENTS.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.chip,
              { backgroundColor: Colors.cardBg, borderColor: Colors.borderLight },
              text === item.label && { borderColor: Colors.primary, backgroundColor: Colors.primary + '12' },
            ]}
            onPress={() => setText(item.label)}
            activeOpacity={0.7}
          >
            <Text style={styles.chipEmoji}>{item.emoji}</Text>
            <Text style={[styles.chipText, { color: Colors.text }, text === item.label && { color: Colors.primary, fontWeight: '700' }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <DuoButton label="CONTINUE" onPress={handleContinue} fullWidth size="lg" disabled={!text.trim()} variant="primary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.lg },
  header: { marginTop: Spacing.xl, marginBottom: Spacing.md },
  backButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  titleSection: { marginBottom: Spacing.xl },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 26, fontWeight: '900' },
  subtitle: { fontSize: 15, fontWeight: '500', marginTop: 4, marginLeft: 36 },
  inputWrapper: { position: 'relative', marginBottom: Spacing.lg },
  input: { fontSize: 18, fontWeight: '600', borderWidth: 2, borderRadius: Radii.md, padding: Spacing.md, minHeight: 80, textAlignVertical: 'top' },
  charCount: { position: 'absolute', bottom: 8, right: 12, fontSize: 12, fontWeight: '500' },
  chipsTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 12 },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, flex: 1 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 2, borderRadius: Radii.pill },
  chipEmoji: { fontSize: 18 },
  chipText: { fontSize: 14, fontWeight: '600' },
  footer: { paddingBottom: Spacing.lg },
});