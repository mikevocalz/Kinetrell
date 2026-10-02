export type ReducedMotionBehavior = 'finish' | 'pause';

export function reducedMotionDestination(
  currentMs: number,
  durationMs: number,
  direction: 1 | -1,
  behavior: ReducedMotionBehavior,
): number {
  if (behavior === 'pause') {
    return Math.min(Math.max(0, currentMs), Math.max(0, durationMs));
  }
  return direction === 1 ? Math.max(0, durationMs) : 0;
}
