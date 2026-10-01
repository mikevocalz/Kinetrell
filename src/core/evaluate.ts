import { applyEase } from './easing.js';
import type { CompiledMotion, MotionState, MotionValue } from './types.js';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function interpolateValue(from: MotionValue | undefined, to: MotionValue, t: number): MotionValue {
  if (typeof from === 'number' && typeof to === 'number') return lerp(from, to, t);
  return t < 1 ? (from ?? to) : to;
}

export function evaluateMotion(motion: CompiledMotion, timeMs: number): Record<string, MotionState> {
  const time = Math.min(Math.max(0, timeMs), motion.durationMs);
  const state: Record<string, Record<string, MotionValue>> = {};
  for (const [target, initial] of Object.entries(motion.initial)) state[target] = { ...initial };

  for (const track of motion.tracks) {
    if (time < track.atMs) continue;
    const delay = track.delayMs ?? 0;
    const repeatDelay = track.repeatDelayMs ?? 0;
    const repeat = track.repeat ?? 0;
    const cycleLength = delay + track.durationMs + repeatDelay;
    const local = Math.min(time - track.atMs, Math.max(0, track.endMs - track.atMs));
    let cycle = cycleLength === 0 ? repeat : Math.floor(local / cycleLength);
    cycle = Math.min(cycle, repeat);
    const cycleTime = cycleLength === 0 ? track.durationMs : local - cycle * cycleLength;
    const raw = track.durationMs === 0 ? 1 : Math.min(1, Math.max(0, (cycleTime - delay) / track.durationMs));
    const yoyoT = track.yoyo && cycle % 2 === 1 ? 1 - raw : raw;
    const eased = applyEase(track.ease, yoyoT);
    const targetState = state[track.target]!;
    for (const [property, to] of Object.entries(track.to)) {
      const from = track.from?.[property] ?? targetState[property];
      targetState[property] = interpolateValue(from, to, eased);
    }
  }

  return state;
}
