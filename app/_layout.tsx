import { Slot, useRouter, usePathname } from 'expo-router';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import * as Notifications from 'expo-notifications';
import * as NavigationBar from 'expo-navigation-bar';
import * as SystemUI from 'expo-system-ui';
import { Component, type ReactNode } from 'react';
import migrations from '../db/migrations/migrations';
import { useState, useEffect } from 'react';
import { useColors, Spacing, Typography, lightColors, darkColors } from '../constants/theme';
import { setActiveDb, db } from '../db/db';
import { settings } from '../db/schema';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '../db/schema';
import { useUIStore } from '../stores/uiStore';

try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
} catch (e) {
  console.log('Notifications not available in this environment:', e);
}

// This component bridges the SQLiteProvider context to the global db.
function DbBridge({ children }: { children: React.ReactNode }) {
  const sqlite = useSQLiteContext();
  useEffect(() => {
    const providerDb = drizzle(sqlite, { schema });
    setActiveDb(providerDb);
  }, [sqlite]);

  return <>{children}</>;
}

function OnboardingGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const sqlite = useSQLiteContext();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const providerDb = drizzle(sqlite, { schema });
        setActiveDb(providerDb);
        const result = await providerDb.select().from(settings).where(eq(settings.key, 'onboardingComplete'));
        const raw = result[0]?.value ?? null;
        const complete = raw === null ? false : raw === 'true';
        if (mounted) setOnboardingComplete(complete);
      } catch (e) {
        console.error('Failed to check onboarding status:', e);
        if (mounted) setOnboardingComplete(true);
      }
    })();
    return () => { mounted = false; };
  }, [sqlite]);

  useEffect(() => {
    if (onboardingComplete === false && pathname !== '/onboarding') {
      router.replace('/onboarding');
    }
  }, [onboardingComplete, pathname]);

  return <>{children}</>;
}

function MigrationGate({ children }: { children: React.ReactNode }) {
  const { success, error } = useMigrations(db, migrations);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (success) setIsReady(true);
    if (error) console.error('Migration error:', error);
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

  return <DbBridge><OnboardingGate>{children}</OnboardingGate></DbBridge>;
}

// Syncs the Android system nav bar + root background with the active theme.
function ThemeSync({ themeMode }: { themeMode: 'light' | 'dark' }) {
  const Colors = useColors();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(Colors.background);

    if (Platform.OS === 'android') {
      try {
        NavigationBar.setBackgroundColorAsync(Colors.background);
        NavigationBar.setButtonStyleAsync(themeMode === 'dark' ? 'light' : 'dark');
      } catch {
        // edge-to-edge mode doesn't support some nav bar APIs — safe to ignore
      }
    }
  }, [Colors.background, Colors.borderLight, themeMode]);

  return null;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorScreen error={this.state.error} onRetry={() => this.setState({ hasError: false, error: null })} />;
    }
    return this.props.children;
  }
}

function ErrorScreen({ error, onRetry }: { error: Error | null; onRetry: () => void }) {
  const Colors = useColors();
  return (
    <View style={[styles.errorContainer, { backgroundColor: Colors.background }]}>
      <Text style={[styles.errorTitle, { color: Colors.text }]}>Something went wrong</Text>
      <Text style={[styles.errorMessage, { color: Colors.textLight }]}>
        {error?.message ?? 'An unexpected error occurred.'}
      </Text>
      <TouchableOpacity
        style={[styles.errorButton, { backgroundColor: Colors.primary }]}
        onPress={onRetry}
      >
        <Text style={[styles.errorButtonText, { color: Colors.white }]}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function RootLayout() {
  const themeMode = useUIStore((s) => s.themeMode);
  const bg = themeMode === 'dark' ? darkColors.background : lightColors.background;

  return (
    <ErrorBoundary>
      <SQLiteProvider databaseName="intent.db">
        <ThemeSync themeMode={themeMode} />
        <MigrationGate>
          <View style={[styles.container, { backgroundColor: bg }]}>
            <Slot />
            <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
          </View>
        </MigrationGate>
      </SQLiteProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingContent: { alignItems: 'center' },
  loadingText: { ...Typography.body },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
  errorTitle: { ...Typography.title, marginBottom: Spacing.sm, textAlign: 'center' },
  errorMessage: { ...Typography.body, textAlign: 'center', marginBottom: Spacing.xl },
  errorButton: { borderRadius: 12, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },
  errorButtonText: { ...Typography.subtitle, fontWeight: '600' },
});