# Native runtime

Kinetrell's native runtime uses one authoritative Reanimated shared-value
playhead for each motion instance. Individual target styles are derived from
that playhead on the UI Runtime.

## Usage

```tsx
import { Motion, useMotion } from 'kinetrell/native';
import { defineMotion } from 'kinetrell/core';

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

export function Card() {
  const motion = useMotion(reveal, {
    autoplay: true,
    reducedMotion: 'system',
  });

  return <Motion.View motion={motion} target="card" />;
}
```

## Runtime model

- `play`, `reverse`, `resume`, `restart`, `seek`, and
  `setProgress` all operate on the same UI-thread playhead.
- Playback-rate changes reschedule the remaining linear playhead duration
  without causing a visual jump.
- Reduced-motion policy can follow the system or be explicitly forced.
- Completion callbacks use Worklets 0.13 `scheduleOnRN`, not deprecated
  `runOnJS`.
- Target plans resolve implicit starting values once on the RN Runtime so the
  UI callback only evaluates compact property tracks.

## Property support

The first native runtime supports opacity/layout numeric properties, x/y
translation, scale/scaleX/scaleY, rotation, and Reanimated-supported colors.
Unsupported complex strings are deterministic step values until a dedicated
interpolator exists.

Reanimated 4.7 `backgroundImage` gradients remain available through
`gradientToBackgroundImage()`; native timeline interpolation of arbitrary
gradient strings is intentionally not faked.
