export function clamp01(value: number): number {
  'worklet';
  return Math.min(1, Math.max(0, value));
}

export function normalizeRange(
  value: number,
  start: number,
  end: number,
): number {
  'worklet';
  if (start === end) return value >= end ? 1 : 0;
  return clamp01((value - start) / (end - start));
}

/**
 * Progresses from 0 when the section's leading edge reaches the viewport's
 * trailing edge, to 1 when its trailing edge reaches the viewport's leading
 * edge. All values must use the same scroll-content coordinate space.
 */
export function sectionViewportProgress(
  offset: number,
  sectionStart: number,
  sectionLength: number,
  viewportLength: number,
): number {
  'worklet';
  const enterOffset = sectionStart - viewportLength;
  const leaveOffset = sectionStart + Math.max(0, sectionLength);
  return normalizeRange(offset, enterOffset, leaveOffset);
}

export function parallaxFromProgress(
  progress: number,
  distance: number,
  center = 0.5,
): number {
  'worklet';
  return (progress - center) * 2 * distance;
}

export function nearestSnapPoint(
  offset: number,
  points: readonly number[],
): number | null {
  'worklet';
  if (points.length === 0) return null;

  let nearest = points[0]!;
  let nearestDistance = Math.abs(offset - nearest);

  for (let index = 1; index < points.length; index += 1) {
    const point = points[index]!;
    const distance = Math.abs(offset - point);
    if (distance < nearestDistance) {
      nearest = point;
      nearestDistance = distance;
    }
  }

  return nearest;
}

export function sceneIsActive(
  progress: number,
  enterAt = 0,
  leaveAt = 1,
): boolean {
  'worklet';
  const start = clamp01(Math.min(enterAt, leaveAt));
  const end = clamp01(Math.max(enterAt, leaveAt));
  const value = clamp01(progress);
  return value >= start && value <= end;
}

export function logicalScrollOffset(
  physicalOffset: number,
  contentLength: number,
  viewportLength: number,
  rtl: boolean,
): number {
  'worklet';
  if (!rtl) return Math.max(0, physicalOffset);
  const maxOffset = Math.max(0, contentLength - viewportLength);
  return Math.max(0, Math.min(maxOffset, maxOffset - physicalOffset));
}

export function directionalSnapPoint(
  offset: number,
  velocity: number,
  points: readonly number[],
  velocityThreshold = 420,
): number | null {
  'worklet';
  if (points.length === 0) return null;

  const ordered = [...points].sort((a, b) => a - b);
  if (Math.abs(velocity) < velocityThreshold) {
    return nearestSnapPoint(offset, ordered);
  }

  if (velocity > 0) {
    for (const point of ordered) {
      if (point > offset) return point;
    }
    return ordered[ordered.length - 1]!;
  }

  for (let index = ordered.length - 1; index >= 0; index -= 1) {
    const point = ordered[index]!;
    if (point < offset) return point;
  }
  return ordered[0]!;
}
