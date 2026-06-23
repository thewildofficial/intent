import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Radii } from '../constants/theme';
import type { sessions } from '../db/schema';
import { ClockIcon, HeartIcon, SmileIcon, MehIcon, ToughIcon } from './Icons';

type SessionRow = typeof sessions.$inferSelect;

interface SessionTimelineProps {
  sessions: SessionRow[];
}

const MOOD_ICONS: Record<string, { Icon: React.FC<{ size?: number; color?: string }>; color: string }> = {
  great:   { Icon: HeartIcon,  color: Colors.moodGreat },
  good:    { Icon: SmileIcon,  color: Colors.moodGood },
  neutral: { Icon: MehIcon,    color: Colors.moodNeutral },
  hard:    { Icon: ToughIcon,   color: Colors.moodHard },
};

function formatTime(date: Date | null | undefined): string {
  if (!date) return '';
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
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
        const timeRange = session.completedAt
          ? `${formatTime(session.startedAt)} – ${formatTime(session.completedAt)}`
          : formatTime(session.startedAt);
        const moodInfo = session.mood ? MOOD_ICONS[session.mood] : null;

        return (
          <View key={session.id} style={styles.row}>
            {/* Timeline track */}
            <View style={styles.leftColumn}>
              <View style={styles.dot} />
              {!isLast && <View style={styles.line} />}
            </View>

            {/* Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.timeRow}>
                  <ClockIcon size={14} color={Colors.textMuted} />
                  <Text style={styles.time}>{timeRange}</Text>
                </View>
                {moodInfo && (
                  <View style={styles.moodWrap}>
                    <moodInfo.Icon size={20} color={moodInfo.color} />
                  </View>
                )}
              </View>

              <Text style={styles.intent}>{session.intentText}</Text>

              <View style={styles.meta}>
                <View style={styles.durationBadge}>
                  <Text style={styles.duration}>{formatDuration(session.durationMin)}</Text>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
  },
  leftColumn: {
    width: 24,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    marginTop: 14,
    borderWidth: 3,
    borderColor: Colors.primary + '40',
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 4,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radii.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    marginLeft: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  moodWrap: {
    alignItems: 'center',
  },
  intent: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  durationBadge: {
    backgroundColor: Colors.primary + '15',
    borderRadius: Radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  duration: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
  },
});