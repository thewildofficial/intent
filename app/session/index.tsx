import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useColors, Spacing, Radii } from '../../constants/theme';
import { useSessionStore } from '../../stores/sessionStore';
import { useTimer } from '../../hooks/useTimer';
import { ProgressRing } from '../../components/ProgressRing';
import { buttonPress, completeSession } from '../../utils/haptics';
import { useEffect, useMemo, useState, useRef } from 'react';
import { PauseIcon, PlayIcon, PlusIcon, FlagIcon, TargetIcon, PencilIcon } from '../../components/Icons';

export default function SessionScreen() {
  const Colors = useColors();
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { intent, duration, setIntent, pauseSession, resumeSession, finishSession, isPaused, startSession } = useSessionStore();
  const { formattedRemaining, isComplete, remainingMs } = useTimer();

  const [editingIntent, setEditingIntent] = useState(false);
  const [intentDraft, setIntentDraft] = useState(intent);
  const intentInputRef = useRef<TextInput>(null);

  useEffect(() => { startSession(); }, []);

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
    if (isPaused) { resumeSession(); } else { pauseSession(); }
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

  const handleIntentEdit = () => {
    setIntentDraft(intent);
    setEditingIntent(true);
  };

  const handleIntentSave = () => {
    const trimmed = intentDraft.trim();
    if (trimmed) setIntent(trimmed);
    setEditingIntent(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.intentSection}>
        <View style={styles.intentLabelRow}>
          <TargetIcon size={18} color={Colors.primary} strokeWidth={2} />
          <Text style={[styles.intentLabel, { color: Colors.textMuted }]}>YOUR INTENTION</Text>
        </View>
        {editingIntent ? (
          <TextInput
            ref={intentInputRef}
            style={[styles.intentInput, { color: Colors.text, borderBottomColor: Colors.primary }]}
            value={intentDraft}
            onChangeText={setIntentDraft}
            onBlur={handleIntentSave}
            onSubmitEditing={handleIntentSave}
            autoFocus
            multiline
            maxLength={200}
            textAlign="center"
          />
        ) : (
          <TouchableOpacity onPress={handleIntentEdit} activeOpacity={0.7} style={styles.intentDisplay}>
            <Text style={[styles.intentText, { color: Colors.text }]}>{intent}</Text>
            <PencilIcon size={16} color={Colors.textMuted} strokeWidth={2} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.timerWrapper}>
        <ProgressRing size={ringSize} strokeWidth={16} progress={progress} style={styles.ring} />
        <View style={styles.timerContainer}>
          <Text style={[styles.timer, { color: Colors.text }]}>{formattedRemaining}</Text>
          <Text style={[styles.durationLabel, { color: Colors.textLight }]}>of {duration} minutes</Text>
          {isPaused && (
            <View style={[styles.pausedBadge, { backgroundColor: Colors.warning + '20' }]}>
              <Text style={[styles.pausedText, { color: Colors.warning }]}>PAUSED</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: Colors.cardBg, borderColor: Colors.borderLight }]}
          onPress={handlePause}
        >
          {isPaused ? <PlayIcon size={24} color={Colors.primary} /> : <PauseIcon size={24} color={Colors.primary} />}
          <Text style={[styles.controlLabel, { color: Colors.text }]}>{isPaused ? 'Resume' : 'Pause'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: Colors.cardBg, borderColor: Colors.borderLight }]}
          onPress={handleExtend}
        >
          <PlusIcon size={24} color={Colors.secondary} />
          <Text style={[styles.controlLabel, { color: Colors.secondary }]}>+5 min</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.controlButton, styles.finishButton, { backgroundColor: Colors.error, borderColor: Colors.error }]} onPress={handleFinishEarly}>
          <FlagIcon size={24} color={Colors.white} />
          <Text style={[styles.controlLabel, { color: Colors.white }]}>Finish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg },
  intentSection: { alignItems: 'center', marginTop: Spacing.xxl },
  intentLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  intentLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  intentDisplay: { flexDirection: 'row', alignItems: 'center', gap: 8, maxWidth: 300 },
  intentText: { fontSize: 20, fontWeight: '700', textAlign: 'center', flexShrink: 1 },
  intentInput: { fontSize: 20, fontWeight: '700', textAlign: 'center', maxWidth: 300, borderBottomWidth: 2, paddingVertical: 4, paddingHorizontal: 8 },
  timerWrapper: { alignItems: 'center', justifyContent: 'center' },
  timerContainer: { position: 'absolute', alignItems: 'center' },
  timer: { fontSize: 64, fontWeight: '900', fontVariant: ['tabular-nums'] },
  durationLabel: { fontSize: 15, fontWeight: '600', marginTop: 4 },
  pausedBadge: { marginTop: 12, borderRadius: Radii.pill, paddingHorizontal: 14, paddingVertical: 4 },
  pausedText: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  ring: { opacity: 0.95 },
  controls: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.md, marginBottom: Spacing.xxl },
  controlButton: { alignItems: 'center', gap: 6, paddingVertical: 14, paddingHorizontal: 20, borderRadius: Radii.md, borderWidth: 2, minWidth: 80 },
  controlLabel: { fontSize: 14, fontWeight: '800' },
  finishButton: {},
});