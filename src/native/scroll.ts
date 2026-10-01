import { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

export type KinetrellScrollState = Readonly<{
  offset: { value: number };
  velocity: { value: number };
  direction: { value: -1 | 0 | 1 };
}>;

export function useKinetrellScroll() {
  const offset = useSharedValue(0);
  const velocity = useSharedValue(0);
  const direction = useSharedValue<-1 | 0 | 1>(0);
  const handler = useAnimatedScrollHandler({
    onScroll(event, context: { last?: number; time?: number }) {
      const now = globalThis.performance?.now?.() ?? 0;
      const next = event.contentOffset.y;
      const last = context.last ?? next;
      const dt = Math.max(1, now - (context.time ?? now));
      offset.value = next;
      velocity.value = ((next - last) / dt) * 1000;
      direction.value = next === last ? 0 : next > last ? 1 : -1;
      context.last = next;
      context.time = now;
    },
  });
  return { offset, velocity, direction, handler } as const;
}
