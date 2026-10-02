import { describe, expect, it } from 'vitest';
import {
  directionalSnapPoint,
  logicalScrollOffset,
} from '../src/native/scroll-math.js';

describe('advanced scroll math', () => {
  it('converts physical horizontal offsets into RTL logical offsets', () => {
    expect(logicalScrollOffset(0, 1000, 300, true)).toBe(700);
    expect(logicalScrollOffset(700, 1000, 300, true)).toBe(0);
    expect(logicalScrollOffset(120, 1000, 300, false)).toBe(120);
  });

  it('uses nearest snap point below the velocity threshold', () => {
    expect(directionalSnapPoint(430, 100, [0, 400, 800])).toBe(400);
  });

  it('uses direction when the gesture exits quickly', () => {
    expect(directionalSnapPoint(430, 900, [0, 400, 800])).toBe(800);
    expect(directionalSnapPoint(430, -900, [0, 400, 800])).toBe(400);
  });

  it('clamps directional snapping at the ends', () => {
    expect(directionalSnapPoint(900, 900, [0, 400, 800])).toBe(800);
    expect(directionalSnapPoint(-20, -900, [0, 400, 800])).toBe(0);
  });
});
