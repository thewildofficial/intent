import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { getSessionsForDate } from '../../db/queries';

type SessionRow = {
  id: number;
  intentText: string;
  durationMin: number;
  startedAt: Date;
  completedAt: Date | null;
  mood: string | null;
  reflectionText: string | null;
};

const MOOD_EMOJI: Record<string, string> = {
  great: '🤩',
  good: '🙂',
  neutral: '😐',
  hard: '😣',
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function DayDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!date) return;

    const load = async () => {
      setLoading(true);
      const rows = await getSessionsForDate(date);
      setSessions(rows as SessionRow[]);
      setLoading(false);
    };

    load();
  }, [date]);

  const totalMinutes = sessions
    .filter((s) => s.completedAt !== null)
    .reduce((sum, s) => sum + s.durationMin, 0);

  const displayDate = date
    ? new Date(date.replace(/-/g, '/')).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown date';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{displayDate}</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryValue}>{totalMinutes}</Text>
        <Text style={styles.summaryLabel}>intentional minutes</Text>
      </View>

      {loading ? (
        <Text style={styles.emptyText}>Loading...</Text>
      ) : sessions.length === 0 ? (
        <Text style={styles.emptyText}>No sessions recorded on this day.</Text>
      ) : (
        <View style={styles.sessionList}>
          {sessions.map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionTime}>
                  {formatTime(new Date(session.startedAt))}
                </Text>
                {session.mood && (
                  <Text style={styles.moodEmoji}>{MOOD_EMOJI[session.mood] ?? '😐'}</Text>
                )}
              </View>
              <Text style={styles.intentText}>{session.intentText}</Text>
              <Text style={styles.durationText}>
                {session.completedAt ? `${session.durationMin} min` : 'Incomplete'}
              </Text>
              {session.reflectionText ? (
                <Text style={styles.reflectionText}>{session.reflectionText}</Text>
              ) : null}
            </View>
          ))}
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
    paddingBottom: Spacing.xxl,
  },
  backButton: {
    marginTop: Spacing.xxl,
    marginBottom: Spacing.md,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  title: {
    ...Typography.title,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  summaryValue: {
    ...Typography.display,
    color: Colors.primary,
  },
  summaryLabel: {
    ...Typography.caption,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  sessionList: {
    gap: Spacing.md,
  },
  sessionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sessionTime: {
    ...Typography.caption,
    color: Colors.textLight,
  },
  moodEmoji: {
    fontSize: 20,
  },
  intentText: {
    ...Typography.subtitle,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  durationText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  reflectionText: {
    ...Typography.body,
    color: Colors.textLight,
    marginTop: Spacing.sm,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});
