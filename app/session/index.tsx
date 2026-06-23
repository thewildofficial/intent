import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radii } from '../../constants/theme';
import { useSessionStore } from '../../stores/sessionStore';
import { useTimer } from '../../hooks/useTimer';
import { ProgressRing } from '../../components/ProgressRing';
import { buttonPress, completeSession } from '../../utils/haptics';
import { useEffect, useMemo } from 'react';
import { ArrowLeftIcon, PauseIcon, PlayIcon, PlusIcon, FlagIcon, TargetIcon } from '../../components/Icons';

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

  const ringSize = Math.min(width * 0.7, height * 0.35, 280);

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
      {/* Intent display */}
      <View style={styles.intentSection}>
        <View style={styles.intentLabelRow}>
          <TargetIcon size={18} color={Colors.primary} strokeWidth={2} />
          <Text style={styles.intentLabel}>YOUR INTENTION</Text>
        </View>
        <Text style={styles.intentText}>{intent}</Text>
      </View>

      {/* Timer ring */}
      <View style={styles.timerWrapper}>
        <ProgressRing
          size={ringSize}
          strokeWidth={16}
          progress={progress}
          style={styles.ring}
        />
        <View style={styles.timerContainer}>
          <Text style={styles.timer}>{formattedRemaining}</Text>
          <Text style={styles.durationLabel}>of {duration} minutes</Text>
          {isPaused && (
            <View style={styles.pausedBadge}>
              <Text style={styles.pausedText}>PAUSED</Text>
            </View>
          )}
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {/* Pause / Resume */}
        <TouchableOpacity style={styles.controlButton} onPress={handlePause}>
          {isPaused ? (
            <PlayIcon size={24} color={Colors.primary} />
          ) : (
            <PauseIcon size={24} color={Colors.primary} />
          )}
          <Text style={styles.controlLabel}>
            {isPaused ? 'Resume' : 'Pause'}
          </Text>
        </TouchableOpacity>

        {/* +5 min */}
        <TouchableOpacity style={styles.controlButton} onPress={handleExtend}>
          <PlusIcon size={24} color={Colors.secondary} />
          <Text style={[styles.controlLabel, { color: Colors.secondary }]}>+5 min</Text>
        </TouchableOpacity>

        {/* Finish */}
        <TouchableOpacity style={[styles.controlButton, styles.finishButton]} onPress={handleFinishEarly}>
          <FlagIcon size={24} color={Colors.white} />
          <Text style={[styles.controlLabel, { color: Colors.white }]}>Finish</Text>
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
  intentSection: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
  intentLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  intentLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1.5,
  },
  intentText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    maxWidth: 280,
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
    fontSize: 64,
    fontWeight: '900',
    color: Colors.text,
    fontVariant: ['tabular-nums'],
  },
  durationLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textLight,
    marginTop: 4,
  },
  pausedBadge: {
    marginTop: 12,
    backgroundColor: Colors.warning + '20',
    borderRadius: Radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  pausedText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.warning,
    letterSpacing: 1,
  },
  ring: {
    opacity: 0.95,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  controlButton: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: Radii.md,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    minWidth: 80,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
  },
  finishButton: {
    backgroundColor: Colors.error,
    borderColor: Colors.error,
  },
});