// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';

const m0000 = `
CREATE TABLE \`sessions\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`intent_text\` text NOT NULL,
	\`duration_min\` integer NOT NULL,
	\`started_at\` integer NOT NULL,
	\`completed_at\` integer,
	\`timezone\` text NOT NULL,
	\`reflection_text\` text,
	\`mood\` text,
	\`created_at\` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE \`settings\` (
	\`key\` text PRIMARY KEY NOT NULL,
	\`value\` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE \`streaks\` (
	\`date\` text PRIMARY KEY NOT NULL,
	\`is_intentional\` integer DEFAULT false NOT NULL,
	\`current_streak_count\` integer DEFAULT 0 NOT NULL,
	\`longest_streak_count\` integer DEFAULT 0 NOT NULL,
	\`updated_at\` integer NOT NULL
);
`;

export default {
  journal,
  migrations: {
    m0000
  }
}