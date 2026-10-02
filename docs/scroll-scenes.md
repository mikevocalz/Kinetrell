# Scroll scenes

`useScrollScene()` is a thin orchestration layer over Kinetrell's existing
authoritative native scroll source.

It provides three UI-runtime values:

- `progress`: section progress from 0 → 1
- `active`: whether progress is inside the requested enter/leave window
- `revealed`: sticky evidence that the scene has entered at least once

```tsx
const scroll = useKinetrellScroll();

const scene = useScrollScene(
  scroll,
  { start: sectionTop, length: sectionHeight },
  {
    enterAt: 0.15,
    leaveAt: 0.85,
    onEnter: () => analytics.mark('hero-enter'),
    onLeave: () => analytics.mark('hero-leave'),
  },
);

useScrollScrub(motion, scene.progress);
```

Progress stays on the Reanimated UI runtime. `onEnter` / `onLeave` are
discrete callbacks scheduled to React Native and are not a frame-by-frame
bridge.

Use `once: true` for one-shot reveals. In that mode `revealed` remains true
and the enter callback is emitted only once.
