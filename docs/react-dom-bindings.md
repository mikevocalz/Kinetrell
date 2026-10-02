# React DOM motion bindings

The browser-only `kinetrell/web/react` entry provides semantic React DOM
bindings backed by a **single GSAP timeline**.

```tsx
import { GsapMotionProvider, Motion } from 'kinetrell/web/react';

<GsapMotionProvider motion={compiled} autoplay>
  <Motion.main target="panel">
    <Motion.h1 target="title">One motion language.</Motion.h1>
  </Motion.main>
</GsapMotionProvider>
```

The provider registers target refs first, then creates one real GSAP timeline
when every target declared by the compiled scene is present. Strict Mode
cleanup kills only the timeline owned by that provider.

## Reduced motion

The provider defaults to `reducedMotion="system"`. When the browser reports
`prefers-reduced-motion: reduce`, Kinetrell skips decorative playback and
places the scene at its stable final state.

Use `always` or `never` only when an application has an explicit policy.

These are React DOM components, not React Native components. Native consumers
continue to use `Motion.View`, `Motion.Text`, and `Motion.Image` from
`kinetrell/native`.
