# Stable release gates

Kinetrell stays pre-1.0 until every gate below has evidence.

## Completed in repository/CI

- deterministic compiler and timeline tests;
- native Reanimated 4.7 runtime;
- GSAP + ScrollTrigger + Lenis browser execution;
- Expo SDK 58 / RN 0.88 RC fixture;
- package-boundary and npm-pack checks;
- packed tarball consumer matrix on clean core/native/GSAP/Lenis consumers;
- real Chromium + WebKit interaction coverage;
- real Next.js App Router SSR + hydration verification;
- native performance/virtualization fixture;
- semantic parallax + anchor integration;
- browser DOM bindings and native gesture adapter;
- current GSAP 3.15.0 Standard "No Charge" License review;
- direct + transitive Bento/Tamagui exclusion enforcement.

## Remaining before stable 1.0

1. Physical iOS release-build run of the native performance fixture.
2. Physical Android release-build run of the native performance fixture.
3. Re-run the live npm audit immediately before tagging the release candidate.
4. Replace or re-evaluate the Expo 58 RN 0.88 prerelease compatibility workaround
   once Expo/RN/Reanimated publish a stable matching lane.
5. Record unavailable physical-hardware/platform claims as unverified, never passed.

## Physical-device evidence format

For each iOS/Android run capture:

- device model and OS;
- display refresh rate;
- release/debug build mode;
- Expo, React Native, Reanimated and Worklets versions;
- 20 / 100 / 300 target scene results;
- long virtualized scroll fixture;
- p50/p95/p99 frame interval;
- missed-frame/deadline count;
- memory before/after disposal;
- first-interaction latency;
- reduced-motion behavior;
- background/foreground resume behavior;
- RTL + horizontal nested-scroll behavior.

No simulator, unit test, host CPU benchmark, or browser CI is labeled as
physical-device FPS evidence.
