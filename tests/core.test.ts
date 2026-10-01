import { describe, expect, it } from 'vitest';
import { compileMotion, defineMotion, evaluateMotion, TimelineClock } from '../src/core/index.js';

const def = defineMotion({
  id: 'intro',
  initial: { box: { x: 0, opacity: 0 } },
  tracks: [
    { target: 'box', to: { x: 100, opacity: 1 }, durationMs: 1000, ease: 'linear' as const },
  ],
});

describe('core', () => {
  it('compiles and evaluates deterministically', () => {
    const compiled = compileMotion(def);
    const half = evaluateMotion(compiled, 500);
    expect(half.box.x).toBe(50);
    expect(half.box.opacity).toBe(0.5);
  });

  it('supports seeking and playback direction', () => {
    const clock = new TimelineClock(compileMotion(def));
    clock.setProgress(0.5).reverse().tick(100);
    expect(clock.snapshot.timeMs).toBe(400);
  });
});
