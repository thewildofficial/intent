import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { useSessionStore } from '../../stores/sessionStore';
import { useTimer } from '../../hooks/useTimer';
import { useEffect } from 'react';

export default function SessionScreen() {
  const router = useRouter();
  const { intent, duration, pauseSession, resumeSession, finishSession, isPaused, startSession } = useSessionStore();
  const { formattedRemaining, isComplete } = useTimer();

  useEffect(() => {
    startSession();
  }, []);

  useEffect(() => {
    if (isComplete) {
      finishSession();
      router.push('/reflection');
    }
  }, [isComplete]);

  const handlePause = () => {
    if (isPaused) {
      resumeSession();
    } else {
      pauseSession();
    }
  };

  const handleFinishEarly = () => {
    finishSession();
    router.push('/reflection');
  };

  const handleExtend = () => {
    // Extend by 5 minutes
    const currentDuration = useSessionStore.getState().duration;
    useSessionStore.setState({ duration: currentDuration + 5 });
  };

  return (
    <View style={styles.container}>
      <View style={styles.intentContainer}>
        <Text style={styles.intentLabel}>INTENTION</Text>
        <Text style={styles.intentText}>{intent}</Text>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{formattedRemaining}</Text>
        <Text style={styles.duration}>of {duration} minutes</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={handlePause}>
          <Text style={styles.controlText}>{isPaused ? 'Resume' : 'Pause'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={handleExtend}>
          <Text style={styles.controlText}>+5 min</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.controlButton, styles.finishButton]} onPress={handleFinishEarly}>
          <Text style={[styles.controlText, styles.finishText]}>Finish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  intentContainer: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
  intentLabel: {
    ...Typography.caption,
    color: Colors.textLight,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  intentText: {
    ...Typography.subtitle,
    color: Colors.text,
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
  },
  timer: {
    ...Typography.display,
    fontSize: 72,
    color: Colors.text,
    fontWeight: '700',
  },
  duration: {
    ...Typography.body,
    color: Colors.textLight,
    marginTop: Spacing.sm,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: Spacing.xxl,
  },
  controlButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  controlText: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
  },
  finishButton: {
    backgroundColor: Colors.error,
    borderColor: Colors.error,
  },
  finishText: {
    color: Colors.white,
  },
});
