import gsap from 'gsap';
import type Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ensureScrollTrigger } from './gsap.js';

export type GsapLenisClockOwnership = 'kinetrell' | 'external';

export type GsapLenisBridgeOptions = Readonly<{
  clock?: GsapLenisClockOwnership;
  refreshOnConnect?: boolean;
}>;

const drivenInstances = new WeakMap<object, symbol>();

export function connectGsapLenis(
  lenis: Lenis,
  options: GsapLenisBridgeOptions = {},
) {
  if (!ensureScrollTrigger()) {
    throw new Error('GSAP + Lenis integration requires a browser runtime');
  }

  const clock = options.clock ?? 'kinetrell';
  const token = Symbol('kinetrell-gsap-lenis');
  let disconnected = false;

  if (clock === 'kinetrell') {
    if (drivenInstances.has(lenis)) {
      throw new Error(
        'This Lenis instance already has a Kinetrell GSAP ticker owner',
      );
    }
    drivenInstances.set(lenis, token);
  }

  const onScroll = () => ScrollTrigger.update();
  const unsubscribe = lenis.on('scroll', onScroll);

  const tick = (timeSeconds: number) => {
    // GSAP ticker time is seconds; Lenis raf time is milliseconds.
    lenis.raf(timeSeconds * 1000);
  };

  if (clock === 'kinetrell') gsap.ticker.add(tick);
  if (options.refreshOnConnect ?? true) ScrollTrigger.refresh();

  return () => {
    if (disconnected) return;
    disconnected = true;

    if (typeof unsubscribe === 'function') {
      unsubscribe();
    } else {
      lenis.off('scroll', onScroll);
    }

    if (clock === 'kinetrell') {
      gsap.ticker.remove(tick);
      if (drivenInstances.get(lenis) === token) drivenInstances.delete(lenis);
    }
  };
}
