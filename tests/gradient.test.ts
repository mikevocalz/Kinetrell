import { describe, expect, it } from 'vitest';
import { gradientToBackgroundImage } from '../src/native/gradient.js';

describe('gradientToBackgroundImage', () => {
  it('serializes linear gradients', () => {
    expect(gradientToBackgroundImage({
      type: 'linear-gradient',
      angle: 90,
      stops: [
        { color: '#000', position: 0 },
        { color: '#fff', position: 1 },
      ],
    })).toBe('linear-gradient(90deg, #000 0%, #fff 100%)');
  });

  it('serializes radial gradients and clamps stop positions', () => {
    expect(gradientToBackgroundImage({
      type: 'radial-gradient',
      stops: [
        { color: 'red', position: -1 },
        { color: 'blue', position: 2 },
      ],
    })).toBe('radial-gradient(red 0%, blue 100%)');
  });
});
