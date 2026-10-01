import { describe, expect, it } from 'vitest';
import {
  nearestSnapPoint,
  normalizeRange,
  parallaxFromProgress,
  sectionViewportProgress,
} from '../src/native/scroll-math.js';

describe('scroll choreography math', () => {
  it('normalizes and clamps ranges', () => {
    expect(normalizeRange(-10, 0, 100)).toBe(0);
    expect(normalizeRange(50, 0, 100)).toBe(0.5);
    expect(normalizeRange(110, 0, 100)).toBe(1);
  });

  it('measures section progress in one content coordinate space', () => {
    // section starts at 500, is 200 long, viewport is 300:
    // enters at offset 200 and leaves at offset 700.
    expect(sectionViewportProgress(200, 500, 200, 300)).toBe(0);
    expect(sectionViewportProgress(450, 500, 200, 300)).toBe(0.5);
    expect(sectionViewportProgress(700, 500, 200, 300)).toBe(1);
  });

  it('maps progress to centered parallax distance', () => {
    expect(parallaxFromProgress(0, 40)).toBe(-40);
    expect(parallaxFromProgress(0.5, 40)).toBe(0);
    expect(parallaxFromProgress(1, 40)).toBe(40);
  });

  it('selects the nearest snap point', () => {
    expect(nearestSnapPoint(132, [0, 100, 250])).toBe(100);
    expect(nearestSnapPoint(200, [0, 100, 250])).toBe(250);
    expect(nearestSnapPoint(10, [])).toBeNull();
  });
});
