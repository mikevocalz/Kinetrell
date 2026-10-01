# Kinetrell

**One motion language. Native execution.**

Kinetrell is a typed motion layer for sharing timeline intent across React
Native and the web without pretending the runtimes are identical.

- React Native: **Reanimated 4.7 + Worklets 0.13**
- Expo target: **SDK 58 + React Native 0.88.0-rc.3**
- Browser: real **GSAP 3.15 + ScrollTrigger + Lenis 1.3**
- No Bento. No Tamagui. No UI kit.

## Install

Native:

```bash
npm install kinetrell react-native-reanimated react-native-worklets
```

Web adapters:

```bash
npm install kinetrell gsap @gsap/react lenis
```

The browser packages are isolated optional peers. Native consumers do not need
to install them.

## Portable motion

```ts
import { compileMotion, defineMotion } from 'kinetrell/core';

const reveal = defineMotion({
  id: 'reveal',
  initial: {
    card: { opacity: 0, y: 24, scale: 0.98 },
  },
  tracks: [
    {
      target: 'card',
      to: { opacity: 1, y: 0, scale: 1 },
      durationMs: 420,
      ease: 'cubic.out',
    },
  ],
});

const compiled = compileMotion(reveal);
```

## React Native

```tsx
import { Motion, useMotion } from 'kinetrell/native';

export function Card() {
  const motion = useMotion(reveal, {
    autoplay: true,
    reducedMotion: 'system',
  });

  return (
    <Motion.View motion={motion} target="card">
      {/* your content */}
    </Motion.View>
  );
}
```

Kinetrell uses one Reanimated shared-value playhead per motion instance. Scroll
scrubbing, parallax and programmatic scrolling stay on the UI Runtime and keep
native scroll physics intact.

## GSAP-style authoring

```ts
import { recordGsap } from 'kinetrell/compat/gsap';

const reveal = recordGsap(
  { card: { opacity: 0, y: 24 } },
  (tl) => {
    tl.fromTo(
      'card',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out' },
    );
  },
);
```

The recorder supports a documented subset: labels, sibling anchors, relative
positions, repeats/yoyo and simple stagger. Unsupported GSAP/browser behavior
is rejected instead of silently discarded.

## Real GSAP + Lenis on web

```ts
import { createGsapTimeline } from 'kinetrell/web/gsap';
import { createKinetrellLenis } from 'kinetrell/web/lenis';
import { connectGsapLenis } from 'kinetrell/web/gsap-lenis';
```

The web adapters execute the actual packages. The combined bridge converts
GSAP ticker seconds to Lenis milliseconds and has explicit clock ownership so
two RAF loops never drive the same Lenis instance.

Browser apps using Lenis should import:

```ts
import 'lenis/dist/lenis.css';
```

## Expo SDK 58

`examples/expo58` pins Expo 58.0.1, React 19.3.0, RN 0.88.0-rc.3,
Reanimated 4.7.0 and Worklets 0.13.0.

npm currently rejects that prerelease combination because Reanimated 4.7's
published peer range does not include prerelease semver even though Reanimated
documents RN 0.88 support. CI therefore validates the library with strict npm
on RN 0.87.1 and validates the exact Expo 58 preview lane separately with pnpm.
No `--force` or `--legacy-peer-deps` is used.

## Reanimated 4.7

Kinetrell accounts for the new default layout-animation engine, RN 0.88
support, Synchronizable-backed mutables, the changed animated-ref model,
UI-thread `backgroundImage` gradients, `contrastColor()`, and Worklets 0.13
scheduling. Experimental shared-element and Android CSS platform-transition
flags are never enabled automatically.

See the files under `docs/` for capabilities and limitations.
