import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';

export type NotificationType = 'dailyReminder' | 'sessionComplete' | 'streakWarning';

export const NOTIFICATION_IDS: Record<NotificationType, string> = {
  dailyReminder: 'intent-daily-reminder',
  sessionComplete: 'intent-session-complete',
  streakWarning: 'intent-streak-warning',
};

export const NOTIFICATION_SETTINGS = {
  dailyReminder: 'notifications_daily_reminder',
  sessionComplete: 'notifications_session_complete',
  streakWarning: 'notifications_streak_warning',
} as const;

export function buildDailyReminderContent(): Notifications.NotificationContentInput {
  return {
    title: 'Set your intention today',
    body: 'A focused session is waiting. What will you do with it?',
    data: { type: 'dailyReminder' },
  };
}

export function buildSessionCompleteContent(): Notifications.NotificationContentInput {
  return {
    title: 'Session complete 🎯',
    body: 'Great work. Take a moment to reflect before the day moves on.',
    data: { type: 'sessionComplete' },
  };
}

export function buildStreakWarningContent(currentStreak: number): Notifications.NotificationContentInput {
  return {
    title: 'Keep your streak alive',
    body:
      currentStreak > 1
        ? `You have a ${currentStreak}-day streak going. One small session keeps it alive.`
        : 'Come back today to start a new streak.',
    data: { type: 'streakWarning', currentStreak },
  };
}

export function buildDailyReminderTrigger(
  hour: number,
  minute: number
): Notifications.DailyTriggerInput {
  return {
    type: SchedulableTriggerInputTypes.DAILY,
    hour,
    minute,
  };
}

export function buildOneTimeTrigger(secondsFromNow: number): Notifications.TimeIntervalTriggerInput {
  return {
    type: SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: secondsFromNow,
  };
}

export async function scheduleTypedNotification(
  type: NotificationType,
  trigger: Notifications.NotificationTriggerInput
): Promise<string | null> {
  try {
    const content = (() => {
      switch (type) {
        case 'dailyReminder':
          return buildDailyReminderContent();
        case 'sessionComplete':
          return buildSessionCompleteContent();
        case 'streakWarning':
          return buildStreakWarningContent(0);
      }
    })();

    return await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_IDS[type],
      content,
      trigger,
    });
  } catch (error) {
    console.warn(`Failed to schedule ${type} notification`, error);
    return null;
  }
}

export async function cancelTypedNotification(type: NotificationType): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS[type]);
  } catch (error) {
    console.warn(`Failed to cancel ${type} notification`, error);
  }
}

export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  return Notifications.getAllScheduledNotificationsAsync();
}
