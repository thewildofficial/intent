import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { Colors, Spacing, Radii } from '../../constants/theme';
import { SessionTimeline } from '../../components/SessionTimeline';
import { getTodaySessions } from '../../db/queries';
import type { sessions } from '../../db/schema';
import { ReviewIcon, ClockIcon, TargetIcon } from '../../components/Icons';
import { DuoCard, EmptyState } from '../../components/DuoButton';

type SessionRow = typeof sessions.$inferSelect;

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
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
      {/* Title */}
      <View style={styles.titleRow}>
        <View style={styles.titleIconWrap}>
          <ReviewIcon size={24} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Today's Review</Text>
      </View>

      {/* Summary cards */}
      <View style={styles.summaryRow}>
        <DuoCard style={styles.summaryCard}>
          <View style={[styles.summaryIconWrap, { backgroundColor: Colors.primary + '18' }]}>
            <TargetIcon size={24} color={Colors.primary} />
          </View>
          <Text style={styles.summaryValue}>{sessions.length}</Text>
          <Text style={styles.summaryLabel}>Sessions</Text>
        </DuoCard>

        <DuoCard style={styles.summaryCard}>
          <View style={[styles.summaryIconWrap, { backgroundColor: Colors.secondary + '18' }]}>
            <ClockIcon size={24} color={Colors.secondary} />
          </View>
          <Text style={styles.summaryValue}>{formatDuration(totalMinutes)}</Text>
          <Text style={styles.summaryLabel}>Total time</Text>
        </DuoCard>
      </View>

      {/* Session list */}
      {loading ? (
        <Text style={styles.placeholder}>Loading...</Text>
      ) : sessions.length === 0 ? (
        <EmptyState
          icon={<TargetIcon size={32} color={Colors.textMuted} />}
          title="No sessions yet today"
          subtitle="Start your first session to see it here"
        />
      ) : (
        <View style={styles.timelineWrapper}>
          <Text style={styles.sectionLabel}>SESSIONS</Text>
          <SessionTimeline sessions={sessions} />
        </View>
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
    paddingBottom: Spacing.xxxl,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  titleIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.text,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  summaryIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.text,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textLight,
    marginTop: 4,
  },
  placeholder: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  timelineWrapper: {
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
});