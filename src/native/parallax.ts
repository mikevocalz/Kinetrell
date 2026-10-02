import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

export type ParallaxAxis = 'x' | 'y';

export type ParallaxOptions = Readonly<{
  inputRange: readonly [number, number];
  translate?: readonly [number, number];
  scale?: readonly [number, number];
  opacity?: readonly [number, number];
  axis?: ParallaxAxis;
  extrapolate?: 'clamp' | 'extend';
}>;

/**
 * Cross-platform Reanimated parallax primitive.
 *
 * Pass the offset returned by `useKinetrellScroll()`. The calculation stays
 * on the UI runtime on native and follows Reanimated's web execution path.
 */
export function useParallaxStyle(
  offset: SharedValue<number>,
  options: ParallaxOptions
) {
  const {
    inputRange,
    translate = [0, 0],
    scale = [1, 1],
    opacity = [1, 1],
    axis = 'y',
    extrapolate = 'clamp',
  } = options;

  const mode =
    extrapolate === 'extend' ? Extrapolation.EXTEND : Extrapolation.CLAMP;

  return useAnimatedStyle(() => {
    const translation = interpolate(
      offset.value,
      inputRange as [number, number],
      translate as [number, number],
      mode
    );
    const resolvedScale = interpolate(
      offset.value,
      inputRange as [number, number],
      scale as [number, number],
      mode
    );
    const resolvedOpacity = interpolate(
      offset.value,
      inputRange as [number, number],
      opacity as [number, number],
      mode
    );

    return {
      opacity: resolvedOpacity,
      transform:
        axis === 'x'
          ? [{ translateX: translation }, { scale: resolvedScale }]
          : [{ translateY: translation }, { scale: resolvedScale }],
    };
  }, [axis, extrapolate, inputRange, opacity, scale, translate]);
}
