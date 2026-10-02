# Kinetrell

**One motion language. Native execution.**

Kinetrell maps a deterministic motion/timeline model to React Native Reanimated and to real GSAP/Lenis integrations on the web.

## Scope

- GSAP-style authoring subset: `to`, `from`, `fromTo`, `set`, labels, sequencing, overlap, repeat/yoyo.
- Native runtime building blocks for Reanimated 4.7+ and Worklets 0.13+, with an Expo SDK 58 / RN 0.88.0-rc.3 reference lane.
- Native scroll state for Lenis-like choreography while preserving native scrolling.
- Real GSAP and Lenis browser adapters.
- No Bento. No Tamagui. No UI kit.

## Install

```bash
npm install kinetrell react-native-reanimated react-native-worklets
```

For web GSAP/Lenis adapters:

```bash
npm install gsap @gsap/react lenis
```

## Core

```ts
import { compileMotion, defineMotion, evaluateMotion } from 'kinetrell';

const motion = defineMotion({
  id: 'reveal',
  initial: { card: { opacity: 0, y: 24 } },
  tracks: [
    { target: 'card', to: { opacity: 1, y: 0 }, durationMs: 420, ease: 'cubic.out' },
  ],
});

const compiled = compileMotion(motion);
const stateAt210ms = evaluateMotion(compiled, 210);
```

## GSAP-style recorder

```ts
import { recordGsap } from 'kinetrell/compat/gsap';

const motion = recordGsap({ panel: { opacity: 0, y: 24 } }, (tl) => {
  tl.fromTo('panel', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out' });
});
```

## Web

`kinetrell/web/gsap` executes compiled motion using the real `gsap` package. `kinetrell/web/lenis` creates an owned Lenis instance. `kinetrell/web/gsap-lenis` synchronizes an existing Lenis instance to GSAP's ticker with the required seconds → milliseconds conversion.

## Reanimated 4.7 awareness

Kinetrell targets Reanimated 4.7 / Worklets 0.13 and its primary fixture is Expo SDK 58 + React Native 0.88.0-rc.3. It explicitly uses the new `backgroundImage` gradient path and accounts for the default light-tree layout engine, `contrastColor`, experimental shared-element/platform-transition capabilities, RN 0.88 changes, and recent Worklets runtime improvements. Experimental shared-element and Android platform CSS-transition flags are **not** enabled automatically.

See `docs/reanimated-4.7.md`.


## Expo SDK 58 reference lane

`examples/expo58` pins the current SDK 58 lane: Expo 58.0.1, React 19.3.0, React Native 0.88.0-rc.3, Reanimated 4.7.0, Worklets 0.13.0, and Gesture Handler 3.2.1. It includes a Reanimated 4.7 animated-gradient example.


## Cross-platform semantic parallax

`examples/parallax-anchors` demonstrates Kinetrell parallax with the same Reanimated scroll source on iOS, Android, and web, while `@expo/html-elements` supplies semantic layout primitives and `@nandorojo/anchor` supplies named anchor navigation.

See `docs/semantic-parallax-anchors.md`.
