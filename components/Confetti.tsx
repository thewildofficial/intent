import { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  useReducedMotion,
  runOnJS,
} from 'react-native-reanimated';
import { useColors } from '../constants/theme';

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  drift: number;
  rotation: number;
  size: number;
  color: string;
}

interface ConfettiProps {
  fire: boolean;
  count?: number;
  onComplete?: () => void;
}

export function Confetti({ fire, count = 35, onComplete }: ConfettiProps) {
  const Colors = useColors();
  const reduceMotion = useReducedMotion();

  const palette = useMemo(
    () => [Colors.primary, Colors.secondary, Colors.accent, Colors.flame],
    [Colors.primary, Colors.secondary, Colors.accent, Colors.flame],
  );

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const seed = (i * 137.508) % 360;
      return {
        id: i,
        x: 0.1 + ((seed / 360) * 0.8 + (i % 7) * 0.013) % 0.8,
        delay: (i % 8) * 60,
        duration: 1400 + (i % 5) * 180,
        drift: ((i % 11) - 5) * 18,
        rotation: seed * 3.6,
        size: 8 + (i % 4) * 3,
        color: palette[i % palette.length],
      };
    });
  }, [count, palette]);

  if (reduceMotion || !fire) return null;

  return (
    <Animated.View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => (
        <ParticleView key={p.id} particle={p} onComplete={onComplete} isLast={p.id === count - 1} />
      ))}
    </Animated.View>
  );
}

function ParticleView({
  particle,
  onComplete,
  isLast,
}: {
  particle: Particle;
  onComplete?: () => void;
  isLast: boolean;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      particle.delay,
      withTiming(
        1,
        { duration: particle.duration, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) },
        () => {
          if (isLast && onComplete) runOnJS(onComplete)();
        },
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => {
    const t = progress.value;
    const y = t * 700;
    const x = particle.drift * Math.sin(t * Math.PI);
    const opacity = t < 0.85 ? 1 : (1 - t) / 0.15;
    const rotate = `${particle.rotation + t * 720}deg`;
    const scale = 1 - t * 0.3;

    return {
      transform: [{ translateX: x }, { translateY: y }, { rotate }, { scale }],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: `${particle.x * 100}%`,
          top: -20,
          width: particle.size,
          height: particle.size * 0.6,
          backgroundColor: particle.color,
          borderRadius: 2,
        },
        style,
      ]}
    />
  );
}