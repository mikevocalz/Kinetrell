import Lenis, {
  type LenisOptions,
  type ScrollCallback,
} from 'lenis';
import {
  ReactLenis,
  useLenis as useUpstreamLenis,
} from 'lenis/react';

export { ReactLenis };

export type KinetrellLenisOptions = LenisOptions;

export type OwnedLenis = Readonly<{
  lenis: Lenis;
  owned: true;
  start: () => void;
  stop: () => void;
  destroy: () => void;
}>;

export function createKinetrellLenis(
  options: KinetrellLenisOptions = {},
): OwnedLenis {
  const autoRaf = options.autoRaf ?? false;
  const lenis = new Lenis({ ...options, autoRaf });

  let rafId: number | null = null;
  let destroyed = false;

  const raf = (time: number) => {
    if (destroyed) return;
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  };

  const start = () => {
    if (destroyed || autoRaf || rafId !== null) return;
    rafId = requestAnimationFrame(raf);
  };

  const stop = () => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
  };

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    stop();
    lenis.destroy();
  };

  return { lenis, owned: true, start, stop, destroy };
}

export function observeLenis(
  lenis: Lenis,
  callback: ScrollCallback,
) {
  const unsubscribe = lenis.on('scroll', callback);
  return () => unsubscribe();
}

export function useKinetrellLenis(
  callback?: ScrollCallback,
  dependencies: unknown[] = [],
  priority = 0,
) {
  return useUpstreamLenis(callback, dependencies, priority);
}
