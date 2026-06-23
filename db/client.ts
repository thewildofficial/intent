import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import * as schema from './schema';

export function useDB() {
  const sqlite = useSQLiteContext();
  return drizzle(sqlite, { schema });
}
