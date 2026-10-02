import { evaluateMotion } from '../core/evaluate.js';
import type {
  CompiledMotion,
  EaseName,
  MotionState,
  MotionValue,
} from '../core/types.js';

export type NativePropertyTrack = Readonly<{
  property: string;
  from: MotionValue;
  to: MotionValue;
  startMs: number;
  durationMs: number;
  repeat: number;
  repeatDelayMs: number;
  yoyo: boolean;
  ease: EaseName;
}>;

export type NativeTargetPlan = Readonly<{
  target: string;
  initial: MotionState;
  properties: readonly string[];
  tracks: readonly NativePropertyTrack[];
}>;

export function createNativeTargetPlan(
  motion: CompiledMotion,
  target: string,
): NativeTargetPlan {
  const initial = motion.initial[target];
  if (!initial) throw new Error(`Unknown motion target: ${target}`);

  const properties = new Set(Object.keys(initial));
  const tracks: NativePropertyTrack[] = [];

  for (const track of motion.tracks) {
    if (track.target !== target) continue;

    const startMs = track.atMs + (track.delayMs ?? 0);
    const stateAtStart = evaluateMotion(motion, startMs)[target] ?? initial;

    for (const [property, to] of Object.entries(track.to)) {
      properties.add(property);
      const from =
        track.from?.[property] ??
        stateAtStart[property] ??
        initial[property] ??
        to;

      tracks.push(
        Object.freeze({
          property,
          from,
          to,
          startMs,
          durationMs: track.durationMs,
          repeat: track.repeat ?? 0,
          repeatDelayMs: track.repeatDelayMs ?? 0,
          yoyo: track.yoyo ?? false,
          ease: track.ease,
        }),
      );
    }
  }

  return Object.freeze({
    target,
    initial,
    properties: Object.freeze([...properties]),
    tracks: Object.freeze(tracks),
  });
}
