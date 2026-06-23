import { useEffect, useState, useCallback, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import {
  NOTIFICATION_IDS,
  NOTIFICATION_SETTINGS,
  NotificationType,
  buildDailyReminderTrigger,
  buildOneTimeTrigger,
  scheduleTypedNotification,
  cancelTypedNotification,
} from '../utils/notifications';
import { getBooleanSetting, setBooleanSetting } from '../db/queries';

export interface NotificationPermissionState {
  granted: boolean;
  canAskAgain: boolean;
}

export interface UseNotificationsResult {
  permission: NotificationPermissionState;
  requestPermission: () => Promise<boolean>;
  dailyReminderEnabled: boolean;
  sessionCompleteEnabled: boolean;
  streakWarningEnabled: boolean;
  setDailyReminderEnabled: (enabled: boolean) => Promise<void>;
  setSessionCompleteEnabled: (enabled: boolean) => Promise<void>;
  setStreakWarningEnabled: (enabled: boolean) => Promise<void>;
  scheduleSessionComplete: () => Promise<void>;
  scheduleStreakWarning: (currentStreak: number) => Promise<void>;
  refresh: () => Promise<void>;
  loading: boolean;
}

const DEFAULT_DAILY_HOUR = 9;
const DEFAULT_DAILY_MINUTE = 0;

async function readSettingsState(): Promise<{
  daily: boolean;
  complete: boolean;
  warning: boolean;
}> {
  const [daily, complete, warning] = await Promise.all([
    getBooleanSetting(NOTIFICATION_SETTINGS.dailyReminder),
    getBooleanSetting(NOTIFICATION_SETTINGS.sessionComplete, true),
    getBooleanSetting(NOTIFICATION_SETTINGS.streakWarning),
  ]);

  return { daily, complete, warning };
}

async function syncScheduledState(
  granted: boolean,
  state: { daily: boolean; complete: boolean; warning: boolean },
  currentStreak = 0
): Promise<void> {
  if (!granted) {
    await Promise.all([
      cancelTypedNotification('dailyReminder'),
      cancelTypedNotification('sessionComplete'),
      cancelTypedNotification('streakWarning'),
    ]);
    return;
  }

  if (state.daily) {
    await scheduleTypedNotification(
      'dailyReminder',
      buildDailyReminderTrigger(DEFAULT_DAILY_HOUR, DEFAULT_DAILY_MINUTE)
    );
  } else {
    await cancelTypedNotification('dailyReminder');
  }

  if (!state.complete) {
    await cancelTypedNotification('sessionComplete');
  }

  if (state.warning) {
    const id = await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_IDS.streakWarning,
      content: {
        title: 'Keep your streak alive',
        body:
          currentStreak > 1
            ? `You have a ${currentStreak}-day streak going. One small session keeps it alive.`
            : 'Come back today to start a new streak.',
        data: { type: 'streakWarning', currentStreak },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 20,
        minute: 0,
      },
    });
    if (!id) await cancelTypedNotification('streakWarning');
  } else {
    await cancelTypedNotification('streakWarning');
  }
}

export function useNotifications(currentStreak = 0): UseNotificationsResult {
  const [permission, setPermission] = useState<NotificationPermissionState>({
    granted: false,
    canAskAgain: true,
  });
  const [dailyReminderEnabled, setDailyReminderEnabledState] = useState(false);
  const [sessionCompleteEnabled, setSessionCompleteEnabledState] = useState(true);
  const [streakWarningEnabled, setStreakWarningEnabledState] = useState(false);
  const [loading, setLoading] = useState(true);
  const hasRequestedRef = useRef(false);

  const readPermission = useCallback(async () => {
    const status = await Notifications.getPermissionsAsync();
    const next = {
      granted: status.granted,
      canAskAgain: status.canAskAgain ?? true,
    };
    setPermission(next);
    return next;
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (hasRequestedRef.current) return permission.granted;
    hasRequestedRef.current = true;

    try {
      const status = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      const next = {
        granted: status.granted,
        canAskAgain: status.canAskAgain ?? true,
      };
      setPermission(next);
      return status.granted;
    } catch (error) {
      console.warn('Notification permission request failed', error);
      return false;
    }
  }, [permission.granted]);

  const refreshSettings = useCallback(async () => {
    const state = await readSettingsState();
    setDailyReminderEnabledState(state.daily);
    setSessionCompleteEnabledState(state.complete);
    setStreakWarningEnabledState(state.warning);
    return state;
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { granted } = await readPermission();
    const state = await refreshSettings();
    await syncScheduledState(granted, state, currentStreak);
    setLoading(false);
  }, [readPermission, refreshSettings, currentStreak]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateToggle = useCallback(
    async (type: NotificationType, enabled: boolean) => {
      const settingKey = NOTIFICATION_SETTINGS[type];
      await setBooleanSetting(settingKey, enabled);

      if (type === 'dailyReminder') setDailyReminderEnabledState(enabled);
      if (type === 'sessionComplete') setSessionCompleteEnabledState(enabled);
      if (type === 'streakWarning') setStreakWarningEnabledState(enabled);

      let granted = permission.granted;
      if (!granted) {
        granted = await requestPermission();
      }

      if (!granted) return;

      await syncScheduledState(granted, {
        daily:
          type === 'dailyReminder'
            ? enabled
            : dailyReminderEnabled,
        complete:
          type === 'sessionComplete'
            ? enabled
            : sessionCompleteEnabled,
        warning:
          type === 'streakWarning'
            ? enabled
            : streakWarningEnabled,
      }, currentStreak);
    },
    [
      permission,
      dailyReminderEnabled,
      sessionCompleteEnabled,
      streakWarningEnabled,
      requestPermission,
      currentStreak,
    ]
  );

  const setDailyReminderEnabled = useCallback(
    (enabled: boolean) => updateToggle('dailyReminder', enabled),
    [updateToggle]
  );
  const setSessionCompleteEnabled = useCallback(
    (enabled: boolean) => updateToggle('sessionComplete', enabled),
    [updateToggle]
  );
  const setStreakWarningEnabled = useCallback(
    (enabled: boolean) => updateToggle('streakWarning', enabled),
    [updateToggle]
  );

  const scheduleSessionComplete = useCallback(async () => {
    if (!sessionCompleteEnabled) return;

    let granted = permission.granted;
    if (!granted) {
      granted = await requestPermission();
    }
    if (!granted) return;

    await cancelTypedNotification('sessionComplete');
    await scheduleTypedNotification(
      'sessionComplete',
      buildOneTimeTrigger(2)
    );
  }, [permission.granted, sessionCompleteEnabled, requestPermission]);

  const scheduleStreakWarning = useCallback(
    async (streak: number) => {
      if (!streakWarningEnabled) return;

      let granted = permission.granted;
      if (!granted) {
        granted = await requestPermission();
      }
      if (!granted) return;

      const id = await Notifications.scheduleNotificationAsync({
        identifier: NOTIFICATION_IDS.streakWarning,
        content: {
          title: 'Keep your streak alive',
          body:
            streak > 1
              ? `You have a ${streak}-day streak going. One small session keeps it alive.`
              : 'Come back today to start a new streak.',
          data: { type: 'streakWarning', currentStreak: streak },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 20,
          minute: 0,
        },
      });
      if (!id) await cancelTypedNotification('streakWarning');
    },
    [permission.granted, streakWarningEnabled, requestPermission]
  );

  return {
    permission,
    requestPermission,
    dailyReminderEnabled,
    sessionCompleteEnabled,
    streakWarningEnabled,
    setDailyReminderEnabled,
    setSessionCompleteEnabled,
    setStreakWarningEnabled,
    scheduleSessionComplete,
    scheduleStreakWarning,
    refresh,
    loading,
  };
}
