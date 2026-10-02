# GSAP + Lenis bridge

`connectGsapLenis()` coordinates the real GSAP ticker, ScrollTrigger and a
real Lenis instance.

## Kinetrell-owned clock

Use `clock: 'kinetrell'` only when the Lenis instance has `autoRaf: false`
and no other ticker owner. Kinetrell installs one GSAP ticker callback and calls:

```ts
lenis.raf(timeSeconds * 1000);
```

The seconds-to-milliseconds conversion is deliberate.

A WeakMap guard prevents two Kinetrell bridges from driving the same Lenis
instance simultaneously.

## External clock

Use `clock: 'external'` when ReactLenis, another RAF loop, or the host
application already drives Lenis. Kinetrell subscribes to scroll events for
ScrollTrigger updates but does not add another clock.

## Cleanup

Disconnect is idempotent. It removes only Kinetrell's event/ticker callbacks.
It does not destroy caller-owned Lenis instances, kill unrelated GSAP
animations, or change global `gsap.ticker.lagSmoothing()` policy.
