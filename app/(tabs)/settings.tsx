import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { useNotifications } from '../../hooks/useNotifications';
import { useStreaks } from '../../hooks/useStreaks';

export default function SettingsScreen() {
  const { current } = useStreaks();
  const {
    permission,
    dailyReminderEnabled,
    sessionCompleteEnabled,
    streakWarningEnabled,
    setDailyReminderEnabled,
    setSessionCompleteEnabled,
    setStreakWarningEnabled,
    requestPermission,
  } = useNotifications(current);

  const handleToggle = async (enabled: boolean, setter: (v: boolean) => Promise<void>) => {
    if (enabled && !permission.granted) {
      await requestPermission();
    }
    await setter(enabled);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.streakCard}>
        <Text style={styles.streakValue}>{current}</Text>
        <Text style={styles.streakLabel}>Current streak days</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        {!permission.granted && (
          <Text style={styles.permissionHint}>
            Notification permission is required for reminders.
          </Text>
        )}

        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Daily Reminder</Text>
          <Switch
            value={dailyReminderEnabled}
            onValueChange={(v) => handleToggle(v, setDailyReminderEnabled)}
            trackColor={{ false: Colors.border, true: Colors.primary }}
          />
        </View>

        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Session Complete</Text>
          <Switch
            value={sessionCompleteEnabled}
            onValueChange={(v) => handleToggle(v, setSessionCompleteEnabled)}
            trackColor={{ false: Colors.border, true: Colors.primary }}
          />
        </View>

        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Streak Warning</Text>
          <Switch
            value={streakWarningEnabled}
            onValueChange={(v) => handleToggle(v, setStreakWarningEnabled)}
            trackColor={{ false: Colors.border, true: Colors.primary }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>Intent — Phase 2: Streaks + Daily Review + Notifications</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  title: {
    ...Typography.title,
    color: Colors.text,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  streakCard: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  streakValue: {
    ...Typography.display,
    color: Colors.primary,
  },
  streakLabel: {
    ...Typography.caption,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.subtitle,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  permissionHint: {
    ...Typography.caption,
    color: Colors.error,
    marginBottom: Spacing.md,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLabel: {
    ...Typography.body,
    color: Colors.text,
  },
  aboutText: {
    ...Typography.body,
    color: Colors.textLight,
  },
});
