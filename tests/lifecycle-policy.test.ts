import { describe, expect, it } from 'vitest';
import { reducedMotionDestination } from '../src/native/lifecycle.js';

describe('native lifecycle policy', () => {
  it('finishes forward motion when reduced motion activates', () => {
    expect(reducedMotionDestination(320, 1000, 1, 'finish')).toBe(1000);
  });

  it('finishes reverse motion at the initial state', () => {
    expect(reducedMotionDestination(320, 1000, -1, 'finish')).toBe(0);
  });

  it('can pause in place instead of jumping', () => {
    expect(reducedMotionDestination(320, 1000, 1, 'pause')).toBe(320);
  });

  it('clamps pause position into the scene duration', () => {
    expect(reducedMotionDestination(1200, 1000, 1, 'pause')).toBe(1000);
  });
});
