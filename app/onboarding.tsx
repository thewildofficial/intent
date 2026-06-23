import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useReducedMotion,
} from 'react-native-reanimated';
import { Colors, Spacing, Typography } from '../constants/theme';
import { setBooleanSetting } from '../db/queries';
import { buttonPress } from '../utils/haptics';

export default function OnboardingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: reduceMotion ? 0 : 700 });
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });
    translateY.value = withSpring(0, { damping: 12, stiffness: 100 });
  }, [reduceMotion]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
    };
  });

  const handleBegin = async () => {
    await buttonPress();
    await setBooleanSetting('onboardingComplete', true);
    router.replace('/(tabs)');
  };

  const handleSkip = async () => {
    await buttonPress();
    await setBooleanSetting('onboardingComplete', true);
    router.replace('/(tabs)');
  };

  const brandSize = Math.min(width * 0.3, 120);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, containerStyle]}>
        <View
          style={[
            styles.brand,
            { width: brandSize, height: brandSize, borderRadius: brandSize / 2 },
          ]}
        >
          <Text style={styles.brandEmoji}>🎯</Text>
        </View>

        <Text style={styles.headline}>Commit to one thing.</Text>
        <Text style={styles.subhead}>Pick a single intention. Focus on it. Reflect. Build momentum one day at a time.</Text>

        <TouchableOpacity style={styles.beginButton} onPress={handleBegin}>
          <Text style={styles.beginText}>Tap to begin</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
  },
  brand: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  brandEmoji: {
    fontSize: 56,
  },
  headline: {
    ...Typography.title,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subhead: {
    ...Typography.body,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    lineHeight: 24,
  },
  beginButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  beginText: {
    ...Typography.subtitle,
    color: Colors.white,
    fontWeight: '700',
  },
  skipButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  skipText: {
    ...Typography.body,
    color: Colors.textLight,
  },
});
