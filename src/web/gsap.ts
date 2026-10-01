import { useRef } from 'react';
import type { DependencyList } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { CompiledMotion, EaseName } from '../core/types.js';

export type GsapTargetMap = Readonly<Record<string, gsap.TweenTarget>>;

export type GsapTimelineOptions = Readonly<{
  paused?: boolean;
}>;

let scrollTriggerRegistered = false;

export function toGsapEase(name: EaseName): string {
  switch (name) {
    case 'linear':
      return 'none';
    case 'quad.in':
      return 'power1.in';
    case 'quad.out':
      return 'power1.out';
    case 'quad.inOut':
      return 'power1.inOut';
    case 'cubic.in':
    case 'power2.in':
      return 'power2.in';
    case 'cubic.out':
    case 'power2.out':
      return 'power2.out';
    case 'cubic.inOut':
    case 'power2.inOut':
      return 'power2.inOut';
  }
}

function seconds(milliseconds: number): number {
  return milliseconds / 1000;
}

export function ensureScrollTrigger(): boolean {
  if (typeof window === 'undefined') return false;
  if (!scrollTriggerRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    scrollTriggerRegistered = true;
  }
  return true;
}

export function createGsapTimeline(
  motion: CompiledMotion,
  targets: GsapTargetMap,
  options: GsapTimelineOptions = {},
) {
  const timeline = gsap.timeline({ paused: options.paused ?? true });

  for (const [targetId, initial] of Object.entries(motion.initial)) {
    const target = targets[targetId];
    if (!target) throw new Error(`Missing GSAP target: ${targetId}`);
    timeline.set(target, initial as gsap.TweenVars, 0);
  }

  for (const track of motion.tracks) {
    const target = targets[track.target];
    if (!target) throw new Error(`Missing GSAP target: ${track.target}`);

    const vars: gsap.TweenVars = {
      ...(track.to as gsap.TweenVars),
      duration: seconds(track.durationMs),
      delay: seconds(track.delayMs ?? 0),
      ease: toGsapEase(track.ease),
      repeat: track.repeat ?? 0,
      repeatDelay: seconds(track.repeatDelayMs ?? 0),
      yoyo: track.yoyo ?? false,
    };

    const position = seconds(track.atMs);

    if (track.from) {
      timeline.fromTo(
        target,
        track.from as gsap.TweenVars,
        vars,
        position,
      );
    } else {
      timeline.to(target, vars, position);
    }
  }

  return timeline;
}

export type ScrollTriggerConfig = Parameters<typeof ScrollTrigger.create>[0];

export function attachScrollTrigger(
  timeline: gsap.core.Timeline,
  config: Omit<ScrollTriggerConfig, 'animation'>,
) {
  if (!ensureScrollTrigger()) {
    throw new Error('ScrollTrigger requires a browser runtime');
  }

  return ScrollTrigger.create({
    ...config,
    animation: timeline,
  });
}

export function useGsapMotion(
  motion: CompiledMotion,
  targets: GsapTargetMap,
  options: Readonly<{
    autoplay?: boolean;
    dependencies?: DependencyList;
  }> = {},
) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const timeline = createGsapTimeline(motion, targets, { paused: true });
      timelineRef.current = timeline;

      if (options.autoplay) timeline.play();

      return () => {
        timeline.kill();
        if (timelineRef.current === timeline) timelineRef.current = null;
      };
    },
    {
      dependencies: [
        motion,
        targets,
        options.autoplay,
        ...(options.dependencies ?? []),
      ],
      revertOnUpdate: true,
    },
  );

  return timelineRef;
}
