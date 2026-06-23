import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { useSessionStore } from '../../stores/sessionStore';
import { useTimer } from '../../hooks/useTimer';
import { ProgressRing } from '../../components/ProgressRing';
import { buttonPress, completeSession } from '../../utils/haptics';
import { useEffect, useMemo } from 'react';

export default function SessionScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { intent, duration, pauseSession, resumeSession, finishSession, isPaused, startSession } = useSessionStore();
  const { formattedRemaining, isComplete, remainingMs } = useTimer();

  useEffect(() => {
    startSession();
  }, []);

  useEffect(() => {
    if (isComplete) {
      completeSession();
      finishSession();
      router.push('/reflection');
    }
  }, [isComplete]);

  const progress = useMemo(() => {
    if (duration <= 0) return 0;
    const totalMs = duration * 60 * 1000;
    const clampedRemaining = Math.max(0, Math.min(totalMs, remainingMs ?? totalMs));
    return 1 - clampedRemaining / totalMs;
  }, [duration, remainingMs]);

  const ringSize = Math.min(width * 0.72, height * 0.36, 320);

  const handlePause = async () => {
    await buttonPress();
    if (isPaused) {
      resumeSession();
    } else {
      pauseSession();
    }
  };

  const handleFinishEarly = async () => {
    await completeSession();
    finishSession();
    router.push('/reflection');
  };

  const handleExtend = () => {
    const currentDuration = useSessionStore.getState().duration;
    useSessionStore.setState({ duration: currentDuration + 5 });
  };

  return (
    <View style={styles.container}>
      <View style={styles.intentContainer}>
        <Text style={styles.intentLabel}>INTENTION</Text>
        <Text style={styles.intentText}>{intent}</Text>
      </View>

      <View style={styles.timerWrapper}>
        <ProgressRing
          size={ringSize}
          strokeWidth={14}
          progress={progress}
          style={styles.ring}
        />
        <View style={styles.timerContainer}>
          <Text style={styles.timer}>{formattedRemaining}</Text>
          <Text style={styles.duration}>of {duration} minutes</Text>
        </View>
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
  timerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerContainer: {
    position: 'absolute',
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
  ring: {
    opacity: 0.9,
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
