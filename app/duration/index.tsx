import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useColors, Spacing, Radii } from '../../constants/theme';
import { useSessionStore } from '../../stores/sessionStore';
import { buttonPress } from '../../utils/haptics';
import { ArrowLeftIcon, BoltIcon, ClockIcon, FireIcon, TargetIcon, TrophyIcon, SparkleIcon, HeartIcon } from '../../components/Icons';

const DURATIONS = [
  { min: 10, icon: BoltIcon,    colorKey: 'accent',    label: 'Quick',     prompt: 'Warm up', recommended: false },
  { min: 15, icon: ClockIcon,   colorKey: 'secondary', label: 'Short',     prompt: 'Dip in',  recommended: false },
  { min: 25, icon: SparkleIcon, colorKey: 'primary',   label: 'Pomodoro',  prompt: 'Classic', recommended: true },
  { min: 30, icon: TargetIcon,  colorKey: 'primary',   label: 'Focused',   prompt: 'Lock in', recommended: false },
  { min: 45, icon: FireIcon,    colorKey: 'flame',      label: 'Deep',      prompt: 'Grind',  recommended: false },
  { min: 60, icon: TrophyIcon,  colorKey: 'flame',      label: 'Full',      prompt: 'All in', recommended: false },
] as const;

export default function DurationScreen() {
  const Colors = useColors();
  const router = useRouter();
  const setDuration = useSessionStore((state) => state.setDuration);

  const handleSelect = async (minutes: number) => {
    await buttonPress();
    setDuration(minutes);
    router.push('/session');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors.background }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: Colors.surfaceAlt }]}>
          <ArrowLeftIcon size={28} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.titleSection}>
        <Text style={[styles.title, { color: Colors.text }]}>How long?</Text>
        <Text style={[styles.subtitle, { color: Colors.textLight }]}>Choose your focus duration</Text>
      </View>

      <View style={styles.tipCard}>
        <HeartIcon size={18} color={Colors.secondary} />
        <Text style={[styles.tipText, { color: Colors.textLight }]}>
          Deep work often starts after 20 min. Start small, extend anytime.
        </Text>
      </View>

      <View style={styles.grid}>
        {DURATIONS.map((item) => {
          const Icon = item.icon;
          const color = Colors[item.colorKey];
          return (
            <TouchableOpacity
              key={item.min}
              style={styles.durationCard}
              onPress={() => handleSelect(item.min)}
              activeOpacity={0.85}
            >
              {item.recommended && (
                <View style={[styles.recommendedBadge, { backgroundColor: color }]}>
                  <Text style={styles.recommendedText}>RECOMMENDED</Text>
                </View>
              )}
              <View style={[styles.cardMain, { backgroundColor: Colors.cardBg, borderColor: color + '30' }]}>
                <View style={[styles.cardIconWrap, { backgroundColor: color + '18' }]}>
                  <Icon size={28} color={color} />
                </View>
                <Text style={[styles.cardNumber, { color: Colors.text }]}>{item.min}</Text>
                <Text style={[styles.cardUnit, { color: Colors.textLight }]}>min</Text>
                <Text style={[styles.cardLabel, { color }]}>{item.label}</Text>
                <Text style={[styles.cardPrompt, { color: Colors.textMuted }]}>{item.prompt}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  header: { marginTop: Spacing.xl, marginBottom: Spacing.md },
  backButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  titleSection: { marginBottom: Spacing.md },
  title: { fontSize: 28, fontWeight: '900' },
  subtitle: { fontSize: 15, fontWeight: '500', marginTop: 4 },
  tipCard: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: Spacing.md, paddingVertical: 12, borderRadius: Radii.md, marginBottom: Spacing.lg, backgroundColor: 'transparent', borderWidth: 0 },
  tipText: { fontSize: 13, fontWeight: '500', flex: 1, lineHeight: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: Spacing.sm },
  durationCard: { width: '47%', position: 'relative', marginBottom: Spacing.md },
  recommendedBadge: { position: 'absolute', top: -6, left: 12, paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radii.sm, zIndex: 2 },
  recommendedText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.8, color: '#fff' },
  cardMain: { borderRadius: Radii.lg, borderWidth: 2, padding: Spacing.lg, alignItems: 'center', justifyContent: 'center' },
  cardIconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  cardNumber: { fontSize: 36, fontWeight: '900' },
  cardUnit: { fontSize: 14, fontWeight: '600', marginTop: -4 },
  cardLabel: { fontSize: 13, fontWeight: '800', marginTop: 8 },
  cardPrompt: { fontSize: 12, fontWeight: '600', marginTop: 2, opacity: 0.7 },
});