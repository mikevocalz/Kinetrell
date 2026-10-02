export type MotionPrimitive = number | string;

export type GradientStop = { color: string; position?: number };
export type LinearGradientValue = {
  type: 'linear-gradient';
  angle?: number;
  stops: readonly GradientStop[];
};
export type RadialGradientValue = {
  type: 'radial-gradient';
  stops: readonly GradientStop[];
};
export type GradientValue = LinearGradientValue | RadialGradientValue;

export type MotionValue = MotionPrimitive | GradientValue;
export type MotionState = Readonly<Record<string, MotionValue>>;
export type MotionInitial = Readonly<Record<string, MotionState>>;

export type EaseName =
  | 'linear'
  | 'quad.in'
  | 'quad.out'
  | 'quad.inOut'
  | 'cubic.in'
  | 'cubic.out'
  | 'cubic.inOut'
  | 'power2.in'
  | 'power2.out'
  | 'power2.inOut';

type MotionTrackBase = Readonly<{
  target: string;
  from?: MotionState;
  atMs?: number;
  durationMs: number;
  delayMs?: number;
  ease?: EaseName;
  repeat?: number;
  repeatDelayMs?: number;
  yoyo?: boolean;
}>;

export type MotionTweenTrack = MotionTrackBase &
  Readonly<{
    to: MotionState;
    keyframes?: never;
  }>;

export type MotionKeyframe = Readonly<{
  offset: number;
  values: MotionState;
  ease?: EaseName;
}>;

export type MotionKeyframeTrack = MotionTrackBase &
  Readonly<{
    keyframes: readonly MotionKeyframe[];
    to?: never;
  }>;

export type MotionTrack = MotionTweenTrack | MotionKeyframeTrack;

export type MotionDefinition = Readonly<{
  schemaVersion?: 1;
  id: string;
  initial: MotionInitial;
  tracks: readonly MotionTrack[];
  labels?: Readonly<Record<string, number>>;
}>;

export type CompiledTrack = Readonly<{
  target: string;
  from?: MotionState;
  to: MotionState;
  atMs: number;
  durationMs: number;
  delayMs?: number;
  ease: EaseName;
  repeat?: number;
  repeatDelayMs?: number;
  yoyo?: boolean;
  endMs: number;
}>;

export type CompiledMotion = Readonly<{
  schemaVersion: 1;
  id: string;
  initial: MotionInitial;
  tracks: readonly CompiledTrack[];
  labels: Readonly<Record<string, number>>;
  durationMs: number;
}>;
