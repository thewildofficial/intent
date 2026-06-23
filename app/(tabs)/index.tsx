import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { useStreaks } from '../../hooks/useStreaks';

export default function HomeScreen() {
  const router = useRouter();
  const { current, longest, isIntentionalToday, loading } = useStreaks();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
        <View style={styles.streakRow}>
          <View style={styles.streakBadge}>
            <Text style={styles.streakValue}>{loading ? '-' : current}</Text>
            <Text style={styles.streakLabel}>Current streak</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakValue}>{loading ? '-' : longest}</Text>
            <Text style={styles.streakLabel}>Longest streak</Text>
          </View>
        </View>
        {isIntentionalToday && !loading && (
          <Text style={styles.completedNote}>Intention set for today</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => router.push('/intent')}
        activeOpacity={0.8}
      >
        <Text style={styles.startButtonText}>Start Session</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  date: {
    ...Typography.subtitle,
    color: Colors.textLight,
    marginBottom: Spacing.md,
  },
  streakRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  streakBadge: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 110,
  },
  streakValue: {
    ...Typography.display,
    color: Colors.primary,
  },
  streakLabel: {
    ...Typography.caption,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  completedNote: {
    ...Typography.caption,
    color: Colors.success,
    fontWeight: '600',
  },
  startButton: {
    width: '80%',
    height: '35%',
    backgroundColor: Colors.primary,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  startButtonText: {
    ...Typography.title,
    color: Colors.white,
    fontWeight: '700',
  },
});
