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

  it('supports labels, sibling anchors and relative offsets', () => {
    const motion = recordGsap(
      {
        a: { x: 0 },
        b: { x: 0 },
        c: { x: 0 },
      },
      (tl) => {
        tl.addLabel('intro', 0.25);
        tl.to('a', { x: 10, duration: 0.5 }, 'intro');
        tl.to('b', { x: 20, duration: 0.25 }, '<+=0.1');
        tl.to('c', { x: 30, duration: 0.2 }, '>-0.1');
      },
    );

    // "intro" starts at 250ms, "<+=0.1" at 350ms.
    const compiled = compileMotion(motion);
    expect(compiled.tracks[0]?.atMs).toBe(250);
    expect(compiled.tracks[1]?.atMs).toBe(350);
  });

  it('supports arrays with simple each-based stagger', () => {
    const motion = recordGsap(
      {
        a: { opacity: 0 },
        b: { opacity: 0 },
        c: { opacity: 0 },
      },
      (tl) => {
        tl.to(
          ['a', 'b', 'c'],
          { opacity: 1, duration: 0.2, stagger: 0.075 },
          0,
        );
      },
    );

    const compiled = compileMotion(motion);
    expect(compiled.tracks.map((track) => track.atMs)).toEqual([0, 75, 150]);
  });

  it('rejects unknown targets and unsupported ease names', () => {
    expect(() =>
      recordGsap({ box: { x: 0 } }, (tl) => {
        tl.to('missing', { x: 1 });
      }),
    ).toThrow(/Unknown registered target/);

    expect(() =>
      recordGsap({ box: { x: 0 } }, (tl) => {
        tl.to('box', { x: 1, ease: 'elastic.out' });
      }),
    ).toThrow(/Unsupported GSAP ease/);
  });
});
