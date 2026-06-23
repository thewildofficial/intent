import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  interpolate,
  useReducedMotion,
} from 'react-native-reanimated';
import { Colors, Spacing, Typography } from '../constants/theme';
import { useEffect } from 'react';

interface AnimatedStartButtonProps {
  onPress: () => void;
  label?: string;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AnimatedStartButton({
  onPress,
  label = 'Start Session',
  style,
}: AnimatedStartButtonProps) {
  const reduceMotion = useReducedMotion();
  const pulse = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) return;
    pulse.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      true
    );
  }, [reduceMotion]);

  const glowStyle = useAnimatedStyle(() => {
    if (reduceMotion) return {};

    const glowOpacity = interpolate(pulse.value, [0, 1], [0.25, 0.55]);
    const glowScale = interpolate(pulse.value, [0, 1], [1, 1.12]);

    return {
      opacity: glowOpacity,
      transform: [{ scale: glowScale }],
    };
  });

  const pressStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedPressable
      style={[styles.container, pressStyle, style]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Animated.View style={[styles.glow, glowStyle]} />
      <Animated.View style={styles.button}>
        <Text style={styles.label}>{label}</Text>
      </Animated.View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '56%',
    maxWidth: 220,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: Colors.primary,
  },
  button: {
    width: '78%',
    height: '78%',
    borderRadius: 999,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  label: {
    ...Typography.title,
    color: Colors.white,
    fontWeight: '700',
    textAlign: 'center',
  },
});
