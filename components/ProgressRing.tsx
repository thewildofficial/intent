import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  useReducedMotion,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../constants/theme';
import { useEffect } from 'react';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0..1
  style?: ViewStyle;
}

export function ProgressRing({
  size = 320,
  strokeWidth = 12,
  progress,
  style,
}: ProgressRingProps) {
  const reduceMotion = useReducedMotion();
  const animatedProgress = useSharedValue(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  useEffect(() => {
    if (reduceMotion) {
      animatedProgress.value = Math.max(0, Math.min(1, progress));
    } else {
      animatedProgress.value = withTiming(Math.max(0, Math.min(1, progress)), {
        duration: 900,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [progress, reduceMotion]);

  const ringProps = useAnimatedProps(() => {
    const clamped = Math.max(0, Math.min(1, animatedProgress.value));
    return {
      strokeDashoffset: circumference * (1 - clamped),
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        {/* Background track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={Colors.surfaceAlt}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={Colors.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={ringProps}
          rotation="-90"
          originX={center}
          originY={center}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
