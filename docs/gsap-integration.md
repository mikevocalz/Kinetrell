# Real GSAP browser integration

`kinetrell/web/gsap` imports the real `gsap` package and the official
`@gsap/react` hook. It is a browser/React DOM entry point and is never
re-exported from Kinetrell's native or core entries.

## Timeline execution

`createGsapTimeline(compiled, targets)` translates the supported portable
definition into a real paused GSAP timeline. Explicit Kinetrell `from` values
become GSAP `fromTo` calls; other tracks become `to` calls.

Kinetrell's easing mapping is explicit:

- quad → GSAP power1
- cubic / Kinetrell power2 → GSAP power2
- linear → none

This corrects the common off-by-one misunderstanding in GSAP's power naming.

## React

`useGsapMotion()` uses the official `useGSAP()` hook and kills only the
timeline it creates during cleanup. It does not change global GSAP settings.

## ScrollTrigger

`attachScrollTrigger()` registers the real ScrollTrigger plugin lazily in a
browser runtime. Arbitrary ScrollTrigger behavior is not advertised as native
parity.
