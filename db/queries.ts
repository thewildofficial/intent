import { eq, and, gte, lte } from 'drizzle-orm';
import { sessions, streaks, settings } from './schema';
import { db } from './db';

// Session queries
export async function createSession(data: typeof sessions.$inferInsert) {
  return db.insert(sessions).values(data).returning();
}

export async function completeSession(id: number, data: { completedAt: Date; reflectionText?: string; mood?: string }) {
  return db.update(sessions).set(data).where(eq(sessions.id, id));
}

export async function getTodaySessions() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);
  
  return db.select().from(sessions).where(
    and(
      gte(sessions.startedAt, startOfDay),
      lte(sessions.startedAt, endOfDay)
    )
  );
}

export async function getSessionsForDateRange(start: Date, end: Date) {
  return db.select().from(sessions).where(
    and(
      gte(sessions.startedAt, start),
      lte(sessions.startedAt, end)
    )
  );
}

// Streak queries
export async function getStreak(date: string) {
  return db.select().from(streaks).where(eq(streaks.date, date));
}

export async function recordStreak(data: typeof streaks.$inferInsert) {
  return db.insert(streaks).values(data).onConflictDoUpdate({
    target: streaks.date,
    set: data,
  });
}

// Settings queries
export async function getSetting(key: string) {
  const result = await db.select().from(settings).where(eq(settings.key, key));
  return result[0]?.value ?? null;
}

export async function setSetting(key: string, value: string) {
  return db.insert(settings).values({ key, value }).onConflictDoUpdate({
    target: settings.key,
    set: { value },
  });
}
