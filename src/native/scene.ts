import { useCallback } from 'react';
import {
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type { KinetrellScrollState } from './scroll.js';
import { sceneIsActive } from './scroll-math.js';
import { useSectionProgress } from './scroll.js';

export type ScrollSceneOptions = Readonly<{
  enterAt?: number;
  leaveAt?: number;
  once?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
}>;

export type ScrollSceneHandle = Readonly<{
  progress: SharedValue<number>;
  active: SharedValue<boolean>;
  revealed: SharedValue<boolean>;
}>;

/**
 * Higher-level scene state derived from one authoritative Kinetrell scroll
 * source. Enter/leave callbacks are discrete RN-thread events; progress never
 * crosses the bridge frame-by-frame.
 */
export function useScrollScene(
  scroll: KinetrellScrollState,
  section: Readonly<{
    start: number | SharedValue<number>;
    length: number | SharedValue<number>;
  }>,
  options: ScrollSceneOptions = {},
): ScrollSceneHandle {
  const progress = useSectionProgress(scroll, section);
  const revealed = useSharedValue(false);
  const enterAt = Math.min(1, Math.max(0, options.enterAt ?? 0.001));
  const leaveAt = Math.min(1, Math.max(enterAt, options.leaveAt ?? 0.999));
  const once = options.once ?? false;

  const active = useDerivedValue(() =>
    sceneIsActive(progress.value, enterAt, leaveAt),
  );

  const notifyEnter = useCallback(() => {
    options.onEnter?.();
  }, [options.onEnter]);

  const notifyLeave = useCallback(() => {
    options.onLeave?.();
  }, [options.onLeave]);

  useAnimatedReaction(
    () => active.value,
    (next, previous) => {
      if (next && !previous) {
        const alreadyRevealed = revealed.value;
        revealed.value = true;
        if (!once || !alreadyRevealed) scheduleOnRN(notifyEnter);
      } else if (!next && previous && !once) {
        scheduleOnRN(notifyLeave);
      }
    },
    [once, notifyEnter, notifyLeave],
  );

  return { progress, active, revealed };
}
