import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useColors, Spacing, Radii } from '../../constants/theme';
import { getSessionsForDateRange, getLocalDateString } from '../../db/queries';
import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon } from '../../components/Icons';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function startOfMonth(d: Date): Date { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d: Date): Date { return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999); }
function addMonths(d: Date, months: number): Date { const n = new Date(d); n.setMonth(n.getMonth() + months); return n; }
function isSameDay(a: Date, b: Date): boolean { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }

function getHeatColor(minutes: number, maxMinutes: number, Colors: ReturnType<typeof useColors>): string {
  if (minutes === 0 || maxMinutes === 0) return Colors.heat0;
  const ratio = minutes / maxMinutes;
  if (ratio < 0.25) return Colors.heat1;
  if (ratio < 0.5) return Colors.heat2;
  if (ratio < 0.75) return Colors.heat3;
  return Colors.heat4;
}

export default function CalendarScreen() {
  const Colors = useColors();
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [minutesByDate, setMinutesByDate] = useState<Record<string, number>>({});
  const today = new Date();

  const loadMonthData = useCallback(async () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const sessions = await getSessionsForDateRange(start, end);
    const totals: Record<string, number> = {};
    for (const session of sessions) {
      const key = getLocalDateString(new Date(session.startedAt));
      totals[key] = (totals[key] ?? 0) + (session.completedAt ? session.durationMin : 0);
    }
    setMinutesByDate(totals);
  }, [currentMonth]);

  useEffect(() => { loadMonthData(); }, [loadMonthData]);

  const monthLabel = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const maxMinutes = Math.max(1, ...Object.values(minutesByDate));

  const weeks: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = Array(firstDayOfMonth).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(new Date(year, month, day));
    if (currentWeek.length === 7) { weeks.push(currentWeek); currentWeek = []; }
  }
  if (currentWeek.length > 0) { while (currentWeek.length < 7) currentWeek.push(null); weeks.push(currentWeek); }

  const handleDayPress = (date: Date) => { router.push(`/day/${getLocalDateString(date)}`); };

  const HEAT_COLORS = [Colors.heat0, Colors.heat1, Colors.heat2, Colors.heat3, Colors.heat4];

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.titleRow}>
        <View style={[styles.titleIconWrap, { backgroundColor: Colors.primary + '15' }]}>
          <CalendarIcon size={24} color={Colors.primary} />
        </View>
        <Text style={[styles.title, { color: Colors.text }]}>Calendar</Text>
      </View>

      <View style={styles.monthNav}>
        <TouchableOpacity style={[styles.navButton, { backgroundColor: Colors.cardBg, borderColor: Colors.borderLight }]} onPress={() => setCurrentMonth((m) => addMonths(m, -1))}>
          <ArrowLeftIcon size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.monthLabel, { color: Colors.text }]}>{monthLabel}</Text>
        <TouchableOpacity style={[styles.navButton, { backgroundColor: Colors.cardBg, borderColor: Colors.borderLight }]} onPress={() => setCurrentMonth((m) => addMonths(m, 1))}>
          <ArrowRightIcon size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.grid, { backgroundColor: Colors.cardBg, borderColor: Colors.borderLight }]}>
        <View style={styles.weekHeaderRow}>
          {WEEKDAYS.map((day, i) => (
            <Text key={i} style={[styles.weekdayHeader, { color: Colors.textMuted }]}>{day}</Text>
          ))}
        </View>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((date, dayIndex) => {
              if (!date) return <View key={`${weekIndex}-${dayIndex}`} style={styles.emptyCell} />;
              const key = getLocalDateString(date);
              const minutes = minutesByDate[key] ?? 0;
              const isToday = isSameDay(date, today);
              const heatColor = getHeatColor(minutes, maxMinutes, Colors);
              const hasActivity = minutes > 0;
              return (
                <TouchableOpacity
                  key={key}
                  style={[styles.dayCell, { backgroundColor: heatColor }, isToday && { borderColor: Colors.secondary, borderWidth: 3 }]}
                  onPress={() => handleDayPress(date)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dayText, !hasActivity && { color: Colors.textLight }, hasActivity && { color: Colors.white, fontWeight: '800' }]}>
                    {date.getDate()}
                  </Text>
                  {hasActivity && <Text style={[styles.minuteText, { color: Colors.white }]}>{minutes}m</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.legend}>
        <Text style={[styles.legendLabel, { color: Colors.textLight }]}>Less</Text>
        <View style={styles.legendDots}>
          {HEAT_COLORS.map((color, i) => (
            <View key={i} style={[styles.legendDot, { backgroundColor: color }]} />
          ))}
        </View>
        <Text style={[styles.legendLabel, { color: Colors.textLight }]}>More</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: Spacing.xxl, marginBottom: Spacing.xl },
  titleIconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '900' },
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.lg },
  navButton: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  monthLabel: { fontSize: 18, fontWeight: '800' },
  grid: { borderRadius: Radii.lg, borderWidth: 2, padding: Spacing.md },
  weekHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  weekdayHeader: { flex: 1, textAlign: 'center', fontSize: 13, fontWeight: '700' },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  dayCell: { flex: 1, aspectRatio: 1, margin: 2, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  emptyCell: { flex: 1, aspectRatio: 1, margin: 2 },
  dayText: { fontSize: 15, fontWeight: '600' },
  minuteText: { fontSize: 10, fontWeight: '700', marginTop: 2 },
  legend: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: Spacing.lg, gap: 8 },
  legendLabel: { fontSize: 13, fontWeight: '600' },
  legendDots: { flexDirection: 'row', gap: 4 },
  legendDot: { width: 16, height: 16, borderRadius: 8 },
});