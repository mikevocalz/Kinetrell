import { withDelay, withRepeat, withTiming } from 'react-native-reanimated';
import type { AnimatableValue, AnimationObject } from 'react-native-reanimated';
import type { CompiledTrack } from '../core/types.js';
import { toReanimatedEasing } from './easing.js';

export function buildNativeTween<T extends AnimatableValue>(track: CompiledTrack, to: T): T | AnimationObject<T> {
  const timing = withTiming(to, { duration: track.durationMs, easing: toReanimatedEasing(track.ease) });
  const repeated = (track.repeat ?? 0) > 0
    ? withRepeat(timing, (track.repeat ?? 0) + 1, track.yoyo ?? false)
    : timing;
  return (track.delayMs ?? 0) > 0 ? withDelay(track.delayMs ?? 0, repeated) : repeated;
}
