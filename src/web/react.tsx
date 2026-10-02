import {
  createContext,
  createElement,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type JSX,
  type ReactNode,
  type Ref,
} from 'react';
import type gsap from 'gsap';
import type { CompiledMotion } from '../core/types.js';
import { createGsapTimeline } from './gsap.js';

export type WebReducedMotionPolicy = 'system' | 'always' | 'never';

type Registry = {
  registerNode: (target: string, node: HTMLElement | null) => void;
};

const MotionRegistryContext = createContext<Registry | null>(null);

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

export function useBrowserReducedMotion(
  policy: WebReducedMotionPolicy = 'system',
) {
  const [systemReduced, setSystemReduced] = useState(false);

  useEffect(() => {
    if (policy !== 'system' || typeof window === 'undefined') return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSystemReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [policy]);

  if (policy === 'always') return true;
  if (policy === 'never') return false;
  return systemReduced;
}

export type GsapMotionProviderProps = Readonly<{
  motion: CompiledMotion;
  autoplay?: boolean;
  reducedMotion?: WebReducedMotionPolicy;
  children: ReactNode;
  onTimeline?: (timeline: gsap.core.Timeline | null) => void;
}>;

export function GsapMotionProvider({
  motion,
  autoplay = true,
  reducedMotion = 'system',
  children,
  onTimeline,
}: GsapMotionProviderProps) {
  const targetsRef = useRef<Record<string, HTMLElement>>({});
  const [revision, setRevision] = useState(0);
  const shouldReduce = useBrowserReducedMotion(reducedMotion);

  const registerNode = useCallback((target: string, node: HTMLElement | null) => {
    const current = targetsRef.current[target];
    if (node) {
      if (current === node) return;
      targetsRef.current[target] = node;
    } else {
      if (!current) return;
      delete targetsRef.current[target];
    }
    setRevision((value) => value + 1);
  }, []);

  useLayoutEffect(() => {
    const requiredTargets = Object.keys(motion.initial);
    if (!requiredTargets.every((target) => targetsRef.current[target])) return;

    const timeline = createGsapTimeline(
      motion,
      targetsRef.current,
      { paused: true },
    );
    onTimeline?.(timeline);

    if (shouldReduce) {
      timeline.progress(1).pause();
    } else if (autoplay) {
      timeline.play();
    }

    return () => {
      onTimeline?.(null);
      timeline.kill();
    };
  }, [autoplay, motion, onTimeline, revision, shouldReduce]);

  const value = useMemo(() => ({ registerNode }), [registerNode]);

  return (
    <MotionRegistryContext.Provider value={value}>
      {children}
    </MotionRegistryContext.Provider>
  );
}

function useTargetRegistration<T extends HTMLElement>(
  target: string,
  forwardedRef?: Ref<T>,
) {
  const registry = useContext(MotionRegistryContext);
  if (!registry) {
    throw new Error(
      'Kinetrell Motion DOM elements must be rendered inside GsapMotionProvider',
    );
  }

  return useCallback(
    (node: T | null) => {
      registry.registerNode(target, node);
      assignRef(forwardedRef, node);
    },
    [forwardedRef, registry, target],
  );
}

type IntrinsicTag = keyof JSX.IntrinsicElements;

type MotionProps<T extends IntrinsicTag> =
  ComponentPropsWithoutRef<T> & { target: string };

function createMotionElement<T extends IntrinsicTag>(tag: T) {
  return forwardRef<HTMLElement, MotionProps<T>>(function MotionElement(
    { target, ...props },
    ref,
  ) {
    const registeredRef = useTargetRegistration<HTMLElement>(target, ref);
    return createElement(tag, {
      ...props,
      ref: registeredRef,
    } as ComponentPropsWithoutRef<T> & { ref: Ref<HTMLElement> });
  });
}

export const Motion = Object.freeze({
  div: createMotionElement('div'),
  span: createMotionElement('span'),
  main: createMotionElement('main'),
  nav: createMotionElement('nav'),
  header: createMotionElement('header'),
  section: createMotionElement('section'),
  article: createMotionElement('article'),
  h1: createMotionElement('h1'),
  h2: createMotionElement('h2'),
  p: createMotionElement('p'),
  img: createMotionElement('img'),
});
