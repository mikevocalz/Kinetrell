# Keyframes

Kinetrell keyframes are normalized, portable timeline input. A keyframe track
uses the same target and total `durationMs` as a tween track, but supplies
ordered frames instead of one `to` state.

```ts
const scene = defineMotion({
  id: 'pulse',
  initial: { card: { scale: 1, opacity: 0 } },
  tracks: [
    {
      target: 'card',
      durationMs: 900,
      keyframes: [
        { offset: 0.35, values: { scale: 1.08, opacity: 1 }, ease: 'cubic.out' },
        { offset: 1, values: { scale: 1 }, ease: 'cubic.inOut' },
      ],
    },
  ],
});
```

Offsets are normalized from 0 to 1, must be strictly increasing, and the final
frame must have `offset: 1`. The compiler expands them into the same immutable
compiled track IR used by native Reanimated and browser GSAP adapters, so the
renderers do not maintain separate keyframe semantics.

Per-frame `ease` controls the segment ending at that frame.

For the current alpha, keyframe tracks deliberately reject `repeat`,
`repeatDelayMs`, and `yoyo`. Plain tween tracks support those features. This
is an explicit capability boundary rather than silently producing different
loop semantics on different renderers.
