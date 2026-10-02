# Keyframes and portable color interpolation

Kinetrell can author multi-stop motion without inventing a second timeline format.

`keyframesToTracks()` accepts normalized offsets from 0 to 1 and expands them
into ordinary deterministic tracks. The resulting tracks work through every
existing renderer.

```ts
const tracks = keyframesToTracks('card', [
  { offset: 0, value: { opacity: 0, y: 24 } },
  { offset: 0.4, value: { opacity: 1, y: -6 }, ease: 'quad.out' },
  { offset: 1, value: { opacity: 1, y: 0 } },
], { durationMs: 800 });
```

The portable evaluator also interpolates hexadecimal RGB/RGBA colors. Unsupported
string formats remain discrete rather than being guessed. Native Reanimated and
browser GSAP may support broader color syntaxes as renderer-specific capabilities.
