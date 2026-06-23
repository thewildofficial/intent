import { useCallback } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { formatMarkdown, formatCSV, formatJSON } from '../utils/export';
import { getSessionsForDateRange, getAllStreaks, getLocalDateString } from '../db/queries';

export type ExportFormat = 'markdown' | 'csv' | 'json';

const FORMAT_CONFIG: Record<
  ExportFormat,
  {
    extension: string;
    mimeType: string;
    filename: string;
  }
> = {
  markdown: {
    extension: 'md',
    mimeType: 'text/markdown',
    filename: 'intent-sessions.md',
  },
  csv: {
    extension: 'csv',
    mimeType: 'text/csv',
    filename: 'intent-sessions.csv',
  },
  json: {
    extension: 'json',
    mimeType: 'application/json',
    filename: 'intent-export.json',
  },
};

function parseLocalDate(dateString: string): Date {
  return new Date(dateString.replace(/-/g, '/'));
}

export function useExport() {
  const generateExport = useCallback(async (format: ExportFormat) => {
    const end = new Date();
    const start = new Date(end);
    start.setFullYear(start.getFullYear() - 1);

    const sessions = await getSessionsForDateRange(start, end);
    const streaks = format === 'json' ? await getAllStreaks() : [];

    const normalizedSessions = sessions.map((session) => ({
      id: session.id,
      intentText: session.intentText,
      durationMin: session.durationMin,
      startedAt: new Date(session.startedAt),
      completedAt: session.completedAt ? new Date(session.completedAt) : null,
      mood: session.mood,
      reflectionText: session.reflectionText,
      timezone: session.timezone,
    }));

    const normalizedStreaks = streaks.map((streak) => ({
      date: streak.date,
      isIntentional: streak.isIntentional,
      currentStreakCount: streak.currentStreakCount,
      longestStreakCount: streak.longestStreakCount,
    }));

    let content: string;
    switch (format) {
      case 'markdown':
        content = formatMarkdown(normalizedSessions);
        break;
      case 'csv':
        content = formatCSV(normalizedSessions);
        break;
      case 'json':
      default:
        content = formatJSON(normalizedSessions, normalizedStreaks);
        break;
    }

    const config = FORMAT_CONFIG[format];
    const dateStamp = getLocalDateString(new Date());
    const filename = `intent-${format}-${dateStamp}.${config.extension}`;
    const fileUri = `${FileSystem.cacheDirectory}${filename}`;

    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: config.mimeType,
        dialogTitle: `Export Intent ${format.toUpperCase()}`,
        UTI: config.extension === 'md' ? 'net.daringfireball.markdown' : config.extension,
      });
    }

    return fileUri;
  }, []);

  return { generateExport };
}
