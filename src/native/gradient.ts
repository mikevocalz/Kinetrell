import type { GradientValue } from '../core/types.js';

function stopToCss(stop: GradientValue['stops'][number]) {
  const position = stop.position === undefined ? '' : ` ${Math.max(0, Math.min(1, stop.position)) * 100}%`;
  return `${stop.color}${position}`;
}

/**
 * Serializes Kinetrell gradients into the CSS gradient syntax accepted by
 * Reanimated 4.7+ `backgroundImage` on React Native 0.87+.
 */
export function gradientToBackgroundImage(value: GradientValue): string {
  const stops = value.stops.map(stopToCss).join(', ');
  if (value.type === 'radial-gradient') return `radial-gradient(${stops})`;
  const angle = Number.isFinite(value.angle) ? value.angle : 180;
  return `linear-gradient(${angle}deg, ${stops})`;
}
