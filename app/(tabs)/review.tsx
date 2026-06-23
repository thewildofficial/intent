import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { useColors, Spacing, Radii } from '../../constants/theme';
import { SessionTimeline } from '../../components/SessionTimeline';
import { getTodaySessions, getActualMinutes } from '../../db/queries';
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
  const Colors = useColors();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setSessions(await getTodaySessions());
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const totalMinutes = sessions.reduce((sum, s) => sum + getActualMinutes(s.startedAt, s.completedAt, s.durationMin), 0);

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.titleRow}>
        <View style={[styles.titleIconWrap, { backgroundColor: Colors.primary + '15' }]}>
          <ReviewIcon size={24} color={Colors.primary} />
        </View>
        <Text style={[styles.title, { color: Colors.text }]}>Today's Review</Text>
      </View>

      <View style={styles.summaryRow}>
        <DuoCard style={styles.summaryCard}>
          <View style={[styles.summaryIconWrap, { backgroundColor: Colors.primary + '18' }]}>
            <TargetIcon size={24} color={Colors.primary} />
          </View>
          <Text style={[styles.summaryValue, { color: Colors.text }]}>{sessions.length}</Text>
          <Text style={[styles.summaryLabel, { color: Colors.textLight }]}>Sessions</Text>
        </DuoCard>

        <DuoCard style={styles.summaryCard}>
          <View style={[styles.summaryIconWrap, { backgroundColor: Colors.secondary + '18' }]}>
            <ClockIcon size={24} color={Colors.secondary} />
          </View>
          <Text style={[styles.summaryValue, { color: Colors.text }]}>{formatDuration(totalMinutes)}</Text>
          <Text style={[styles.summaryLabel, { color: Colors.textLight }]}>Total time</Text>
        </DuoCard>
      </View>

      {loading ? (
        <Text style={[styles.placeholder, { color: Colors.textLight }]}>Loading...</Text>
      ) : sessions.length === 0 ? (
        <EmptyState
          icon={<TargetIcon size={32} color={Colors.textMuted} />}
          title="No sessions yet today"
          subtitle="Start your first session to see it here"
        />
      ) : (
        <View style={styles.timelineWrapper}>
          <Text style={[styles.sectionLabel, { color: Colors.textMuted }]}>SESSIONS</Text>
          <SessionTimeline sessions={sessions} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: Spacing.xxl, marginBottom: Spacing.xl },
  titleIconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '900' },
  summaryRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  summaryCard: { flex: 1, alignItems: 'center', padding: 20 },
  summaryIconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  summaryValue: { fontSize: 28, fontWeight: '900' },
  summaryLabel: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  placeholder: { fontSize: 16, fontWeight: '500', textAlign: 'center', marginTop: Spacing.xl },
  timelineWrapper: { marginTop: 8 },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 12 },
});