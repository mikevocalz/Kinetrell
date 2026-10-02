# Kinetrell handoff

The alpha implementation now covers the core compiler, GSAP-style recorder,
Reanimated native runtime, native scroll choreography, actual GSAP/Lenis web
adapters, Expo SDK 58 fixture, CI and package boundaries.

Before declaring a stable 1.0 release:

- run physical iOS and Android interaction/performance fixtures;
- add browser interaction tests in a real Chromium/WebKit environment;
- install the packed tarball into clean external native and browser consumers;
- verify SSR/hydration in a real React framework;
- review GSAP licensing for the intended distribution/use;
- replace the Expo 58 RC-specific workaround once RN 0.88 stable and matching
  peer metadata are published.

No production deployment or npm publication is implied by this repository.
