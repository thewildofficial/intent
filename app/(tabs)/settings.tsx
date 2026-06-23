import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { useNotifications } from '../../hooks/useNotifications';
import { useStreaks } from '../../hooks/useStreaks';
import { useExport, type ExportFormat } from '../../hooks/useExport';

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
  const { generateExport } = useExport();

  const handleToggle = async (enabled: boolean, setter: (v: boolean) => Promise<void>) => {
    if (enabled && !permission.granted) {
      await requestPermission();
    }
    await setter(enabled);
  };

  const handleExport = async (format: ExportFormat) => {
    try {
      await generateExport(format);
    } catch (e) {
      console.error('Export failed:', e);
    }
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
        <Text style={styles.sectionTitle}>Data Export</Text>
        <TouchableOpacity
          style={[styles.exportButton, { backgroundColor: Colors.primary }]}
          onPress={() => handleExport('markdown')}
        >
          <Text style={styles.exportButtonText}>Export as Markdown</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.exportButton, { backgroundColor: Colors.secondary }]}
          onPress={() => handleExport('csv')}
        >
          <Text style={styles.exportButtonText}>Export as CSV</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.exportButton, { backgroundColor: Colors.accent }]}
          onPress={() => handleExport('json')}
        >
          <Text style={[styles.exportButtonText, { color: Colors.text }]}>Export as JSON</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>Intent — Phase 3: Calendar Heatmap + Data Export</Text>
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
  exportButton: {
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  exportButtonText: {
    ...Typography.subtitle,
    color: Colors.white,
    fontWeight: '600',
  },
});
