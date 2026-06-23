import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  useReducedMotion,
} from 'react-native-reanimated';
import { useColors, Spacing, Radii, type ColorPalette } from '../constants/theme';
import { setBooleanSetting } from '../db/queries';
import { buttonPress } from '../utils/haptics';
import { DuoButton } from '../components/DuoButton';
import { TargetIcon, FireIcon, SparkleIcon } from '../components/Icons';

const STEPS: { icon: React.FC<{ size?: number; color?: string }>; colorKey: keyof ColorPalette; title: string; subtitle: string }[] = [
  { icon: TargetIcon, colorKey: 'primary', title: 'Commit to one thing', subtitle: 'Pick a single intention. No endless todo lists — just one clear focus.' },
  { icon: FireIcon, colorKey: 'flame', title: 'Build your streak', subtitle: 'Complete a session each day to keep your streak alive. Momentum is everything.' },
  { icon: SparkleIcon, colorKey: 'accent', title: 'Reflect and grow', subtitle: 'After each session, note what you accomplished and how it felt.' },
];

export default function OnboardingScreen() {
  const Colors = useColors();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const translateY = useSharedValue(20);
  const bounce = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: reduceMotion ? 0 : 600 });
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    translateY.value = withSpring(0, { damping: 12, stiffness: 200 });
    bounce.value = withRepeat(withSpring(-8, { damping: 12, stiffness: 200 }), -1, true);
  }, [reduceMotion]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  const handleBegin = async () => {
    await buttonPress();
    await setBooleanSetting('onboardingComplete', true);
    router.replace('/(tabs)');
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else handleBegin();
  };

  const handleSkip = async () => {
    await buttonPress();
    await setBooleanSetting('onboardingComplete', true);
    router.replace('/(tabs)');
  };

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;
  const iconSize = Math.min(width * 0.35, 120);
  const stepColor = Colors[current.colorKey];

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={[styles.skipText, { color: Colors.textMuted }]}>SKIP</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.content, containerStyle]}>
        <Animated.View style={bounceStyle}>
          <View style={[styles.iconCircle, { width: iconSize, height: iconSize, borderRadius: iconSize / 2, backgroundColor: stepColor + '15' }]}>
            <Icon size={iconSize * 0.45} color={stepColor} />
          </View>
        </Animated.View>

        <Text style={[styles.headline, { color: Colors.text }]}>{current.title}</Text>
        <Text style={[styles.subhead, { color: Colors.textLight }]}>{current.subtitle}</Text>

        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.dot, i === step && { backgroundColor: stepColor, width: 24 }]} />
          ))}
        </View>

        <View style={styles.buttonWrap}>
          <DuoButton label={isLast ? 'GET STARTED' : 'CONTINUE'} onPress={handleNext} fullWidth size="lg" variant="primary" />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
  skipButton: { position: 'absolute', top: 60, right: 24, paddingVertical: 8, paddingHorizontal: 16 },
  skipText: { fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  content: { alignItems: 'center', width: '100%', maxWidth: 340 },
  iconCircle: { alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl },
  headline: { fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: Spacing.sm },
  subhead: { fontSize: 16, fontWeight: '500', textAlign: 'center', marginBottom: Spacing.xl, lineHeight: 24 },
  dots: { flexDirection: 'row', gap: 8, marginBottom: Spacing.xxl },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E5E5E5' },
  buttonWrap: { width: '100%' },
});