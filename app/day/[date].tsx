import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColors, Spacing, Radii, type ColorPalette } from '../../constants/theme';
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

const MOOD_ICONS: Record<string, { Icon: React.FC<{ size?: number; color?: string }>; colorKey: keyof ColorPalette }> = {
  great:   { Icon: HeartIcon,  colorKey: 'moodGreat' },
  good:    { Icon: SmileIcon,  colorKey: 'moodGood' },
  neutral: { Icon: MehIcon,    colorKey: 'moodNeutral' },
  hard:    { Icon: ToughIcon,   colorKey: 'moodHard' },
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function DayDetailScreen() {
  const Colors = useColors();
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!date) return;
    const load = async () => {
      setLoading(true);
      setSessions(await getSessionsForDate(date) as SessionRow[]);
      setLoading(false);
    };
    load();
  }, [date]);

  const totalMinutes = sessions.filter((s) => s.completedAt !== null).reduce((sum, s) => sum + s.durationMin, 0);

  const displayDate = date
    ? new Date(date.replace(/-/g, '/')).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown date';

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors.background }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: Colors.surfaceAlt }]}>
        <ArrowLeftIcon size={28} color={Colors.text} />
      </TouchableOpacity>

      <View style={styles.dateHeader}>
        <View style={[styles.dateIconWrap, { backgroundColor: Colors.primary + '15' }]}>
          <CalendarIcon size={24} color={Colors.primary} />
        </View>
        <Text style={[styles.dateText, { color: Colors.text }]}>{displayDate}</Text>
      </View>

      <DuoCard style={styles.summaryCard}>
        <Text style={[styles.summaryValue, { color: Colors.primary }]}>{totalMinutes}</Text>
        <Text style={[styles.summaryLabel, { color: Colors.textLight }]}>intentional minutes</Text>
      </DuoCard>

      {loading ? (
        <Text style={[styles.placeholder, { color: Colors.textLight }]}>Loading...</Text>
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
            const moodColor = moodInfo ? Colors[moodInfo.colorKey] : Colors.textMuted;
            return (
              <DuoCard key={session.id} style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <View style={styles.timeRow}>
                    <ClockIcon size={16} color={Colors.textMuted} />
                    <Text style={[styles.sessionTime, { color: Colors.textMuted }]}>
                      {formatTime(new Date(session.startedAt))}
                    </Text>
                  </View>
                  {moodInfo && <moodInfo.Icon size={28} color={moodColor} />}
                </View>
                <Text style={[styles.intentText, { color: Colors.text }]}>{session.intentText}</Text>
                <View style={[styles.durationBadge, { backgroundColor: Colors.primary + '15' }]}>
                  <Text style={[styles.durationText, { color: Colors.primary }]}>
                    {session.completedAt ? `${session.durationMin} min` : 'Incomplete'}
                  </Text>
                </View>
                {session.reflectionText ? (
                  <View style={[styles.reflectionBox, { backgroundColor: Colors.surface }]}>
                    <Text style={[styles.reflectionText, { color: Colors.textLight }]}>{session.reflectionText}</Text>
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
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  backButton: { marginTop: Spacing.xl, marginBottom: Spacing.md, width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  dateHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: Spacing.lg },
  dateIconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  dateText: { flex: 1, fontSize: 22, fontWeight: '900' },
  summaryCard: { alignItems: 'center', marginBottom: Spacing.lg },
  summaryValue: { fontSize: 48, fontWeight: '900' },
  summaryLabel: { fontSize: 14, fontWeight: '600', marginTop: 4 },
  placeholder: { fontSize: 16, fontWeight: '500', textAlign: 'center', marginTop: Spacing.xl },
  sessionList: { gap: Spacing.md },
  sessionCard: { padding: 20 },
  sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sessionTime: { fontSize: 13, fontWeight: '600' },
  intentText: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  durationBadge: { alignSelf: 'flex-start', borderRadius: Radii.pill, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 8 },
  durationText: { fontSize: 13, fontWeight: '800' },
  reflectionBox: { marginTop: 8, borderRadius: Radii.sm, padding: 12 },
  reflectionText: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
});