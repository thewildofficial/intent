import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing, Radii } from '../../constants/theme';
import { getSessionsForDate } from '../../db/queries';
import { ArrowLeftIcon, ClockIcon, CalendarIcon, HeartIcon, SmileIcon, MehIcon, ToughIcon } from '../../components/Icons';
import { DuoCard, EmptyState } from '../../components/DuoButton';

type SessionRow = {
  id: number;
  intentText: string;
  durationMin: number;
  startedAt: Date;
  completedAt: Date | null;
  mood: string | null;
  reflectionText: string | null;
};

const MOOD_ICONS: Record<string, { Icon: React.FC<{ size?: number; color?: string }>; color: string }> = {
  great:   { Icon: HeartIcon,  color: Colors.moodGreat },
  good:    { Icon: SmileIcon,  color: Colors.moodGood },
  neutral: { Icon: MehIcon,    color: Colors.moodNeutral },
  hard:    { Icon: ToughIcon,   color: Colors.moodHard },
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
      {/* Back */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeftIcon size={28} color={Colors.text} />
      </TouchableOpacity>

      {/* Date header */}
      <View style={styles.dateHeader}>
        <View style={styles.dateIconWrap}>
          <CalendarIcon size={24} color={Colors.primary} />
        </View>
        <Text style={styles.dateText}>{displayDate}</Text>
      </View>

      {/* Summary */}
      <DuoCard style={styles.summaryCard}>
        <Text style={styles.summaryValue}>{totalMinutes}</Text>
        <Text style={styles.summaryLabel}>intentional minutes</Text>
      </DuoCard>

      {/* Sessions */}
      {loading ? (
        <Text style={styles.placeholder}>Loading...</Text>
      ) : sessions.length === 0 ? (
        <EmptyState
          icon={<CalendarIcon size={32} color={Colors.textMuted} />}
          title="No sessions on this day"
          subtitle="Pick another day or start a new session"
        />
      ) : (
        <View style={styles.sessionList}>
          {sessions.map((session) => {
            const moodInfo = session.mood ? MOOD_ICONS[session.mood] : null;
            return (
              <DuoCard key={session.id} style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <View style={styles.timeRow}>
                    <ClockIcon size={16} color={Colors.textMuted} />
                    <Text style={styles.sessionTime}>
                      {formatTime(new Date(session.startedAt))}
                    </Text>
                  </View>
                  {moodInfo && (
                    <moodInfo.Icon size={28} color={moodInfo.color} />
                  )}
                </View>
                <Text style={styles.intentText}>{session.intentText}</Text>
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>
                    {session.completedAt ? `${session.durationMin} min` : 'Incomplete'}
                  </Text>
                </View>
                {session.reflectionText ? (
                  <View style={styles.reflectionBox}>
                    <Text style={styles.reflectionText}>{session.reflectionText}</Text>
                  </View>
                ) : null}
              </DuoCard>
            );
          })}
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
  backButton: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.lg,
  },
  dateIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    flex: 1,
    fontSize: 22,
    fontWeight: '900',
    color: Colors.text,
  },
  summaryCard: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  summaryValue: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.primary,
  },
  summaryLabel: {
    fontSize: 14,
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
  sessionList: {
    gap: Spacing.md,
  },
  sessionCard: {
    padding: 20,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sessionTime: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  intentText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  durationBadge: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary + '15',
    borderRadius: Radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 8,
  },
  durationText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary,
  },
  reflectionBox: {
    marginTop: 8,
    backgroundColor: Colors.surface,
    borderRadius: Radii.sm,
    padding: 12,
  },
  reflectionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textLight,
    lineHeight: 20,
  },
});