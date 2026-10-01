# GSAP migration subset

Kinetrell intentionally implements a documented subset instead of pretending arbitrary GSAP code can execute on the native UI runtime.

## Recorded today

- `to`, `from`, `fromTo`, `set`
- numeric positions in GSAP seconds
- labels and label-relative positions
- `<` / `>` sibling anchors with `+=` and `-=` offsets
- target arrays with simple `stagger: number` or `stagger: { each }`
- repeat, repeatDelay and yoyo
- linear, power1/quad and power2 easing families

The recorder converts seconds to Kinetrell milliseconds exactly once.

## Deliberately rejected

CSS selectors, DOM measurements, function-valued properties, arbitrary plugins,
callbacks that cannot be represented portably, and unregistered targets.

When overlapping portable tracks write the same property, the later track in the
definition owns that property for the overlapping interval. This is deterministic
and documented, but it is not a claim of full GSAP overwrite parity.
