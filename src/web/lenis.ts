import Lenis from 'lenis';
import {
  ReactLenis,
  useLenis as useUpstreamLenis,
} from 'lenis/react';

export { ReactLenis };

export type KinetrellLenisOptions =
  NonNullable<ConstructorParameters<typeof Lenis>[0]>;

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
  callback: Parameters<Lenis['on']>[1],
) {
  const unsubscribe = lenis.on('scroll', callback as never);

  return () => {
    if (typeof unsubscribe === 'function') {
      unsubscribe();
    } else {
      lenis.off('scroll', callback as never);
    }
  };
}

export function useKinetrellLenis(
  callback?: Parameters<typeof useUpstreamLenis>[0],
  dependencies?: Parameters<typeof useUpstreamLenis>[1],
  priority?: Parameters<typeof useUpstreamLenis>[2],
) {
  return useUpstreamLenis(callback, dependencies, priority);
}
