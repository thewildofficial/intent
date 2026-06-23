import { openDatabaseSync } from 'expo-sqlite';
import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

// We create an initial connection for use by useMigrations (which runs
// before SQLiteProvider context is available). After SQLiteProvider
// initializes, MigrationGate calls setActiveDb() with the provider's
// connection so all subsequent queries share a single native handle.
const sqlite = openDatabaseSync('intent.db');
const initialDb = drizzle(sqlite, { schema });

type Db = ExpoSQLiteDatabase<typeof schema>;

let activeDb: Db = initialDb;

export function setActiveDb(db: Db): void {
  activeDb = db;
}

export function getDb(): Db {
  return activeDb;
}

// Also export the initial db for useMigrations in _layout.tsx
export const db = initialDb;