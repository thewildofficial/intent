import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { useSessionStore } from '../../stores/sessionStore';

const DURATIONS = [10, 15, 25, 30, 45, 60];

export default function DurationScreen() {
  const router = useRouter();
  const setDuration = useSessionStore((state) => state.setDuration);

  const handleSelect = (minutes: number) => {
    setDuration(minutes);
    router.push('/session');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How long?</Text>
      <Text style={styles.subtitle}>Choose your focus duration</Text>

      <View style={styles.grid}>
        {DURATIONS.map((minutes) => (
          <TouchableOpacity
            key={minutes}
            style={styles.durationButton}
            onPress={() => handleSelect(minutes)}
            activeOpacity={0.8}
          >
            <Text style={styles.durationNumber}>{minutes}</Text>
            <Text style={styles.durationLabel}>min</Text>
          </TouchableOpacity>
        ))}
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
  title: {
    ...Typography.title,
    color: Colors.text,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textLight,
    marginBottom: Spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  durationButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  durationNumber: {
    ...Typography.display,
    color: Colors.white,
  },
  durationLabel: {
    ...Typography.caption,
    color: Colors.white,
    opacity: 0.8,
  },
});
