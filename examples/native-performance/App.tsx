import { useCallback, useState } from 'react';
import {
  I18nManager,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useFrameCallback,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useKinetrellScroll } from 'kinetrell/native';

const ITEMS = Array.from({ length: 300 }, (_, index) => ({
  id: String(index),
  label: `Motion row ${index + 1}`,
}));

type Metrics = {
  frames: number;
  over16_7ms: number;
  over33_4ms: number;
  maxDeltaMs: number;
};

export default function App() {
  const scroll = useKinetrellScroll();
  const [metrics, setMetrics] = useState<Metrics>({
    frames: 0,
    over16_7ms: 0,
    over33_4ms: 0,
    maxDeltaMs: 0,
  });

  const heroStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: scroll.offset.value * 0.28 },
      { scale: 1 + Math.min(0.08, scroll.offset.value / 5000) },
    ],
    opacity: Math.max(0.35, 1 - scroll.offset.value / 700),
  }));

  useFrameCallback((frame) => {
    'worklet';
    const delta = frame.timeSincePreviousFrame;
    if (delta == null) return;

    const state = globalThis as typeof globalThis & {
      __kinetrellPerf?: Metrics;
    };
    const next = state.__kinetrellPerf ?? {
      frames: 0,
      over16_7ms: 0,
      over33_4ms: 0,
      maxDeltaMs: 0,
    };

    next.frames += 1;
    if (delta > 16.7) next.over16_7ms += 1;
    if (delta > 33.4) next.over33_4ms += 1;
    next.maxDeltaMs = Math.max(next.maxDeltaMs, delta);
    state.__kinetrellPerf = next;

    if (next.frames % 120 === 0) {
      scheduleOnRN(setMetrics, { ...next });
    }
  }, true);

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<(typeof ITEMS)[number]>) => (
      <View style={styles.row}>
        <Text style={styles.rowIndex}>{String(index + 1).padStart(3, '0')}</Text>
        <Text style={styles.rowLabel}>{item.label}</Text>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.screen}>
      <Animated.FlatList
        data={ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onScroll={scroll.handler}
        scrollEventThrottle={16}
        initialNumToRender={18}
        windowSize={9}
        maxToRenderPerBatch={18}
        ListHeaderComponent={
          <>
            <View style={styles.heroClip}>
              <Animated.View style={[styles.hero, heroStyle]}>
                <Text style={styles.eyebrow}>KINETRELL DEVICE FIXTURE</Text>
                <Text style={styles.title}>300-row native scroll stress test</Text>
                <Text style={styles.subtitle}>
                  Reanimated 4.7 · Worklets 0.13 · Expo 58.0.2 · RN 0.88 RC
                </Text>
              </Animated.View>
            </View>

            <View style={styles.metrics}>
              <Text style={styles.metric}>frames {metrics.frames}</Text>
              <Text style={styles.metric}>&gt;16.7ms {metrics.over16_7ms}</Text>
              <Text style={styles.metric}>&gt;33.4ms {metrics.over33_4ms}</Text>
              <Text style={styles.metric}>
                max {metrics.maxDeltaMs.toFixed(1)}ms
              </Text>
              <Text style={styles.metric}>RTL {String(I18nManager.isRTL)}</Text>
            </View>

            <Animated.ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalContent}
            >
              {Array.from({ length: 12 }, (_, index) => (
                <View key={index} style={styles.horizontalCard}>
                  <Text style={styles.horizontalTitle}>Nested {index + 1}</Text>
                </View>
              ))}
            </Animated.ScrollView>
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#070910' },
  heroClip: { height: 300, overflow: 'hidden' },
  hero: {
    minHeight: 300,
    padding: 28,
    justifyContent: 'flex-end',
    backgroundImage:
      'linear-gradient(135deg, #111a35 0%, #2856df 48%, #9a42df 100%)',
  },
  eyebrow: { color: '#d4defe', fontSize: 12, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: '#fff', fontSize: 38, lineHeight: 42, fontWeight: '900', marginTop: 12 },
  subtitle: { color: '#e1e7ff', marginTop: 10, fontSize: 14 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 16 },
  metric: {
    color: '#b9c4df',
    backgroundColor: '#111623',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
  },
  horizontalContent: { gap: 12, paddingHorizontal: 16, paddingBottom: 18 },
  horizontalCard: {
    width: 150,
    height: 88,
    borderRadius: 18,
    padding: 16,
    justifyContent: 'flex-end',
    backgroundColor: '#151d31',
    borderWidth: 1,
    borderColor: '#273451',
  },
  horizontalTitle: { color: '#fff', fontWeight: '800' },
  row: {
    minHeight: 64,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#0d121e',
    borderWidth: 1,
    borderColor: '#1d2739',
  },
  rowIndex: { width: 34, color: '#7583a4', fontVariant: ['tabular-nums'] },
  rowLabel: { color: '#e9edfa', fontWeight: '600' },
});
