import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  contrastColor,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export default function App() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1800 }), -1, true);
  }, [progress]);

  const panelStyle = useAnimatedStyle(() => {
    const first = interpolateColor(progress.value, [0, 1], ['#0b0f1a', '#10131e']);
    const middle = interpolateColor(progress.value, [0, 1], ['#1668ff', '#ff3d81']);
    const last = interpolateColor(progress.value, [0, 1], ['#8a2be2', '#00d4ff']);
    const angle = 135 + progress.value * 180;

    return {
      // Reanimated 4.7 processes this changing gradient on the UI thread.
      backgroundImage: `linear-gradient(${angle}deg, ${first} 0%, ${middle} 55%, ${last} 100%)`,
      transform: [{ scale: 1 + progress.value * 0.035 }],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const background = interpolateColor(progress.value, [0, 1], ['#1668ff', '#ff3d81']);
    return { color: contrastColor(background) };
  });

  return (
    <View style={styles.screen}>
      <Animated.View style={[styles.panel, panelStyle]}>
        <Animated.Text style={[styles.title, textStyle]}>Kinetrell</Animated.Text>
        <Text style={styles.subtitle}>Expo SDK 58 · RN 0.88 RC · Reanimated 4.7</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#05070d' },
  panel: { minHeight: 240, borderRadius: 32, padding: 28, justifyContent: 'flex-end' },
  title: { fontSize: 44, fontWeight: '800', letterSpacing: -1.5 },
  subtitle: { marginTop: 8, color: '#ffffff', opacity: 0.82, fontSize: 16 },
});
