import { defineMotion } from '../core/define.js';
import type {
  EaseName,
  MotionDefinition,
  MotionInitial,
  MotionState,
  MotionTrack,
} from '../core/types.js';

type Target = string | readonly string[];
type Position = number | string | undefined;
type Stagger = number | { each?: number };

type GsapVars = Record<string, unknown> & {
  duration?: number;
  delay?: number;
  ease?: string;
  repeat?: number;
  repeatDelay?: number;
  yoyo?: boolean;
  stagger?: Stagger;
};

type Recorder = {
  to(target: Target, vars: GsapVars, position?: Position): Recorder;
  from(target: Target, vars: GsapVars, position?: Position): Recorder;
  fromTo(target: Target, from: GsapVars, to: GsapVars, position?: Position): Recorder;
  set(target: Target, vars: GsapVars, position?: Position): Recorder;
  addLabel(name: string, position?: Position): Recorder;
};

const RESERVED = new Set([
  'duration',
  'delay',
  'ease',
  'repeat',
  'repeatDelay',
  'yoyo',
  'stagger',
  'onComplete',
  'onUpdate',
  'onStart',
]);

const EASES: Record<string, EaseName> = {
  none: 'linear',
  linear: 'linear',
  'power1.in': 'quad.in',
  'power1.out': 'quad.out',
  'power1.inOut': 'quad.inOut',
  'power2.in': 'power2.in',
  'power2.out': 'power2.out',
  'power2.inOut': 'power2.inOut',
  'quad.in': 'quad.in',
  'quad.out': 'quad.out',
  'quad.inOut': 'quad.inOut',
};

function values(vars: GsapVars): MotionState {
  const out: Record<string, number | string> = {};
  for (const [key, value] of Object.entries(vars)) {
    if (RESERVED.has(key)) continue;
    if (typeof value !== 'number' && typeof value !== 'string') {
      throw new TypeError(`Unsupported GSAP value for ${key}`);
    }
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

function staggerSeconds(stagger: Stagger | undefined): number {
  if (stagger === undefined) return 0;
  if (typeof stagger === 'number') return stagger;
  return stagger.each ?? 0;
}

export function recordGsap(
  initial: MotionInitial,
  build: (timeline: Recorder) => void,
  id = 'gsap-recording',
): MotionDefinition {
  const tracks: MotionTrack[] = [];
  const labels: Record<string, number> = {};
  let cursorMs = 0;
  let previousStartMs = 0;
  let previousEndMs = 0;

  const resolve = (position: Position): number => {
    if (position === undefined) return cursorMs;
    if (typeof position === 'number') return position * 1000;

    const directLabel = labels[position];
    if (directLabel !== undefined) return directLabel;

    const relative = position.match(/^([+-]=)(\d*\.?\d+)$/);
    if (relative) {
      return cursorMs + (relative[1] === '+=' ? 1 : -1) * Number(relative[2]) * 1000;
    }

    const labelRelative = position.match(/^([^<>+=-][^+=-]*)([+-]=)(\d*\.?\d+)$/);
    if (labelRelative) {
      const base = labels[labelRelative[1]!];
      if (base === undefined) throw new Error(`Unknown GSAP label: ${labelRelative[1]}`);
      return base + (labelRelative[2] === '+=' ? 1 : -1) * Number(labelRelative[3]) * 1000;
    }

    const sibling = position.match(/^([<>])(?:(\+=|-=)(\d*\.?\d+))?$/);
    if (sibling) {
      const base = sibling[1] === '<' ? previousStartMs : previousEndMs;
      if (!sibling[2]) return base;
      return base + (sibling[2] === '+=' ? 1 : -1) * Number(sibling[3]) * 1000;
    }

    throw new Error(`Unsupported GSAP position: ${position}`);
  };

  const addOne = (
    target: string,
    from: MotionState | undefined,
    toVars: GsapVars,
    atMs: number,
    forcedDuration?: number,
  ) => {
    if (!initial[target]) throw new Error(`Unknown registered target: ${target}`);

    const durationMs = (forcedDuration ?? toVars.duration ?? 0.5) * 1000;
    const track: MotionTrack = {
      target,
      from,
      to: values(toVars),
      atMs,
      durationMs,
      delayMs: (toVars.delay ?? 0) * 1000,
      ease: ease(toVars.ease),
      repeat: toVars.repeat ?? 0,
      repeatDelayMs: (toVars.repeatDelay ?? 0) * 1000,
      yoyo: toVars.yoyo ?? false,
    };

    tracks.push(track);
    const repeats = track.repeat ?? 0;
    const repeatDelay = track.repeatDelayMs ?? 0;
    const endMs =
      atMs +
      (track.delayMs ?? 0) +
      durationMs * (repeats + 1) +
      repeatDelay * repeats;

    previousStartMs = atMs;
    previousEndMs = endMs;
    cursorMs = Math.max(cursorMs, endMs);
  };

  const add = (
    target: Target,
    from: MotionState | undefined,
    toVars: GsapVars,
    position: Position,
    forcedDuration?: number,
  ) => {
    const atMs = resolve(position);
    const targets = typeof target === 'string' ? [target] : [...target];
    const eachMs = staggerSeconds(toVars.stagger) * 1000;

    targets.forEach((item, index) => {
      addOne(item, from, toVars, atMs + eachMs * index, forcedDuration);
    });
  };

  const recorder: Recorder = {
    to(target, vars, position) {
      add(target, undefined, vars, position);
      return recorder;
    },

    from(target, vars, position) {
      const targets = typeof target === 'string' ? [target] : [...target];
      const destination: GsapVars = {
        duration: vars.duration,
        delay: vars.delay,
        ease: vars.ease,
        repeat: vars.repeat,
        repeatDelay: vars.repeatDelay,
        yoyo: vars.yoyo,
        stagger: vars.stagger,
      };
      const atMs = resolve(position);
      const eachMs = staggerSeconds(vars.stagger) * 1000;
      targets.forEach((item, index) => {
        if (!initial[item]) throw new Error(`Unknown registered target: ${item}`);
        addOne(item, values(vars), { ...destination, ...initial[item] }, atMs + eachMs * index);
      });
      return recorder;
    },

    fromTo(target, fromVars, toVars, position) {
      add(target, values(fromVars), toVars, position);
      return recorder;
    },

    set(target, vars, position) {
      add(target, undefined, vars, position, 0);
      return recorder;
    },

    addLabel(name, position) {
      if (!name.trim()) throw new Error('Label name is required');
      labels[name] = resolve(position);
      cursorMs = Math.max(cursorMs, labels[name]!);
      return recorder;
    },
  };

  build(recorder);
  return defineMotion({ id, initial, tracks, labels });
}
