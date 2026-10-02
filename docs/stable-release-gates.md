# Stable release gates

Kinetrell stays pre-1.0 until every gate below has evidence.

## Completed in repository/CI

- deterministic compiler and timeline tests;
- native Reanimated 4.7 runtime;
- GSAP + ScrollTrigger + Lenis browser execution;
- Expo SDK 58 / RN 0.88 RC fixture;
- package-boundary and npm-pack checks;
- native performance/virtualization fixture;
- semantic parallax + anchor integration;
- browser DOM bindings and native gesture adapter.

## Must be green before stable 1.0

1. Packed tarball consumer matrix on clean native/browser consumers.
2. Real Chromium + WebKit browser interaction suite.
3. Real Next.js SSR + hydration verification.
4. Physical iOS release-build run of the native performance fixture.
5. Physical Android release-build run of the native performance fixture.
6. Review the GSAP license version in force for the exact GSAP release selected
   for Kinetrell's release candidate.
7. Re-run the live npm audit immediately before tagging.
8. Replace or re-evaluate the Expo 58 RN 0.88 prerelease compatibility workaround
   once Expo/RN/Reanimated publish a stable matching lane.
9. Verify no excluded dependencies (Bento, Tamagui) are present directly or
   transitively.
10. Record unverified hardware/platform claims as unverified rather than passed.

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

No simulator, unit test, or host CPU benchmark is labeled as physical-device FPS
evidence.
