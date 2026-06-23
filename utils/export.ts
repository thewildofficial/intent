export type ExportSession = {
  id: number;
  intentText: string;
  durationMin: number;
  startedAt: Date;
  completedAt: Date | null;
  mood: string | null;
  reflectionText: string | null;
  timezone: string;
};

export type ExportStreak = {
  date: string;
  isIntentional: boolean;
  currentStreakCount: number;
  longestStreakCount: number;
};

const MOOD_LABEL: Record<string, string> = {
  great: 'Great',
  good: 'Good',
  neutral: 'Neutral',
  hard: 'Hard',
};

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function escapeCsv(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function formatMarkdown(sessions: ExportSession[]): string {
  const totalMinutes = sessions
    .filter((s) => s.completedAt)
    .reduce((sum, s) => sum + s.durationMin, 0);

  const title = `# Intent Sessions Export\n\n`;
  const summary = `**Total intentional minutes:** ${totalMinutes}\n\n`;

  if (sessions.length === 0) {
    return `${title}${summary}_No sessions recorded._\n`;
  }

  const groups: Record<string, ExportSession[]> = {};
  for (const session of sessions) {
    const dateKey = formatDate(new Date(session.startedAt));
    groups[dateKey] = [...(groups[dateKey] ?? []), session];
  }

  let body = '';
  for (const [date, daySessions] of Object.entries(groups).sort()) {
    body += `## ${date}\n\n`;
    for (const session of daySessions) {
      const status = session.completedAt ? `${session.durationMin} min` : 'Incomplete';
      const mood = session.mood ? MOOD_LABEL[session.mood] ?? session.mood : 'No mood';
      body += `- **${formatTime(new Date(session.startedAt))}** — ${session.intentText} (${status}, ${mood})\n`;
      if (session.reflectionText) {
        body += `  - Reflection: ${session.reflectionText}\n`;
      }
    }
    body += '\n';
  }

  return `${title}${summary}${body}`;
}

export function formatCSV(sessions: ExportSession[]): string {
  const headers = ['Date', 'Time', 'Intent', 'Duration (min)', 'Status', 'Mood', 'Reflection'];
  const rows = sessions.map((session) => {
    const started = new Date(session.startedAt);
    return [
      formatDate(started),
      formatTime(started),
      session.intentText,
      session.durationMin,
      session.completedAt ? 'Completed' : 'Incomplete',
      session.mood ? MOOD_LABEL[session.mood] ?? session.mood : '',
      session.reflectionText ?? '',
    ];
  });

  return [headers, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n');
}

export function formatJSON(
  sessions: ExportSession[],
  streaks: ExportStreak[]
): string {
  const payload = {
    exportedAt: new Date().toISOString(),
    totalSessions: sessions.length,
    totalIntentionalMinutes: sessions
      .filter((s) => s.completedAt)
      .reduce((sum, s) => sum + s.durationMin, 0),
    sessions: sessions.map((session) => ({
      id: session.id,
      intent: session.intentText,
      durationMinutes: session.durationMin,
      startedAt: session.startedAt.toISOString(),
      completedAt: session.completedAt?.toISOString() ?? null,
      mood: session.mood,
      reflection: session.reflectionText,
      timezone: session.timezone,
    })),
    streaks: streaks.map((streak) => ({
      date: streak.date,
      isIntentional: streak.isIntentional,
      currentStreak: streak.currentStreakCount,
      longestStreak: streak.longestStreakCount,
    })),
  };

  return JSON.stringify(payload, null, 2);
}
