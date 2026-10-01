import { defineMotion } from '../core/define.js';
import type { EaseName, MotionDefinition, MotionInitial, MotionState, MotionTrack } from '../core/types.js';

type GsapVars = Record<string, unknown> & { duration?: number; delay?: number; ease?: string; repeat?: number; repeatDelay?: number; yoyo?: boolean };
type Position = number | string | undefined;

type Recorder = {
  to(target: string, vars: GsapVars, position?: Position): Recorder;
  from(target: string, vars: GsapVars, position?: Position): Recorder;
  fromTo(target: string, from: GsapVars, to: GsapVars, position?: Position): Recorder;
  set(target: string, vars: GsapVars, position?: Position): Recorder;
  addLabel(name: string, position?: Position): Recorder;
};

const RESERVED = new Set(['duration','delay','ease','repeat','repeatDelay','yoyo','stagger','onComplete','onUpdate','onStart']);
const EASES: Record<string, EaseName> = {
  none: 'linear', linear: 'linear',
  'power2.in': 'power2.in', 'power2.out': 'power2.out', 'power2.inOut': 'power2.inOut',
  'quad.in': 'quad.in', 'quad.out': 'quad.out', 'quad.inOut': 'quad.inOut',
};

function values(vars: GsapVars): MotionState {
  const out: Record<string, number | string> = {};
  for (const [key, value] of Object.entries(vars)) {
    if (RESERVED.has(key)) continue;
    if (typeof value !== 'number' && typeof value !== 'string') throw new TypeError(`Unsupported GSAP value for ${key}`);
    out[key] = value;
  }
  return out;
}

function ease(name?: string): EaseName {
  if (!name) return 'linear';
  const mapped = EASES[name];
  if (!mapped) throw new Error(`Unsupported GSAP ease: ${name}`);
  return mapped;
}

export function recordGsap(initial: MotionInitial, build: (timeline: Recorder) => void, id = 'gsap-recording'): MotionDefinition {
  const tracks: MotionTrack[] = [];
  const labels: Record<string, number> = {};
  let cursorMs = 0;
  const resolve = (position: Position): number => {
    if (position === undefined) return cursorMs;
    if (typeof position === 'number') return position * 1000;
    if (position in labels) return labels[position]!;
    const relative = position.match(/^([+-]=)(\d*\.?\d+)$/);
    if (relative) return cursorMs + (relative[1] === '+=' ? 1 : -1) * Number(relative[2]) * 1000;
    throw new Error(`Unsupported GSAP position: ${position}`);
  };
  const add = (target: string, from: MotionState | undefined, toVars: GsapVars, position: Position, forcedDuration?: number) => {
    const atMs = resolve(position);
    const durationMs = (forcedDuration ?? toVars.duration ?? 0.5) * 1000;
    const track: MotionTrack = {
      target, from, to: values(toVars), atMs, durationMs,
      delayMs: (toVars.delay ?? 0) * 1000,
      ease: ease(toVars.ease), repeat: toVars.repeat ?? 0,
      repeatDelayMs: (toVars.repeatDelay ?? 0) * 1000, yoyo: toVars.yoyo ?? false,
    };
    tracks.push(track);
    cursorMs = Math.max(cursorMs, atMs + durationMs + (track.delayMs ?? 0));
  };
  const recorder: Recorder = {
    to(target, vars, position) { add(target, undefined, vars, position); return recorder; },
    from(target, vars, position) { add(target, values(vars), { ...initial[target], duration: vars.duration, ease: vars.ease }, position); return recorder; },
    fromTo(target, fromVars, toVars, position) { add(target, values(fromVars), toVars, position); return recorder; },
    set(target, vars, position) { add(target, undefined, vars, position, 0); return recorder; },
    addLabel(name, position) { labels[name] = resolve(position); cursorMs = Math.max(cursorMs, labels[name]!); return recorder; },
  };
  build(recorder);
  return defineMotion({ id, initial, tracks, labels });
}
