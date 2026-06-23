import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radii } from '../../constants/theme';
import { useSessionStore } from '../../stores/sessionStore';
import { buttonPress } from '../../utils/haptics';
import { ArrowLeftIcon, ClockIcon, BoltIcon, FireIcon, TargetIcon } from '../../components/Icons';

const DURATIONS = [
  { min: 10, icon: BoltIcon,    color: Colors.accent,    label: 'Quick' },
  { min: 15, icon: ClockIcon,   color: Colors.secondary, label: 'Short' },
  { min: 25, icon: ClockIcon,   color: Colors.primary,   label: 'Pomodoro' },
  { min: 30, icon: TargetIcon,  color: Colors.primary,   label: 'Focused' },
  { min: 45, icon: FireIcon,    color: Colors.flame,     label: 'Deep' },
  { min: 60, icon: FireIcon,    color: Colors.flame,     label: 'Full' },
];

export default function DurationScreen() {
  const router = useRouter();
  const setDuration = useSessionStore((state) => state.setDuration);

  const handleSelect = async (minutes: number) => {
    await buttonPress();
    setDuration(minutes);
    router.push('/session');
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
        <Text style={styles.title}>How long?</Text>
        <Text style={styles.subtitle}>Choose your focus duration</Text>
      </View>

      {/* Duration grid — Duolingo lesson card style */}
      <View style={styles.grid}>
        {DURATIONS.map((item) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={item.min}
              style={styles.durationCard}
              onPress={() => handleSelect(item.min)}
              activeOpacity={0.85}
            >
              {/* Bottom 3D edge */}
              <View style={[styles.cardEdge, { backgroundColor: item.color }]} />
              {/* Main card */}
              <View style={[styles.cardMain, { backgroundColor: Colors.white, borderColor: item.color + '30' }]}>
                <View style={[styles.cardIconWrap, { backgroundColor: item.color + '18' }]}>
                  <Icon size={28} color={item.color} />
                </View>
                <Text style={styles.cardNumber}>{item.min}</Text>
                <Text style={styles.cardUnit}>min</Text>
                <Text style={[styles.cardLabel, { color: item.color }]}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  durationCard: {
    width: '47%',
    position: 'relative',
    marginBottom: Spacing.md,
  },
  cardEdge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    borderRadius: Radii.lg,
    transform: [{ translateY: 4 }],
  },
  cardMain: {
    position: 'relative',
    borderRadius: Radii.lg,
    borderWidth: 2,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.text,
  },
  cardUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
    marginTop: -4,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 8,
  },
});