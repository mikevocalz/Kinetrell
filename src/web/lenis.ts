import Lenis from 'lenis';

export type KinetrellLenisOptions = ConstructorParameters<typeof Lenis>[0] & { autoRaf?: boolean };

export function createKinetrellLenis(options: KinetrellLenisOptions = {}) {
  const lenis = new Lenis({ autoRaf: false, ...options });
  let rafId: number | null = null;
  const raf = (time: number) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
  return {
    lenis,
    start() { if (rafId === null) rafId = requestAnimationFrame(raf); },
    stop() { if (rafId !== null) cancelAnimationFrame(rafId); rafId = null; },
    destroy() { if (rafId !== null) cancelAnimationFrame(rafId); rafId = null; lenis.destroy(); },
  };
}
