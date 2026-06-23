import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { getSessionsForDateRange, getLocalDateString } from '../../db/queries';

type SessionRow = {
  id: number;
  intentText: string;
  durationMin: number;
  startedAt: Date;
  completedAt: Date | null;
  mood: string | null;
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MS_PER_DAY = 86400000;

function getDateKey(d: Date): string {
  return getLocalDateString(d);
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

function addMonths(d: Date, months: number): Date {
  const next = new Date(d);
  next.setMonth(next.getMonth() + months);
  return next;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function CalendarScreen() {
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
      const key = getDateKey(new Date(session.startedAt));
      totals[key] = (totals[key] ?? 0) + (session.completedAt ? session.durationMin : 0);
    }
    setMinutesByDate(totals);
  }, [currentMonth]);

  useEffect(() => {
    loadMonthData();
  }, [loadMonthData]);

  const monthLabel = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const maxMinutes = Math.max(1, ...Object.values(minutesByDate));

  const weeks: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = Array(firstDayOfMonth).fill(null);

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(new Date(year, month, day));
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const intensityColor = (minutes: number): string => {
    if (minutes === 0) return Colors.border;
    const ratio = Math.min(minutes / maxMinutes, 1);
    const r = Math.round(88 + (107 - 88) * (1 - ratio));
    const g = Math.round(226 + (204 - 226) * (1 - ratio));
    const b = Math.round(25 + (2 - 25) * (1 - ratio));
    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleDayPress = (date: Date) => {
    const key = getDateKey(date);
    router.push(`/day/${key}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Calendar</Text>

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setCurrentMonth((m) => addMonths(m, -1))}
        >
          <Text style={styles.navButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setCurrentMonth((m) => addMonths(m, 1))}
        >
          <Text style={styles.navButtonText}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <View style={styles.weekRow}>
          {WEEKDAYS.map((day) => (
            <Text key={day} style={styles.weekdayHeader}>
              {day}
            </Text>
          ))}
        </View>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((date, dayIndex) => {
              if (!date) {
                return <View key={`${weekIndex}-${dayIndex}`} style={styles.emptyCell} />;
              }

              const key = getDateKey(date);
              const minutes = minutesByDate[key] ?? 0;
              const isToday = isSameDay(date, today);

              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.dayCell,
                    { backgroundColor: intensityColor(minutes) },
                    isToday && styles.todayCell,
                  ]}
                  onPress={() => handleDayPress(date)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dayText, minutes > 0 && styles.activeDayText]}>
                    {date.getDate()}
                  </Text>
                  {minutes > 0 && (
                    <Text style={styles.minuteText}>{minutes}m</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.legend}>
        <Text style={styles.legendLabel}>Less intentional</Text>
        <View style={styles.legendDots}>
          {[0.0, 0.25, 0.5, 0.75, 1.0].map((ratio) => (
            <View
              key={ratio}
              style={[
                styles.legendDot,
                {
                  backgroundColor: intensityColor(Math.round(ratio * maxMinutes) || 0),
                },
              ]}
            />
          ))}
        </View>
        <Text style={styles.legendLabel}>More intentional</Text>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  monthLabel: {
    ...Typography.subtitle,
    color: Colors.text,
  },
  navButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  navButtonText: {
    ...Typography.subtitle,
    color: Colors.primary,
  },
  grid: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  weekdayHeader: {
    flex: 1,
    textAlign: 'center',
    ...Typography.caption,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    margin: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  todayCell: {
    borderColor: Colors.secondary,
    borderWidth: 2,
  },
  emptyCell: {
    flex: 1,
    aspectRatio: 1,
    margin: 2,
  },
  dayText: {
    ...Typography.body,
    color: Colors.text,
  },
  activeDayText: {
    color: Colors.white,
    fontWeight: '600',
  },
  minuteText: {
    ...Typography.caption,
    color: Colors.white,
    marginTop: 2,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  legendLabel: {
    ...Typography.caption,
    color: Colors.textLight,
  },
  legendDots: {
    flexDirection: 'row',
    marginHorizontal: Spacing.sm,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginHorizontal: 2,
  },
});
