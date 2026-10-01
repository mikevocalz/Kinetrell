import type { ComponentProps } from 'react';
import Animated from 'react-native-reanimated';
import type { NativeMotionHandle } from './runtime.js';
import { useMotionStyle } from './runtime.js';

type MotionBinding = {
  motion: NativeMotionHandle;
  target: string;
};

type MotionViewProps = ComponentProps<typeof Animated.View> & MotionBinding;
type MotionTextProps = ComponentProps<typeof Animated.Text> & MotionBinding;
type MotionImageProps = ComponentProps<typeof Animated.Image> & MotionBinding;

export function MotionView({
  motion,
  target,
  style,
  ...props
}: MotionViewProps) {
  const motionStyle = useMotionStyle(motion, target);
  return <Animated.View {...props} style={[style, motionStyle]} />;
}

export function MotionText({
  motion,
  target,
  style,
  ...props
}: MotionTextProps) {
  const motionStyle = useMotionStyle(motion, target);
  return <Animated.Text {...props} style={[style, motionStyle]} />;
}

export function MotionImage({
  motion,
  target,
  style,
  ...props
}: MotionImageProps) {
  const motionStyle = useMotionStyle(motion, target);
  return <Animated.Image {...props} style={[style, motionStyle]} />;
}

export const Motion = Object.freeze({
  View: MotionView,
  Text: MotionText,
  Image: MotionImage,
});
