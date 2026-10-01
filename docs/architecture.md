# Architecture

Kinetrell is a compiler + adapters, not three animation engines fighting over the same view.

```text
portable motion definition
        ↓
validation / compile
        ↓
compiled timeline IR
   ┌────┴─────────────┐
   │                  │
React Native          Web
Reanimated 4.7+       GSAP 3.15+
Native scroll         Lenis 1.3+
```

The root and `kinetrell/core` entry points have no browser or native imports. Native, GSAP, and Lenis are isolated entry points.
