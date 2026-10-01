import gsap from 'gsap';
import type { CompiledMotion } from '../core/types.js';

export type GsapTargetMap = Readonly<Record<string, gsap.TweenTarget>>;

function seconds(ms: number) { return ms / 1000; }
function ease(name: string) { return name === 'linear' ? 'none' : name.replace('quad.', 'power2.').replace('cubic.', 'power3.'); }

export function createGsapTimeline(motion: CompiledMotion, targets: GsapTargetMap, options?: { paused?: boolean }) {
  const timeline = gsap.timeline({ paused: options?.paused ?? true });
  for (const track of motion.tracks) {
    const target = targets[track.target];
    if (!target) throw new Error(`Missing GSAP target: ${track.target}`);
    if (track.from) gsap.set(target, track.from as gsap.TweenVars);
    timeline.to(target, {
      ...(track.to as gsap.TweenVars),
      duration: seconds(track.durationMs),
      delay: seconds(track.delayMs ?? 0),
      ease: ease(track.ease),
      repeat: track.repeat ?? 0,
      repeatDelay: seconds(track.repeatDelayMs ?? 0),
      yoyo: track.yoyo ?? false,
    }, seconds(track.atMs));
  }
  return timeline;
}
