import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useUIStore } from '../stores/uiStore';

function isEnabled() {
  return !useUIStore.getState().reduceMotion;
}

export async function lightTap() {
  if (!isEnabled()) return;
  if (Platform.OS === 'web') return;
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export async function mediumTap() {
  if (!isEnabled()) return;
  if (Platform.OS === 'web') return;
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

export async function heavyTap() {
  if (!isEnabled()) return;
  if (Platform.OS === 'web') return;
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}

export async function success() {
  if (!isEnabled()) return;
  if (Platform.OS === 'web') return;
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export async function warning() {
  if (!isEnabled()) return;
  if (Platform.OS === 'web') return;
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}

export async function streakIncrement() {
  if (!isEnabled()) return;
  if (Platform.OS === 'web') return;
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export async function buttonPress() {
  if (!isEnabled()) return;
  if (Platform.OS === 'web') return;
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

export async function startSession() {
  if (!isEnabled()) return;
  if (Platform.OS === 'web') return;
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export async function completeSession() {
  if (!isEnabled()) return;
  if (Platform.OS === 'web') return;
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
