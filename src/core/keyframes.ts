import type {
  EaseName,
  MotionState,
  MotionTrack,
} from './types.js';

export type MotionKeyframe = Readonly<{
  offset: number;
  value: MotionState;
  ease?: EaseName;
}>;

export function keyframesToTracks(
  target: string,
  keyframes: readonly MotionKeyframe[],
  options: Readonly<{
    durationMs: number;
    atMs?: number;
    ease?: EaseName;
  }>,
): readonly MotionTrack[] {
  if (!target.trim()) throw new Error('target is required');
  if (!Number.isFinite(options.durationMs) || options.durationMs < 0) {
    throw new RangeError('durationMs must be a finite number >= 0');
  }
  if (keyframes.length < 2) {
    throw new Error('At least two keyframes are required');
  }

  const sorted = [...keyframes].sort((a, b) => a.offset - b.offset);
  if (sorted[0]!.offset !== 0 || sorted.at(-1)!.offset !== 1) {
    throw new Error('Keyframes must start at offset 0 and end at offset 1');
  }

  for (let index = 0; index < sorted.length; index += 1) {
    const frame = sorted[index]!;
    if (!Number.isFinite(frame.offset) || frame.offset < 0 || frame.offset > 1) {
      throw new RangeError('Keyframe offsets must be finite values in [0, 1]');
    }
    if (index > 0 && frame.offset <= sorted[index - 1]!.offset) {
      throw new Error('Keyframe offsets must be strictly increasing');
    }
  }

  const atMs = options.atMs ?? 0;
  return sorted.slice(0, -1).map((frame, index) => {
    const next = sorted[index + 1]!;
    const segmentStart = atMs + frame.offset * options.durationMs;
    const durationMs = (next.offset - frame.offset) * options.durationMs;

    return Object.freeze({
      target,
      from: frame.value,
      to: next.value,
      atMs: segmentStart,
      durationMs,
      ease: frame.ease ?? options.ease ?? 'linear',
    });
  });
}
