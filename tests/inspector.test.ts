import { describe, expect, it } from 'vitest';
import { compileMotion, defineMotion } from '../src/core/index.js';
import {
  createMotionInspector,
  findMotionConflicts,
} from '../src/dev/inspector.js';

describe('motion inspector', () => {
  const motion = compileMotion(
    defineMotion({
      id: 'inspect-me',
      initial: { card: { x: 0, opacity: 0 } },
      tracks: [
        {
          target: 'card',
          to: { x: 100, opacity: 1 },
          durationMs: 1000,
          ease: 'linear',
        },
        {
          target: 'card',
          to: { x: 40 },
          atMs: 500,
          durationMs: 250,
          ease: 'linear',
        },
      ],
    }),
  );

  it('returns active tracks and evaluated state at an arbitrary time', () => {
    const inspector = createMotionInspector(motion);
    const snapshot = inspector.snapshotAt(625);

    expect(snapshot.progress).toBe(0.625);
    expect(snapshot.activeTracks).toHaveLength(2);
    expect(snapshot.state.card).toBeDefined();
  });

  it('reports overlapping property ownership', () => {
    const diagnostics = findMotionConflicts(motion);
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]?.code).toBe('KINETRELL_CONFLICTING_OWNER');
    expect(diagnostics[0]?.property).toBe('x');
  });
});
