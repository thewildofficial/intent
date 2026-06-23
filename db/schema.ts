import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const sessions = sqliteTable('sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  intentText: text('intent_text').notNull(),
  durationMin: integer('duration_min').notNull(),
  startedAt: integer('started_at', { mode: 'timestamp_ms' }).notNull(),
  completedAt: integer('completed_at', { mode: 'timestamp_ms' }),
  timezone: text('timezone').notNull(),
  reflectionText: text('reflection_text'),
  mood: text('mood'), // 'great' | 'good' | 'neutral' | 'hard' | null
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

export const streaks = sqliteTable('streaks', {
  date: text('date').primaryKey(), // YYYY-MM-DD in device timezone
  isIntentional: integer('is_intentional', { mode: 'boolean' }).notNull().default(false),
  currentStreakCount: integer('current_streak_count').notNull().default(0),
  longestStreakCount: integer('longest_streak_count').notNull().default(0),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});
