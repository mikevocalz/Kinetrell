import { describe, expect, it } from 'vitest';
import {
  compileMotion,
  defineMotion,
} from '../src/core/index.js';
import { createNativeTargetPlan } from '../src/native/plan.js';

describe('native target plan', () => {
  it('resolves implicit from values once at compile time', () => {
    const compiled = compileMotion(
      defineMotion({
        id: 'plan',
        initial: {
          card: { opacity: 0, x: 0 },
        },
        tracks: [
          {
            target: 'card',
            to: { x: 100 },
            durationMs: 100,
            ease: 'linear',
          },
          {
            target: 'card',
            to: { opacity: 1 },
            atMs: 50,
            durationMs: 100,
            ease: 'linear',
          },
        ],
      }),
    );

    const plan = createNativeTargetPlan(compiled, 'card');
    expect(plan.tracks).toHaveLength(2);
    expect(plan.tracks[0]?.from).toBe(0);
    expect(plan.tracks[1]?.from).toBe(0);
  });

  it('rejects unknown targets', () => {
    const compiled = compileMotion(
      defineMotion({
        id: 'plan',
        initial: { card: { opacity: 0 } },
        tracks: [],
      }),
    );

    expect(() => createNativeTargetPlan(compiled, 'missing')).toThrow(
      /Unknown motion target/,
    );
  });
});
