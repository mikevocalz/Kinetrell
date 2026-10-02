import { interpolateColor } from 'react-native-reanimated';
import type { EaseName, MotionValue } from '../core/types.js';
import type { NativeTargetPlan } from './plan.js';

const COLOR_PROPERTIES = [
  'backgroundColor',
  'color',
  'borderColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'shadowColor',
] as const;

function isColorProperty(property: string) {
  'worklet';
  for (let index = 0; index < COLOR_PROPERTIES.length; index += 1) {
    if (COLOR_PROPERTIES[index] === property) return true;
  }
  return false;
}

function easeProgress(name: EaseName, value: number) {
  'worklet';
  const t = Math.min(1, Math.max(0, value));

  switch (name) {
    case 'linear':
      return t;
    case 'quad.in':
      return t * t;
    case 'quad.out':
      return 1 - (1 - t) * (1 - t);
    case 'quad.inOut':
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    case 'cubic.in':
    case 'power2.in':
      return t * t * t;
    case 'cubic.out':
    case 'power2.out':
      return 1 - Math.pow(1 - t, 3);
    case 'cubic.inOut':
    case 'power2.inOut':
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
}

function directedTrackProgress(
  timeMs: number,
  startMs: number,
  durationMs: number,
  repeat: number,
  repeatDelayMs: number,
  yoyo: boolean,
  ease: EaseName,
) {
  'worklet';

  if (timeMs < startMs) return -1;
  if (durationMs === 0) return yoyo && repeat % 2 === 1 ? 0 : 1;

  const local = timeMs - startMs;
  const maxLocal = durationMs * (repeat + 1) + repeatDelayMs * repeat;
  const bounded = Math.min(Math.max(0, local), maxLocal);
  const cycleSpan = durationMs + repeatDelayMs;

  let cycle = cycleSpan === 0 ? repeat : Math.floor(bounded / cycleSpan);
  if (cycle > repeat) cycle = repeat;

  const withinCycle = bounded - cycle * cycleSpan;
  const raw = withinCycle >= durationMs ? 1 : withinCycle / durationMs;
  const directed = yoyo && cycle % 2 === 1 ? 1 - raw : raw;

  return easeProgress(ease, directed);
}

function interpolateValue(
  property: string,
  from: MotionValue,
  to: MotionValue,
  progress: number,
): MotionValue {
  'worklet';

  if (typeof from === 'number' && typeof to === 'number') {
    return from + (to - from) * progress;
  }

  if (
    isColorProperty(property) &&
    typeof from === 'string' &&
    typeof to === 'string'
  ) {
    return interpolateColor(progress, [0, 1], [from, to]) as string | number;
  }

  return progress < 1 ? from : to;
}

export function evaluateNativePlan(plan: NativeTargetPlan, timeMs: number) {
  'worklet';

  const values: Record<string, MotionValue> = {};
  const initialKeys = Object.keys(plan.initial);

  for (let index = 0; index < initialKeys.length; index += 1) {
    const key = initialKeys[index]!;
    values[key] = plan.initial[key]!;
  }

  for (let index = 0; index < plan.tracks.length; index += 1) {
    const track = plan.tracks[index]!;
    const progress = directedTrackProgress(
      timeMs,
      track.startMs,
      track.durationMs,
      track.repeat,
      track.repeatDelayMs,
      track.yoyo,
      track.ease,
    );

    if (progress < 0) continue;

    values[track.property] = interpolateValue(
      track.property,
      track.from,
      track.to,
      progress,
    );
  }

  return values;
}

export function valuesToAnimatedStyle(values: Record<string, MotionValue>) {
  'worklet';

  const style: Record<string, unknown> = {};
  const transform: Record<string, unknown>[] = [];
  const keys = Object.keys(values);

  for (let index = 0; index < keys.length; index += 1) {
    const property = keys[index]!;
    const value = values[property]!;

    switch (property) {
      case 'x':
      case 'translateX':
        transform.push({ translateX: value });
        break;
      case 'y':
      case 'translateY':
        transform.push({ translateY: value });
        break;
      case 'scale':
        transform.push({ scale: value });
        break;
      case 'scaleX':
        transform.push({ scaleX: value });
        break;
      case 'scaleY':
        transform.push({ scaleY: value });
        break;
      case 'rotation':
      case 'rotate':
        transform.push({
          rotate: typeof value === 'number' ? `${value}deg` : value,
        });
        break;
      default:
        style[property] = value;
        break;
    }
  }

  if (transform.length > 0) style.transform = transform;
  return style;
}
