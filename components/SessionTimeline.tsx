import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';
import type { sessions } from '../db/schema';

type SessionRow = typeof sessions.$inferSelect;

interface SessionTimelineProps {
  sessions: SessionRow[];
}

function formatTime(date: Date | null | undefined): string {
  if (!date) return '';
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

export function SessionTimeline({ sessions }: SessionTimelineProps) {
  const sorted = [...sessions].sort(
    (a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
  );

  return (
    <View style={styles.container}>
      {sorted.map((session, index) => {
        const isLast = index === sorted.length - 1;
        const timeRange =
          session.completedAt
            ? `${formatTime(session.startedAt)} - ${formatTime(session.completedAt)}`
            : formatTime(session.startedAt);

        return (
          <View key={session.id} style={styles.row}>
            <View style={styles.leftColumn}>
              <View style={styles.dot} />
              {!isLast && <View style={styles.line} />}
            </View>
            <View style={styles.card}>
              <Text style={styles.intent}>{session.intentText}</Text>
              <View style={styles.meta}>
                <Text style={styles.time}>{timeRange}</Text>
                <Text style={styles.duration}>{formatDuration(session.durationMin)}</Text>
              </View>
              {session.mood ? (
                <Text style={styles.mood}>{session.mood}</Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
  },
  row: {
    flexDirection: 'row',
  },
  leftColumn: {
    width: 28,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    marginTop: Spacing.sm,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.xs,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  intent: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  time: {
    ...Typography.caption,
    color: Colors.textLight,
  },
  duration: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  mood: {
    ...Typography.caption,
    color: Colors.textLight,
  },
});
