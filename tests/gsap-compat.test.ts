import { describe, expect, it } from 'vitest';
import { compileMotion } from '../src/core/index.js';
import { recordGsap } from '../src/compat/gsap.js';

describe('GSAP compatibility recorder', () => {
  it('converts seconds into milliseconds', () => {
    const motion = recordGsap({ box: { x: 0 } }, (tl) => {
      tl.to('box', { x: 100, duration: 0.4, ease: 'power2.out' }, 0.2);
    });
    const compiled = compileMotion(motion);
    expect(compiled.tracks[0]?.atMs).toBe(200);
    expect(compiled.tracks[0]?.durationMs).toBe(400);
  });
});
