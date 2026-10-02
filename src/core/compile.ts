import type {
  CompiledMotion,
  CompiledTrack,
  EaseName,
  MotionDefinition,
  MotionKeyframeTrack,
  MotionTweenTrack,
} from './types.js';

function finiteNonNegative(value: number, field: string): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${field} must be a finite number >= 0`);
  }
  return value;
}

function validateRepeat(repeat: number, field: string) {
  if (!Number.isInteger(repeat) || repeat < 0) {
    throw new RangeError(`${field} must be an integer >= 0`);
  }
}

function compileTweenTrack(
  track: MotionTweenTrack,
  index: number,
): CompiledTrack {
  const atMs = finiteNonNegative(track.atMs ?? 0, `tracks[${index}].atMs`);
  const duration = finiteNonNegative(
    track.durationMs,
    `tracks[${index}].durationMs`,
  );
  const delay = finiteNonNegative(
    track.delayMs ?? 0,
    `tracks[${index}].delayMs`,
  );
  const repeatDelay = finiteNonNegative(
    track.repeatDelayMs ?? 0,
    `tracks[${index}].repeatDelayMs`,
  );
  const repeat = track.repeat ?? 0;
  validateRepeat(repeat, `tracks[${index}].repeat`);

  const endMs =
    atMs + delay + duration * (repeat + 1) + repeatDelay * repeat;

  return Object.freeze({
    ...track,
    atMs,
    endMs,
    ease: track.ease ?? 'linear',
  });
}

function compileKeyframeTrack(
  track: MotionKeyframeTrack,
  index: number,
): readonly CompiledTrack[] {
  const atMs = finiteNonNegative(track.atMs ?? 0, `tracks[${index}].atMs`);
  const duration = finiteNonNegative(
    track.durationMs,
    `tracks[${index}].durationMs`,
  );
  const delay = finiteNonNegative(
    track.delayMs ?? 0,
    `tracks[${index}].delayMs`,
  );
  const repeatDelay = finiteNonNegative(
    track.repeatDelayMs ?? 0,
    `tracks[${index}].repeatDelayMs`,
  );
  const repeat = track.repeat ?? 0;
  validateRepeat(repeat, `tracks[${index}].repeat`);

  if (repeat !== 0 || repeatDelay !== 0 || track.yoyo) {
    throw new Error(
      `tracks[${index}] keyframes cannot currently combine with repeat, repeatDelayMs, or yoyo`,
    );
  }

  if (track.keyframes.length === 0) {
    throw new Error(
      `tracks[${index}].keyframes must contain at least one frame`,
    );
  }

  let previousOffset = 0;
  const compiled: CompiledTrack[] = [];
  const baseStart = atMs + delay;

  for (let frameIndex = 0; frameIndex < track.keyframes.length; frameIndex += 1) {
    const frame = track.keyframes[frameIndex]!;
    if (!Number.isFinite(frame.offset) || frame.offset < 0 || frame.offset > 1) {
      throw new RangeError(
        `tracks[${index}].keyframes[${frameIndex}].offset must be between 0 and 1`,
      );
    }
    if (frameIndex > 0 && frame.offset <= previousOffset) {
      throw new RangeError(
        `tracks[${index}].keyframes offsets must be strictly increasing`,
      );
    }

    const segmentStart = baseStart + previousOffset * duration;
    const segmentDuration = (frame.offset - previousOffset) * duration;
    const segmentEnd = segmentStart + segmentDuration;
    const ease: EaseName = frame.ease ?? track.ease ?? 'linear';

    compiled.push(
      Object.freeze({
        target: track.target,
        from: frameIndex === 0 ? track.from : undefined,
        to: frame.values,
        atMs: segmentStart,
        durationMs: segmentDuration,
        delayMs: 0,
        ease,
        repeat: 0,
        repeatDelayMs: 0,
        yoyo: false,
        endMs: segmentEnd,
      }),
    );

    previousOffset = frame.offset;
  }

  if (previousOffset !== 1) {
    throw new RangeError(
      `tracks[${index}].keyframes must end with an offset of 1`,
    );
  }

  return Object.freeze(compiled);
}

export function compileMotion(definition: MotionDefinition): CompiledMotion {
  if (!definition.id.trim()) throw new Error('Motion id is required');
  const labels = Object.freeze({ ...(definition.labels ?? {}) });
  for (const [name, value] of Object.entries(labels)) {
    finiteNonNegative(value, `label:${name}`);
  }

  let durationMs = 0;
  const tracks: CompiledTrack[] = [];

  definition.tracks.forEach((track, index) => {
    if (!definition.initial[track.target]) {
      throw new Error(`Unknown target "${track.target}" at track ${index}`);
    }

    const expanded =
      'keyframes' in track && track.keyframes
        ? compileKeyframeTrack(track, index)
        : [compileTweenTrack(track as MotionTweenTrack, index)];

    for (const compiled of expanded) {
      durationMs = Math.max(durationMs, compiled.endMs);
      tracks.push(compiled);
    }
  });

  return Object.freeze({
    schemaVersion: 1 as const,
    id: definition.id,
    initial: definition.initial,
    tracks: Object.freeze(tracks),
    labels,
    durationMs,
  });
}
