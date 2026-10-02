import { describe, expect, it } from 'vitest';
import {
  compileMotion,
  defineMotion,
  evaluateMotion,
  interpolateColorValue,
  keyframesToTracks,
} from '../src/core/index.js';

describe('keyframes + colors', () => {
  it('expands normalized keyframes into deterministic tracks', () => {
    const tracks = keyframesToTracks(
      'box',
      [
        { offset: 0, value: { x: 0, opacity: 0 } },
        { offset: 0.25, value: { x: 50, opacity: 0.5 }, ease: 'quad.out' },
        { offset: 1, value: { x: 100, opacity: 1 } },
      ],
      { durationMs: 800, atMs: 100 },
    );

    expect(tracks).toHaveLength(2);
    expect(tracks[0]).toMatchObject({ atMs: 100, durationMs: 200 });
    expect(tracks[1]).toMatchObject({ atMs: 300, durationMs: 600 });
  });

  it('evaluates keyframe-generated tracks', () => {
    const tracks = keyframesToTracks(
      'box',
      [
        { offset: 0, value: { x: 0 } },
        { offset: 0.5, value: { x: 50 } },
        { offset: 1, value: { x: 100 } },
      ],
      { durationMs: 1000 },
    );

    const motion = compileMotion(
      defineMotion({
        id: 'keyframes',
        initial: { box: { x: 0 } },
        tracks,
      }),
    );

    expect(evaluateMotion(motion, 250).box.x).toBe(25);
    expect(evaluateMotion(motion, 750).box.x).toBe(75);
  });

  it('interpolates portable hex colors', () => {
    expect(interpolateColorValue('#000000', '#ffffff', 0.5)).toBe('#808080');
    expect(interpolateColorValue('#0000', '#ffff', 0.5)).toBe('#80808080');
  });

  it('uses color interpolation during motion evaluation', () => {
    const motion = compileMotion(
      defineMotion({
        id: 'color',
        initial: { box: { backgroundColor: '#000000' } },
        tracks: [
          {
            target: 'box',
            to: { backgroundColor: '#ffffff' },
            durationMs: 100,
          },
        ],
      }),
    );

    expect(evaluateMotion(motion, 50).box.backgroundColor).toBe('#808080');
  });
});
