import gsap from 'gsap';
import Lenis from 'lenis';

export function connectGsapLenis(lenis: Lenis) {
  const update = (timeSeconds: number) => lenis.raf(timeSeconds * 1000);
  gsap.ticker.add(update);
  return () => gsap.ticker.remove(update);
}
