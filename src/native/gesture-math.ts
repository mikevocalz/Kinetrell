export function clampGestureProgress(value: number): number {
  'worklet';
  return Math.min(1, Math.max(0, value));
}

export function progressFromPanTranslation(
  startProgress: number,
  translation: number,
  distance: number,
  direction: 1 | -1 = 1,
): number {
  'worklet';
  const span = Math.max(1, Math.abs(distance));
  return clampGestureProgress(
    startProgress + (translation / span) * direction,
  );
}

export function gestureSettleTarget(
  progress: number,
  velocity: number,
  distance: number,
  velocityInfluenceMs = 180,
): 0 | 1 {
  'worklet';
  const span = Math.max(1, Math.abs(distance));
  const projected =
    progress + (velocity * velocityInfluenceMs) / 1000 / span;
  return clampGestureProgress(projected) >= 0.5 ? 1 : 0;
}
