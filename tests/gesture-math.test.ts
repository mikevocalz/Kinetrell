import { describe, expect, it } from 'vitest';
import {
  gestureSettleTarget,
  progressFromPanTranslation,
} from '../src/native/gesture-math.js';

describe('gesture progress math', () => {
  it('maps translation into bounded progress', () => {
    expect(progressFromPanTranslation(0.25, 50, 200)).toBe(0.5);
    expect(progressFromPanTranslation(0.25, -1000, 200)).toBe(0);
    expect(progressFromPanTranslation(0.75, 1000, 200)).toBe(1);
  });

  it('supports reversed motion direction', () => {
    expect(progressFromPanTranslation(0.5, 50, 200, -1)).toBe(0.25);
  });

  it('uses velocity projection for nearest settling', () => {
    expect(gestureSettleTarget(0.45, 0, 200)).toBe(0);
    expect(gestureSettleTarget(0.45, 900, 200)).toBe(1);
    expect(gestureSettleTarget(0.55, -900, 200)).toBe(0);
  });
});
