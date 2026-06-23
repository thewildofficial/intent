import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { useColors, Spacing, Radii } from '../../constants/theme';
import { useNotifications } from '../../hooks/useNotifications';
import { useStreaks } from '../../hooks/useStreaks';
import { useExport, type ExportFormat } from '../../hooks/useExport';
import { useUIStore } from '../../stores/uiStore';
import { SettingsIcon, FireIcon, BellIcon, DownloadIcon, TargetIcon } from '../../components/Icons';
import { DuoCard, DuoButton } from '../../components/DuoButton';

export default function SettingsScreen() {
  const Colors = useColors();
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
  const { themeMode, toggleTheme } = useUIStore();

  const handleToggle = async (enabled: boolean, setter: (v: boolean) => Promise<void>) => {
    if (enabled && !permission.granted) await requestPermission();
    await setter(enabled);
  };

  const handleExport = async (format: ExportFormat) => {
    try { await generateExport(format); } catch (e) { console.error('Export failed:', e); }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.titleRow}>
        <View style={[styles.titleIconWrap, { backgroundColor: Colors.primary + '15' }]}>
          <SettingsIcon size={24} color={Colors.primary} />
        </View>
        <Text style={[styles.title, { color: Colors.text }]}>Settings</Text>
      </View>

      {/* Streak card */}
      <DuoCard style={styles.streakCard}>
        <View style={styles.streakCardLeft}>
          <View style={[styles.streakIconWrap, { backgroundColor: Colors.flame + '18' }]}>
            <FireIcon size={28} color={Colors.flame} />
          </View>
          <View>
            <Text style={[styles.streakCardLabel, { color: Colors.textLight }]}>Current streak</Text>
            <Text style={[styles.streakCardDays, { color: Colors.text }]}>
              {current} {current === 1 ? 'day' : 'days'}
            </Text>
          </View>
        </View>
      </DuoCard>

      {/* Appearance */}
      <Text style={[styles.sectionLabel, { color: Colors.textMuted }]}>APPEARANCE</Text>
      <DuoCard style={styles.section}>
        <SettingToggle
          label="Dark Mode"
          value={themeMode === 'dark'}
          onValueChange={() => toggleTheme()}
          Colors={Colors}
        />
      </DuoCard>

      {/* Notifications */}
      <Text style={[styles.sectionLabel, { color: Colors.textMuted }]}>NOTIFICATIONS</Text>
      <DuoCard style={styles.section}>
        <View style={styles.sectionHeader}>
          <BellIcon size={20} color={Colors.secondary} />
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Reminders</Text>
        </View>
        {!permission.granted && (
          <Text style={[styles.permissionHint, { color: Colors.error }]}>
            Notification permission is required for reminders.
          </Text>
        )}
        <SettingToggle label="Daily Reminder" value={dailyReminderEnabled} onValueChange={(v) => handleToggle(v, setDailyReminderEnabled)} Colors={Colors} />
        <SettingToggle label="Session Complete" value={sessionCompleteEnabled} onValueChange={(v) => handleToggle(v, setSessionCompleteEnabled)} Colors={Colors} />
        <SettingToggle label="Streak Warning" value={streakWarningEnabled} onValueChange={(v) => handleToggle(v, setStreakWarningEnabled)} Colors={Colors} last />
      </DuoCard>

      {/* Export */}
      <Text style={[styles.sectionLabel, { color: Colors.textMuted }]}>DATA EXPORT</Text>
      <DuoCard style={styles.section}>
        <View style={styles.sectionHeader}>
          <DownloadIcon size={20} color={Colors.accent} />
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Export your data</Text>
        </View>
        <View style={styles.exportButtons}>
          <DuoButton label="Markdown" onPress={() => handleExport('markdown')} variant="primary" size="sm" fullWidth />
          <DuoButton label="CSV" onPress={() => handleExport('csv')} variant="secondary" size="sm" fullWidth />
          <DuoButton label="JSON" onPress={() => handleExport('json')} variant="accent" size="sm" fullWidth />
        </View>
      </DuoCard>

      {/* About */}
      <Text style={[styles.sectionLabel, { color: Colors.textMuted }]}>ABOUT</Text>
      <DuoCard style={styles.aboutCard}>
        <View style={styles.aboutRow}>
          <TargetIcon size={28} color={Colors.primary} />
          <View>
            <Text style={[styles.aboutTitle, { color: Colors.text }]}>Intent</Text>
            <Text style={[styles.aboutText, { color: Colors.textLight }]}>Commit to one thing. Focus. Reflect.</Text>
          </View>
        </View>
      </DuoCard>
    </ScrollView>
  );
}

function SettingToggle({
  label,
  value,
  onValueChange,
  last = false,
  Colors,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  last?: boolean;
  Colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={[styles.setting, !last && { borderBottomWidth: 1, borderBottomColor: Colors.borderLight }]}>
      <Text style={[styles.settingLabel, { color: Colors.text }]}>{label}</Text>
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
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: Spacing.xxl, marginBottom: Spacing.xl },
  titleIconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '900' },
  streakCard: { marginBottom: Spacing.xl },
  streakCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  streakIconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  streakCardLabel: { fontSize: 13, fontWeight: '600' },
  streakCardDays: { fontSize: 24, fontWeight: '900' },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 8, marginLeft: 4 },
  section: { marginBottom: Spacing.xl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800' },
  permissionHint: { fontSize: 13, fontWeight: '500', marginBottom: 12 },
  setting: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  settingLabel: { fontSize: 15, fontWeight: '600' },
  exportButtons: { gap: 10 },
  aboutCard: { marginBottom: Spacing.xl },
  aboutRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  aboutTitle: { fontSize: 20, fontWeight: '900' },
  aboutText: { fontSize: 14, fontWeight: '500', marginTop: 2 },
});