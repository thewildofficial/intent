import { Slot, useRouter, usePathname } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import * as Notifications from 'expo-notifications';
import { Component, type ReactNode } from 'react';
import migrations from '../db/migrations/migrations';
import { useState, useEffect } from 'react';
import { Colors, Spacing, Typography } from '../constants/theme';
import { useDB } from '../db/client';
import { settings } from '../db/schema';
import { eq } from 'drizzle-orm';
import { db } from '../db/db';

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

function OnboardingGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const db = useDB();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const result = await db.select().from(settings).where(eq(settings.key, 'onboardingComplete'));
        const raw = result[0]?.value ?? null;
        const complete = raw === null ? false : raw === 'true';
        if (mounted) {
          setOnboardingComplete(complete);
        }
      } catch (e) {
        console.error('Failed to check onboarding status:', e);
        if (mounted) {
          setOnboardingComplete(true);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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

  return <OnboardingGate>{children}</OnboardingGate>;
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
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => {
              this.setState({ hasError: false, error: null });
            }}
          >
            <Text style={styles.errorButtonText}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <SQLiteProvider databaseName="intent.db">
        <MigrationGate>
          <View style={styles.container}>
            <Slot />
            <StatusBar style="auto" />
          </View>
        </MigrationGate>
      </SQLiteProvider>
    </ErrorBoundary>
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
    backgroundColor: Colors.background,
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body,
    color: Colors.text,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  errorEmoji: {
    fontSize: 56,
    marginBottom: Spacing.md,
  },
  errorTitle: {
    ...Typography.title,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  errorMessage: {
    ...Typography.body,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  errorButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  errorButtonText: {
    ...Typography.subtitle,
    color: Colors.white,
    fontWeight: '600',
  },
});
