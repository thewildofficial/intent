import { Slot } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../db/migrations/migrations';
import { db } from '../db/db';
import { useState, useEffect } from 'react';

function MigrationGate({ children }: { children: React.ReactNode }) {
  const { success, error } = useMigrations(db, migrations);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (success) {
      setIsReady(true);
    }
    if (error) {
      console.error('Migration error:', error);
    }
  }, [success, error]);

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <View style={styles.loadingContent}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return children;
}

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="intent.db">
      <MigrationGate>
        <View style={styles.container}>
          <Slot />
          <StatusBar style="auto" />
        </View>
      </MigrationGate>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFDF7',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#3C3C3C',
  },
});
