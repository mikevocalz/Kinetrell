import { describe, expect, it } from 'vitest';
import {
  compileMotion,
  defineMotion,
} from '../src/core/index.js';
import {
  createGsapTimeline,
  toGsapEase,
} from '../src/web/gsap.js';

describe('real GSAP adapter', () => {
  it('maps Kinetrell easing families to GSAP correctly', () => {
    expect(toGsapEase('linear')).toBe('none');
    expect(toGsapEase('quad.out')).toBe('power1.out');
    expect(toGsapEase('cubic.out')).toBe('power2.out');
    expect(toGsapEase('power2.inOut')).toBe('power2.inOut');
  });

  it('executes a compiled timeline through the actual gsap package', () => {
    const motion = compileMotion(
      defineMotion({
        id: 'gsap-object',
        initial: { box: { x: 0 } },
        tracks: [
          {
            target: 'box',
            to: { x: 100 },
            durationMs: 1000,
            ease: 'linear',
          },
        ],
      }),
    );

    const box = { x: 0 };
    const timeline = createGsapTimeline(motion, { box });

    timeline.seek(0.5, false);
    expect(box.x).toBeCloseTo(50, 4);

    timeline.seek(1, false);
    expect(box.x).toBeCloseTo(100, 4);

    timeline.kill();
  });
});
