import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useColors, Spacing, Radii } from '../../constants/theme';
import { useSessionStore } from '../../stores/sessionStore';
import { buttonPress } from '../../utils/haptics';
import { ArrowLeftIcon, ClockIcon, BoltIcon, FireIcon, TargetIcon } from '../../components/Icons';

const DURATIONS = [
  { min: 10, icon: BoltIcon,    colorKey: 'accent',    label: 'Quick' },
  { min: 15, icon: ClockIcon,   colorKey: 'secondary', label: 'Short' },
  { min: 25, icon: ClockIcon,   colorKey: 'primary',   label: 'Pomodoro' },
  { min: 30, icon: TargetIcon,  colorKey: 'primary',   label: 'Focused' },
  { min: 45, icon: FireIcon,    colorKey: 'flame',     label: 'Deep' },
  { min: 60, icon: FireIcon,    colorKey: 'flame',     label: 'Full' },
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
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: Colors.surfaceAlt }]}>
          <ArrowLeftIcon size={28} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.titleSection}>
        <Text style={[styles.title, { color: Colors.text }]}>How long?</Text>
        <Text style={[styles.subtitle, { color: Colors.textLight }]}>Choose your focus duration</Text>
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
              <View style={[styles.cardEdge, { backgroundColor: color }]} />
              <View style={[styles.cardMain, { backgroundColor: Colors.cardBg, borderColor: color + '30' }]}>
                <View style={[styles.cardIconWrap, { backgroundColor: color + '18' }]}>
                  <Icon size={28} color={color} />
                </View>
                <Text style={[styles.cardNumber, { color: Colors.text }]}>{item.min}</Text>
                <Text style={[styles.cardUnit, { color: Colors.textLight }]}>min</Text>
                <Text style={[styles.cardLabel, { color }]}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.lg },
  header: { marginTop: Spacing.xl, marginBottom: Spacing.md },
  backButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  titleSection: { marginBottom: Spacing.xl },
  title: { fontSize: 28, fontWeight: '900' },
  subtitle: { fontSize: 15, fontWeight: '500', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: Spacing.sm },
  durationCard: { width: '47%', position: 'relative', marginBottom: Spacing.md },
  cardEdge: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%', borderRadius: Radii.lg, transform: [{ translateY: 4 }] },
  cardMain: { position: 'relative', borderRadius: Radii.lg, borderWidth: 2, padding: Spacing.lg, alignItems: 'center', justifyContent: 'center' },
  cardIconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  cardNumber: { fontSize: 36, fontWeight: '900' },
  cardUnit: { fontSize: 14, fontWeight: '600', marginTop: -4 },
  cardLabel: { fontSize: 13, fontWeight: '800', marginTop: 8 },
});