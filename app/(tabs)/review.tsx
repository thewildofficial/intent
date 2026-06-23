import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { SessionTimeline } from '../../components/SessionTimeline';
import { getTodaySessions } from '../../db/queries';
import type { sessions } from '../../db/schema';

type SessionRow = typeof sessions.$inferSelect;

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

export default function ReviewScreen() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const todaySessions = await getTodaySessions();
    setSessions(todaySessions);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMin, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Today's Review</Text>

      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{sessions.length}</Text>
          <Text style={styles.summaryLabel}>Sessions</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{formatDuration(totalMinutes)}</Text>
          <Text style={styles.summaryLabel}>Total time</Text>
        </View>
      </View>

      {loading ? (
        <Text style={styles.placeholder}>Loading...</Text>
      ) : sessions.length === 0 ? (
        <Text style={styles.placeholder}>No sessions yet today.</Text>
      ) : (
        <SessionTimeline sessions={sessions} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  title: {
    ...Typography.title,
    color: Colors.text,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    ...Typography.subtitle,
    color: Colors.primary,
    fontWeight: '700',
  },
  summaryLabel: {
    ...Typography.caption,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  placeholder: {
    ...Typography.body,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
