import { useCallback, useEffect } from 'react';
import type { ScrollView } from 'react-native';
import {
  scrollTo as reanimatedScrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { scheduleOnUI } from 'react-native-worklets';
import type { NativeMotionHandle } from './runtime.js';
import {
  directionalSnapPoint,
  parallaxFromProgress,
  sectionViewportProgress,
} from './scroll-math.js';

export type ScrollAxis = 'x' | 'y';

export type KinetrellScrollState = Readonly<{
  axis: ScrollAxis;
  offset: SharedValue<number>;
  velocity: SharedValue<number>;
  direction: SharedValue<-1 | 0 | 1>;
  viewportLength: SharedValue<number>;
  contentLength: SharedValue<number>;
  isDragging: SharedValue<boolean>;
  interactionGeneration: SharedValue<number>;
}>;

export type KinetrellScrollSource = KinetrellScrollState & Readonly<{
  handler: ReturnType<typeof useAnimatedScrollHandler>;
}>;

export function useKinetrellScroll(
  options: Readonly<{ axis?: ScrollAxis }> = {},
): KinetrellScrollSource {
  const axis = options.axis ?? 'y';
  const offset = useSharedValue(0);
  const velocity = useSharedValue(0);
  const direction = useSharedValue<-1 | 0 | 1>(0);
  const viewportLength = useSharedValue(0);
  const contentLength = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const interactionGeneration = useSharedValue(0);

  const handler = useAnimatedScrollHandler<{
    last?: number;
    time?: number;
  }>({
    onBeginDrag() {
      isDragging.value = true;
      interactionGeneration.value += 1;
    },

    onScroll(event, context) {
      const next =
        axis === 'y' ? event.contentOffset.y : event.contentOffset.x;
      const viewport =
        axis === 'y'
          ? event.layoutMeasurement.height
          : event.layoutMeasurement.width;
      const content =
        axis === 'y' ? event.contentSize.height : event.contentSize.width;

      const now = globalThis.performance?.now?.() ?? 0;
      const last = context.last ?? next;
      const lastTime = context.time ?? now;
      const elapsed = Math.max(1, now - lastTime);
      const delta = next - last;

      offset.value = next;
      velocity.value = (delta / elapsed) * 1000;
      direction.value = delta === 0 ? 0 : delta > 0 ? 1 : -1;
      viewportLength.value = viewport;
      contentLength.value = content;

      context.last = next;
      context.time = now;
    },

    onEndDrag() {
      isDragging.value = false;
    },

    onMomentumEnd() {
      velocity.value = 0;
      direction.value = 0;
    },
  });

  return {
    axis,
    offset,
    velocity,
    direction,
    viewportLength,
    contentLength,
    isDragging,
    interactionGeneration,
    handler,
  };
}

export function useSectionProgress(
  scroll: KinetrellScrollState,
  section: Readonly<{
    start: number | SharedValue<number>;
    length: number | SharedValue<number>;
  }>,
) {
  return useDerivedValue(() => {
    const start =
      typeof section.start === 'number' ? section.start : section.start.value;
    const length =
      typeof section.length === 'number' ? section.length : section.length.value;

    return sectionViewportProgress(
      scroll.offset.value,
      start,
      length,
      scroll.viewportLength.value,
    );
  });
}

export function useParallax(
  progress: SharedValue<number>,
  distance: number,
  center = 0.5,
) {
  return useDerivedValue(() =>
    parallaxFromProgress(progress.value, distance, center),
  );
}

/**
 * Directly scrubs a Kinetrell motion from an authoritative native scroll
 * progress value. There is no JS-thread frame bridge.
 */
export function useScrollScrub(
  motion: NativeMotionHandle,
  progress: SharedValue<number>,
) {
  useAnimatedReaction(
    () => Math.min(1, Math.max(0, progress.value)),
    (next) => {
      motion.playheadMs.value = next * motion.compiled.durationMs;
    },
    [motion.compiled.durationMs],
  );
}

export type NativeScrollController = Readonly<{
  ref: ReturnType<typeof useAnimatedRef<ScrollView>>;
  scrollTo: (
    offset: number,
    options?: Readonly<{ animated?: boolean; crossOffset?: number }>,
  ) => void;
  cancelPending: () => void;
}>;

/**
 * A thin command adapter around Reanimated's native scrollTo. It never creates
 * a second scroll physics engine and never disables user interaction.
 */
export function useNativeScrollController(
  options: Readonly<{
    axis?: ScrollAxis;
    interactionGeneration?: SharedValue<number>;
  }> = {},
): NativeScrollController {
  const ref = useAnimatedRef<ScrollView>();
  const commandGeneration = useSharedValue(0);
  const axis = options.axis ?? 'y';
  const interactionGeneration = options.interactionGeneration;

  useAnimatedReaction(
    () => interactionGeneration?.value ?? 0,
    (current, previous) => {
      if (previous !== null && current !== previous) {
        // A native user interaction invalidates any queued Kinetrell command.
        commandGeneration.value += 1;
      }
    },
    [interactionGeneration],
  );

  const scrollTo = useCallback(
    (
      offset: number,
      options: Readonly<{ animated?: boolean; crossOffset?: number }> = {},
    ) => {
      if (!Number.isFinite(offset)) {
        throw new RangeError('scroll offset must be finite');
      }

      const generation = commandGeneration.value + 1;
      commandGeneration.value = generation;
      const animated = options.animated ?? true;
      const crossOffset = options.crossOffset ?? 0;

      scheduleOnUI(() => {
        'worklet';
        if (commandGeneration.value !== generation) return;
        if (axis === 'y') {
          reanimatedScrollTo(ref, crossOffset, offset, animated);
        } else {
          reanimatedScrollTo(ref, offset, crossOffset, animated);
        }
      });
    },
    [axis, commandGeneration, ref],
  );

  const cancelPending = useCallback(() => {
    commandGeneration.value += 1;
  }, [commandGeneration]);

  return { ref, scrollTo, cancelPending };
}

export type NativeSnapController = Readonly<{
  snap: (options?: Readonly<{
    offset?: number;
    velocity?: number;
    animated?: boolean;
  }>) => void;
}>;

/**
 * Imperative snap command. Call from the host's settle point (for example after
 * momentum end) rather than installing a second physics owner.
 */
export function useNativeSnapController(
  scroll: KinetrellScrollState,
  controller: NativeScrollController,
  points: readonly number[],
  options: Readonly<{
    velocityThreshold?: number;
    animated?: boolean;
  }> = {},
): NativeSnapController {
  const pointsRef = useSharedValue([...points]);
  pointsRef.value = [...points];

  const snap = useCallback(
    (
      command: Readonly<{
        offset?: number;
        velocity?: number;
        animated?: boolean;
      }> = {},
    ) => {
      const explicitOffset = command.offset;
      const explicitVelocity = command.velocity;
      const animated = command.animated ?? options.animated ?? true;
      const threshold = options.velocityThreshold ?? 420;

      scheduleOnUI(() => {
        'worklet';
        const offset = explicitOffset ?? scroll.offset.value;
        const velocity = explicitVelocity ?? scroll.velocity.value;
        const destination = directionalSnapPoint(
          offset,
          velocity,
          pointsRef.value,
          threshold,
        );
        if (destination === null) return;

        if (scroll.axis === 'y') {
          reanimatedScrollTo(controller.ref, 0, destination, animated);
        } else {
          reanimatedScrollTo(controller.ref, destination, 0, animated);
        }
      });
    },
    [
      controller.ref,
      options.animated,
      options.velocityThreshold,
      pointsRef,
      scroll.axis,
      scroll.offset,
      scroll.velocity,
    ],
  );

  return { snap };
}
