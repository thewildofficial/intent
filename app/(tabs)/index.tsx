import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography } from '../../constants/theme';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
        <Text style={styles.minutes}>Today's intentional minutes: 0</Text>
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
  minutes: {
    ...Typography.body,
    color: Colors.text,
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
