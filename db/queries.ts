import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';
import { sessions, streaks, settings } from './schema';
import { getDb } from './db';

// All query functions use getDb() which returns the active connection.
// Initially this is the module-level db from db.ts, but after
// SQLiteProvider initializes, MigrationGate calls setActiveDb() to
// switch to the provider's connection — ensuring a single native handle.

function getDeviceTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function getLocalDateParts(d: Date = new Date()): {
  year: number;
  month: number;
  day: number;
} {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: getDeviceTimezone(),
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(d);

  const get = (type: string) =>
    parseInt(parts.find((p) => p.type === type)?.value ?? '0', 10);

  return { year: get('year'), month: get('month'), day: get('day') };
}

export function getLocalDateString(d: Date = new Date()): string {
  const { year, month, day } = getLocalDateParts(d);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function getLocalStartAndEnd(dateString: string): { start: Date; end: Date } {
  const [year, month, day] = dateString.split('-').map(Number);
  const start = new Date(Date.UTC(year, month - 1, day));
  const end = new Date(Date.UTC(year, month - 1, day + 1) - 1);
  return { start, end };
}

export function getTodayDateString(): string {
  return getLocalDateString(new Date());
}

export async function createSession(data: typeof sessions.$inferInsert) {
  return getDb().insert(sessions).values(data).returning();
}

export async function completeSession(id: number, data: { completedAt: Date; reflectionText?: string; mood?: string }) {
  return getDb().update(sessions).set(data).where(eq(sessions.id, id));
}

export async function getTodaySessions() {
  return getSessionsForDate(getTodayDateString());
}

export async function getSessionsForDate(dateString: string) {
  const { start, end } = getLocalStartAndEnd(dateString);
  return getDb().select().from(sessions).where(
    and(gte(sessions.startedAt, start), lte(sessions.startedAt, end))
  );
}

export async function getSessionsForDateRange(start: Date, end: Date) {
  return getDb().select().from(sessions).where(
    and(gte(sessions.startedAt, start), lte(sessions.startedAt, end))
  );
}

export async function getStreak(date: string) {
  const result = await getDb().select().from(streaks).where(eq(streaks.date, date));
  return result[0] ?? null;
}

export async function getAllStreaks() {
  return getDb().select().from(streaks).orderBy(desc(streaks.date));
}

export async function recordStreak(data: typeof streaks.$inferInsert) {
  return getDb().insert(streaks).values(data).onConflictDoUpdate({
    target: streaks.date,
    set: data,
  });
}

export async function recomputeStreaks(): Promise<void> {
  const db = getDb();
  const rows = await db
    .select({
      date: sql<string>`strftime('%Y-%m-%d', datetime(${sessions.completedAt} / 1000, 'unixepoch', 'localtime') )`,
    })
    .from(sessions)
    .where(sql`${sessions.completedAt} IS NOT NULL`)
    .groupBy(sql`strftime('%Y-%m-%d', datetime(${sessions.completedAt} / 1000, 'unixepoch', 'localtime'))`);

  const intentionalDates = new Set(rows.map((r) => r.date));
  if (intentionalDates.size === 0) return;

  const sortedIntentional = Array.from(intentionalDates).sort();
  const earliest = sortedIntentional[0];
  const today = getTodayDateString();
  const dateList = generateDateRange(earliest, today);

  let current = 0;
  let longest = 0;
  const nowMs = Date.now();

  for (const date of dateList) {
    if (intentionalDates.has(date)) {
      current += 1;
    } else {
      current = 0;
    }
    longest = Math.max(longest, current);
    await recordStreak({
      date,
      isIntentional: intentionalDates.has(date),
      currentStreakCount: current,
      longestStreakCount: longest,
      updatedAt: new Date(nowMs),
    });
  }
}

function generateDateRange(startStr: string, endStr: string): string[] {
  const result: string[] = [];
  const [sYear, sMonth, sDay] = startStr.split('-').map(Number);
  const [eYear, eMonth, eDay] = endStr.split('-').map(Number);

  let cursor = new Date(Date.UTC(sYear, sMonth - 1, sDay));
  const end = new Date(Date.UTC(eYear, eMonth - 1, eDay));

  while (cursor <= end) {
    result.push(
      `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, '0')}-${String(cursor.getUTCDate()).padStart(2, '0')}`
    );
    cursor = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), cursor.getUTCDate() + 1));
  }

  return result;
}

export async function getSetting(key: string) {
  const result = await getDb().select().from(settings).where(eq(settings.key, key));
  return result[0]?.value ?? null;
}

export async function setSetting(key: string, value: string) {
  return getDb().insert(settings).values({ key, value }).onConflictDoUpdate({
    target: settings.key,
    set: { value },
  });
}

export async function getBooleanSetting(key: string, defaultValue = false): Promise<boolean> {
  const raw = await getSetting(key);
  if (raw === null) return defaultValue;
  return raw === 'true';
}

export async function setBooleanSetting(key: string, value: boolean) {
  return setSetting(key, value ? 'true' : 'false');
}