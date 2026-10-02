import { describe, expect, it } from 'vitest';
import {
  applyEase,
  compileMotion,
  defineMotion,
  evaluateMotion,
  TimelineClock,
} from '../src/core/index.js';

const def = defineMotion({
  id: 'intro',
  initial: { box: { x: 0, opacity: 0 } },
  tracks: [
    {
      target: 'box',
      to: { x: 100, opacity: 1 },
      durationMs: 1000,
      ease: 'linear' as const,
    },
  ],
});

describe('core', () => {
  it('compiles and evaluates deterministically', () => {
    const compiled = compileMotion(def);
    const half = evaluateMotion(compiled, 500);
    expect(half.box.x).toBe(50);
    expect(half.box.opacity).toBe(0.5);
  });

  it('keeps repeat-delay at the previous cycle endpoint', () => {
    const compiled = compileMotion(
      defineMotion({
        id: 'repeat-delay',
        initial: { box: { x: 0 } },
        tracks: [
          {
            target: 'box',
            to: { x: 100 },
            durationMs: 100,
            repeat: 1,
            repeatDelayMs: 50,
            ease: 'linear',
          },
        ],
      }),
    );

    expect(evaluateMotion(compiled, 120).box.x).toBe(100);
    expect(evaluateMotion(compiled, 175).box.x).toBe(25);
  });

  it('applies initial delay once when calculating repeated track duration', () => {
    const compiled = compileMotion(
      defineMotion({
        id: 'delay-repeat-duration',
        initial: { box: { x: 0 } },
        tracks: [
          {
            target: 'box',
            to: { x: 100 },
            delayMs: 50,
            durationMs: 100,
            repeat: 2,
            repeatDelayMs: 25,
            ease: 'linear',
          },
        ],
      }),
    );

    // 50 initial delay + 3 x 100ms cycles + 2 x 25ms repeat delays.
    expect(compiled.durationMs).toBe(400);
  });

  it('reverses yoyo cycles deterministically', () => {
    const compiled = compileMotion(
      defineMotion({
        id: 'yoyo',
        initial: { box: { x: 0 } },
        tracks: [
          {
            target: 'box',
            to: { x: 100 },
            durationMs: 100,
            repeat: 1,
            yoyo: true,
            ease: 'linear',
          },
        ],
      }),
    );

    expect(evaluateMotion(compiled, 150).box.x).toBe(50);
    expect(evaluateMotion(compiled, 200).box.x).toBe(0);
  });

  it('expands keyframes into deterministic compiled segments', () => {
    const compiled = compileMotion(
      defineMotion({
        id: 'keyframes',
        initial: { box: { x: 0, opacity: 0 } },
        tracks: [
          {
            target: 'box',
            durationMs: 1000,
            keyframes: [
              { offset: 0.5, values: { x: 100 }, ease: 'linear' },
              {
                offset: 1,
                values: { x: 0, opacity: 1 },
                ease: 'linear',
              },
            ],
          },
        ],
      }),
    );

    expect(compiled.tracks).toHaveLength(2);
    expect(compiled.tracks.map((track) => track.durationMs)).toEqual([500, 500]);
    expect(evaluateMotion(compiled, 250).box.x).toBe(50);
    expect(evaluateMotion(compiled, 750).box.x).toBe(50);
    expect(evaluateMotion(compiled, 750).box.opacity).toBe(0.5);
  });

  it('validates keyframe offsets and loop combinations', () => {
    expect(() =>
      compileMotion(
        defineMotion({
          id: 'bad-keyframes',
          initial: { box: { x: 0 } },
          tracks: [
            {
              target: 'box',
              durationMs: 1000,
              keyframes: [
                { offset: 0.8, values: { x: 80 } },
                { offset: 0.7, values: { x: 100 } },
              ],
            },
          ],
        }),
      ),
    ).toThrow(/strictly increasing/);

    expect(() =>
      compileMotion(
        defineMotion({
          id: 'keyframe-repeat',
          initial: { box: { x: 0 } },
          tracks: [
            {
              target: 'box',
              durationMs: 1000,
              repeat: 1,
              keyframes: [{ offset: 1, values: { x: 100 } }],
            },
          ],
        }),
      ),
    ).toThrow(/cannot currently combine/);
  });

  it('maps GSAP power2 to a cubic polynomial', () => {
    expect(applyEase('power2.in', 0.5)).toBe(0.125);
    expect(applyEase('power2.out', 0.5)).toBe(0.875);
  });

  it('supports seeking, reverse playback, completion, cancellation and disposal', () => {
    const clock = new TimelineClock(compileMotion(def));

    clock.setProgress(0.5).reverse().tick(100);
    expect(clock.snapshot.timeMs).toBe(400);

    clock.reverse().tick(1000);
    expect(clock.snapshot.timeMs).toBe(0);
    expect(clock.snapshot.status).toBe('completed');

    clock.restart().cancel();
    expect(clock.snapshot.status).toBe('cancelled');

    clock.dispose();
    expect(clock.snapshot.status).toBe('disposed');
    expect(() => clock.play()).toThrow(/disposed/);
  });
});
