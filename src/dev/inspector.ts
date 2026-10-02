import { evaluateMotion } from '../core/evaluate.js';
import {
  createDiagnostic,
  KINETRELL_DIAGNOSTIC_CODES,
  type KinetrellDiagnostic,
} from '../core/diagnostics.js';
import type { CompiledMotion, MotionState } from '../core/types.js';

export type InspectorTrack = Readonly<{
  index: number;
  target: string;
  properties: readonly string[];
  startMs: number;
  endMs: number;
}>;

export type MotionInspectorSnapshot = Readonly<{
  sceneId: string;
  timeMs: number;
  progress: number;
  activeTracks: readonly InspectorTrack[];
  state: Readonly<Record<string, MotionState>>;
}>;

function clampTime(motion: CompiledMotion, timeMs: number) {
  return Math.min(motion.durationMs, Math.max(0, timeMs));
}

function trackSummary(
  motion: CompiledMotion,
  index: number,
): InspectorTrack {
  const track = motion.tracks[index]!;
  return Object.freeze({
    index,
    target: track.target,
    properties: Object.freeze(Object.keys(track.to)),
    startMs: track.atMs + (track.delayMs ?? 0),
    endMs: track.endMs,
  });
}

export function findMotionConflicts(
  motion: CompiledMotion,
): readonly KinetrellDiagnostic[] {
  const diagnostics: KinetrellDiagnostic[] = [];

  for (let left = 0; left < motion.tracks.length; left += 1) {
    const a = motion.tracks[left]!;
    const aStart = a.atMs + (a.delayMs ?? 0);

    for (let right = left + 1; right < motion.tracks.length; right += 1) {
      const b = motion.tracks[right]!;
      if (a.target !== b.target) continue;

      const bStart = b.atMs + (b.delayMs ?? 0);
      const overlaps = aStart <= b.endMs && bStart <= a.endMs;
      if (!overlaps) continue;

      const aProps = new Set(Object.keys(a.to));
      for (const property of Object.keys(b.to)) {
        if (!aProps.has(property)) continue;
        diagnostics.push(
          createDiagnostic(
            KINETRELL_DIAGNOSTIC_CODES.CONFLICTING_OWNER,
            `Tracks ${left} and ${right} both write ${a.target}.${property} during an overlapping interval.`,
            {
              sceneId: motion.id,
              target: a.target,
              property,
              correctiveAction:
                'Move the tracks apart, split property ownership, or rely on the documented later-track-wins rule intentionally.',
            },
          ),
        );
      }
    }
  }

  return Object.freeze(diagnostics);
}

export function createMotionInspector(motion: CompiledMotion) {
  const tracks = Object.freeze(
    motion.tracks.map((_, index) => trackSummary(motion, index)),
  );
  const diagnostics = findMotionConflicts(motion);

  return Object.freeze({
    sceneId: motion.id,
    durationMs: motion.durationMs,
    labels: motion.labels,
    tracks,
    diagnostics,
    snapshotAt(timeMs: number): MotionInspectorSnapshot {
      if (!Number.isFinite(timeMs)) {
        throw new RangeError('Inspector time must be finite');
      }

      const time = clampTime(motion, timeMs);
      const activeTracks = tracks.filter(
        (track) => time >= track.startMs && time <= track.endMs,
      );

      return Object.freeze({
        sceneId: motion.id,
        timeMs: time,
        progress: motion.durationMs === 0 ? 1 : time / motion.durationMs,
        activeTracks: Object.freeze(activeTracks),
        state: Object.freeze(evaluateMotion(motion, time)),
      });
    },
  });
}
