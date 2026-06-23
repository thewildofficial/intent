import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radii } from '../../constants/theme';
import { useNotifications } from '../../hooks/useNotifications';
import { useStreaks } from '../../hooks/useStreaks';
import { useExport, type ExportFormat } from '../../hooks/useExport';
import { SettingsIcon, FireIcon, BellIcon, DownloadIcon, TargetIcon } from '../../components/Icons';
import { DuoCard, DuoButton } from '../../components/DuoButton';

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
      {/* Title */}
      <View style={styles.titleRow}>
        <View style={styles.titleIconWrap}>
          <SettingsIcon size={24} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Streak card */}
      <DuoCard style={styles.streakCard}>
        <View style={styles.streakCardLeft}>
          <View style={styles.streakIconWrap}>
            <FireIcon size={28} color={Colors.flame} />
          </View>
          <View>
            <Text style={styles.streakCardLabel}>Current streak</Text>
            <Text style={styles.streakCardDays}>
              {current} {current === 1 ? 'day' : 'days'}
            </Text>
          </View>
        </View>
      </DuoCard>

      {/* Notifications section */}
      <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
      <DuoCard style={styles.section}>
        <View style={styles.sectionHeader}>
          <BellIcon size={20} color={Colors.secondary} />
          <Text style={styles.sectionTitle}>Reminders</Text>
        </View>
        {!permission.granted && (
          <Text style={styles.permissionHint}>
            Notification permission is required for reminders.
          </Text>
        )}

        <SettingToggle
          label="Daily Reminder"
          value={dailyReminderEnabled}
          onValueChange={(v) => handleToggle(v, setDailyReminderEnabled)}
        />
        <SettingToggle
          label="Session Complete"
          value={sessionCompleteEnabled}
          onValueChange={(v) => handleToggle(v, setSessionCompleteEnabled)}
        />
        <SettingToggle
          label="Streak Warning"
          value={streakWarningEnabled}
          onValueChange={(v) => handleToggle(v, setStreakWarningEnabled)}
          last
        />
      </DuoCard>

      {/* Export section */}
      <Text style={styles.sectionLabel}>DATA EXPORT</Text>
      <DuoCard style={styles.section}>
        <View style={styles.sectionHeader}>
          <DownloadIcon size={20} color={Colors.accent} />
          <Text style={styles.sectionTitle}>Export your data</Text>
        </View>
        <View style={styles.exportButtons}>
          <DuoButton
            label="Markdown"
            onPress={() => handleExport('markdown')}
            variant="primary"
            size="sm"
            fullWidth
          />
          <DuoButton
            label="CSV"
            onPress={() => handleExport('csv')}
            variant="secondary"
            size="sm"
            fullWidth
          />
          <DuoButton
            label="JSON"
            onPress={() => handleExport('json')}
            variant="accent"
            size="sm"
            fullWidth
          />
        </View>
      </DuoCard>

      {/* About */}
      <Text style={styles.sectionLabel}>ABOUT</Text>
      <DuoCard style={styles.aboutCard}>
        <View style={styles.aboutRow}>
          <TargetIcon size={28} color={Colors.primary} />
          <View>
            <Text style={styles.aboutTitle}>Intent</Text>
            <Text style={styles.aboutText}>Commit to one thing. Focus. Reflect.</Text>
          </View>
        </View>
      </DuoCard>
    </ScrollView>
  );
}

// ── Toggle row component ──────────────────────────────────────
function SettingToggle({
  label,
  value,
  onValueChange,
  last = false,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  last?: boolean;
}) {
  return (
    <View style={[styles.setting, !last && styles.settingBorder]}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.surfaceAlt, true: Colors.primary }}
        thumbColor={Colors.white}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  titleIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.text,
  },
  streakCard: {
    marginBottom: Spacing.xl,
  },
  streakCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  streakIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.flame + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakCardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textLight,
  },
  streakCardDays: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.text,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: 8,
    marginLeft: 4,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  permissionHint: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.error,
    marginBottom: 12,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  exportButtons: {
    gap: 10,
  },
  aboutCard: {
    marginBottom: Spacing.xl,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.text,
  },
  aboutText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textLight,
    marginTop: 2,
  },
});