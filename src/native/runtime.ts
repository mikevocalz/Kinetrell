import {
  cancelAnimation,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { AppState } from 'react-native';
import { scheduleOnRN } from 'react-native-worklets';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { compileMotion } from '../core/compile.js';
import type {
  CompiledMotion,
  MotionDefinition,
} from '../core/types.js';
import { createNativeTargetPlan } from './plan.js';
import { reducedMotionDestination, type ReducedMotionBehavior } from './lifecycle.js';
import {
  evaluateNativePlan,
  valuesToAnimatedStyle,
} from './worklet.js';

export type ReducedMotionPolicy = 'system' | 'always' | 'never';

export type NativeMotionOptions = Readonly<{
  autoplay?: boolean;
  playbackRate?: number;
  reducedMotion?: ReducedMotionPolicy;
  reducedMotionBehavior?: ReducedMotionBehavior;
  pauseOnBackground?: boolean;
  onComplete?: () => void;
}>;

export type NativeMotionHandle = Readonly<{
  compiled: CompiledMotion;
  playheadMs: SharedValue<number>;
  progress: SharedValue<number>;
  play: () => void;
  pause: () => void;
  resume: () => void;
  reverse: () => void;
  restart: () => void;
  seek: (timeMs: number) => void;
  setProgress: (progress: number) => void;
  setPlaybackRate: (rate: number) => void;
  cancel: () => void;
}>;

export function useMotion(
  definition: MotionDefinition,
  options: NativeMotionOptions = {},
): NativeMotionHandle {
  const compiled = useMemo(() => compileMotion(definition), [definition]);
  const playheadMs = useSharedValue(0);
  const systemReducedMotion = useReducedMotion();
  const playbackRateRef = useRef(options.playbackRate ?? 1);
  const directionRef = useRef<1 | -1>(1);
  const playingRef = useRef(false);
  const onCompleteRef = useRef(options.onComplete);
  const resumeAfterBackgroundRef = useRef(false);

  onCompleteRef.current = options.onComplete;

  const shouldReduceMotion =
    options.reducedMotion === 'always' ||
    (options.reducedMotion !== 'never' && systemReducedMotion);

  const progress = useDerivedValue(() => {
    if (compiled.durationMs === 0) return 1;
    return Math.min(1, Math.max(0, playheadMs.value / compiled.durationMs));
  });

  const notifyComplete = useCallback(() => {
    playingRef.current = false;
    onCompleteRef.current?.();
  }, []);

  const animateTo = useCallback(
    (destination: number, direction: 1 | -1) => {
      cancelAnimation(playheadMs);
      directionRef.current = direction;

      if (shouldReduceMotion || compiled.durationMs === 0) {
        playheadMs.value = destination;
        playingRef.current = false;
        onCompleteRef.current?.();
        return;
      }

      const current = playheadMs.value;
      const distance = Math.abs(destination - current);
      const rate = playbackRateRef.current;

      if (distance === 0) {
        playingRef.current = false;
        onCompleteRef.current?.();
        return;
      }

      playingRef.current = true;
      playheadMs.value = withTiming(
        destination,
        {
          duration: distance / rate,
        },
        (finished) => {
          if (finished) scheduleOnRN(notifyComplete);
        },
      );
    },
    [compiled.durationMs, notifyComplete, playheadMs, shouldReduceMotion],
  );

  const play = useCallback(() => {
    if (playheadMs.value >= compiled.durationMs) playheadMs.value = 0;
    animateTo(compiled.durationMs, 1);
  }, [animateTo, compiled.durationMs, playheadMs]);

  const pause = useCallback(() => {
    cancelAnimation(playheadMs);
    playingRef.current = false;
  }, [playheadMs]);

  const resume = useCallback(() => {
    const destination = directionRef.current === 1 ? compiled.durationMs : 0;
    animateTo(destination, directionRef.current);
  }, [animateTo, compiled.durationMs]);

  const reverse = useCallback(() => {
    if (playheadMs.value <= 0) playheadMs.value = compiled.durationMs;
    animateTo(0, -1);
  }, [animateTo, compiled.durationMs, playheadMs]);

  const restart = useCallback(() => {
    cancelAnimation(playheadMs);
    playheadMs.value = 0;
    animateTo(compiled.durationMs, 1);
  }, [animateTo, compiled.durationMs, playheadMs]);

  const seek = useCallback(
    (timeMs: number) => {
      if (!Number.isFinite(timeMs)) throw new RangeError('timeMs must be finite');
      cancelAnimation(playheadMs);
      playingRef.current = false;
      playheadMs.value = Math.min(Math.max(0, timeMs), compiled.durationMs);
    },
    [compiled.durationMs, playheadMs],
  );

  const setProgress = useCallback(
    (nextProgress: number) => {
      if (!Number.isFinite(nextProgress)) {
        throw new RangeError('progress must be finite');
      }
      seek(Math.min(1, Math.max(0, nextProgress)) * compiled.durationMs);
    },
    [compiled.durationMs, seek],
  );

  const setPlaybackRate = useCallback(
    (rate: number) => {
      if (!Number.isFinite(rate) || rate <= 0) {
        throw new RangeError('playbackRate must be > 0');
      }

      playbackRateRef.current = rate;

      if (playingRef.current) {
        const destination = directionRef.current === 1 ? compiled.durationMs : 0;
        animateTo(destination, directionRef.current);
      }
    },
    [animateTo, compiled.durationMs],
  );

  const cancel = useCallback(() => {
    cancelAnimation(playheadMs);
    playingRef.current = false;
  }, [playheadMs]);

  useEffect(() => {
    if (!shouldReduceMotion) return;

    const wasPlaying = playingRef.current;
    cancelAnimation(playheadMs);
    playingRef.current = false;

    const destination = reducedMotionDestination(
      playheadMs.value,
      compiled.durationMs,
      directionRef.current,
      options.reducedMotionBehavior ?? 'finish',
    );
    playheadMs.value = destination;

    if (
      wasPlaying &&
      (options.reducedMotionBehavior ?? 'finish') === 'finish'
    ) {
      onCompleteRef.current?.();
    }
  }, [
    compiled.durationMs,
    options.reducedMotionBehavior,
    playheadMs,
    shouldReduceMotion,
  ]);

  useEffect(() => {
    if (options.pauseOnBackground === false) return;

    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        resumeAfterBackgroundRef.current = playingRef.current;
        if (playingRef.current) {
          cancelAnimation(playheadMs);
          playingRef.current = false;
        }
        return;
      }

      if (resumeAfterBackgroundRef.current) {
        resumeAfterBackgroundRef.current = false;
        resume();
      }
    });

    return () => subscription.remove();
  }, [options.pauseOnBackground, playheadMs, resume]);

  useEffect(() => {
    if (options.autoplay) play();
    return () => {
      resumeAfterBackgroundRef.current = false;
      playingRef.current = false;
      cancelAnimation(playheadMs);
    };
  }, [options.autoplay, play, playheadMs]);

  return useMemo(
    () => ({
      compiled,
      playheadMs,
      progress,
      play,
      pause,
      resume,
      reverse,
      restart,
      seek,
      setProgress,
      setPlaybackRate,
      cancel,
    }),
    [
      cancel,
      compiled,
      pause,
      play,
      playheadMs,
      progress,
      restart,
      resume,
      reverse,
      seek,
      setPlaybackRate,
      setProgress,
    ],
  );
}

export function useMotionStyle(
  motion: NativeMotionHandle,
  target: string,
) {
  const plan = useMemo(
    () => createNativeTargetPlan(motion.compiled, target),
    [motion.compiled, target],
  );

  return useAnimatedStyle(() => {
    const values = evaluateNativePlan(plan, motion.playheadMs.value);
    return valuesToAnimatedStyle(values);
  }, [plan, motion.playheadMs]);
}
