import { Gesture } from 'react-native-gesture-handler';
import {
  cancelAnimation,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { NativeMotionHandle } from './runtime.js';
import {
  gestureSettleTarget,
  progressFromPanTranslation,
} from './gesture-math.js';

export {
  clampGestureProgress,
  gestureSettleTarget,
  progressFromPanTranslation,
} from './gesture-math.js';

export type MotionPanGestureOptions = Readonly<{
  axis?: 'x' | 'y';
  distance?: number;
  direction?: 1 | -1;
  settle?: 'nearest' | 'none';
  settleDurationMs?: number;
}>;

/**
 * Maps a Pan gesture directly onto a Kinetrell native playhead on the UI
 * runtime. This entry point is optional and requires react-native-gesture-handler.
 *
 * Compose the returned gesture with the caller's Native/Scroll gesture using
 * Gesture.Simultaneous or Gesture.Exclusive; Kinetrell does not seize global
 * gesture ownership.
 */
export function useMotionPanGesture(
  motion: NativeMotionHandle,
  options: MotionPanGestureOptions = {},
) {
  const startProgress = useSharedValue(0);
  const axis = options.axis ?? 'x';
  const distance = Math.max(1, Math.abs(options.distance ?? 280));
  const direction = options.direction ?? 1;
  const settle = options.settle ?? 'nearest';
  const settleDurationMs = Math.max(0, options.settleDurationMs ?? 220);

  return Gesture.Pan()
    .onBegin(() => {
      cancelAnimation(motion.playheadMs);
      startProgress.value = motion.progress.value;
    })
    .onUpdate((event) => {
      const translation =
        axis === 'x' ? event.translationX : event.translationY;
      const progress = progressFromPanTranslation(
        startProgress.value,
        translation,
        distance,
        direction,
      );
      motion.playheadMs.value = progress * motion.compiled.durationMs;
    })
    .onEnd((event) => {
      if (settle === 'none') return;

      const velocity = axis === 'x' ? event.velocityX : event.velocityY;
      const target = gestureSettleTarget(
        motion.progress.value,
        velocity * direction,
        distance,
      );

      motion.playheadMs.value = withTiming(
        target * motion.compiled.durationMs,
        { duration: settleDurationMs },
      );
    });
}
