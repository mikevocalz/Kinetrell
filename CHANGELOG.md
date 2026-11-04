# Changelog

## 0.1.0-alpha.2 — 2026-11-04

Dependency lane bump. No runtime API changes beyond the capability flags below.

- Library devDependencies now track npm `latest` from the 2026-11-04 audit:
  React Native 0.88.1, Reanimated 4.7.1, Worklets 0.13.1, Gesture Handler
  3.4.0, GSAP 3.15.1, @gsap/react 2.1.2, Lenis 1.3.27.
- Expo fixtures (`expo58`, `native-performance`, `parallax-anchors`) move to
  Expo 58.0.23 and the versions it bundles: React Native 0.88.1, Reanimated
  4.7.1, Worklets 0.13.0, Gesture Handler ~3.3.0. `parallax-anchors` also takes
  `@expo/html-elements` 58.0.3 and `react-native-web` ~0.21.4.
- Web fixtures (`web`, `next-ssr`, `react-lenis`) move to GSAP 3.15.1 and
  Lenis 1.3.27.
- CI runs one native lane. Expo 58 stable ships stable RN 0.88.1, which
  satisfies Reanimated's `0.86 - 0.88` peer range under strict npm, so the
  separate pnpm job for the RN 0.88.0-rc.3 prerelease is removed and
  `examples/expo58` installs with npm in the library job.
- `REANIMATED_BASELINE` is `4.7.1`, `EXPO_BASELINE` is `58.0.23`,
  `REACT_NATIVE_BASELINE` is `0.88.1`.
- `reanimated47Capabilities.reactNative088ReleaseCandidateTarget` is now
  `false` and deprecated; use the new `reactNative088StableTarget` (`true`).
- No peer range changed. The Worklets `<0.14` ceiling stays because
  Reanimated 4.7.1 still declares `react-native-worklets: "0.13.x"`.
- `docs/reanimated-4.7.md` cites the Reanimated 4.7.1 source file behind each
  claim. All claims still hold.
- `docs/native-performance-fixture.md` has the release-build device commands
  and an empty results table marked "not yet run".

## 0.1.0-alpha.1 — unreleased

- Added portable typed motion definitions and deterministic compilation.
- Added GSAP-style recorder with labels, overlap anchors and stagger.
- Added Reanimated 4.7 single-playhead native runtime.
- Added Worklets 0.13 scheduling and native scroll choreography.
- Added real GSAP, @gsap/react, ScrollTrigger and Lenis browser adapters.
- Added Expo SDK 58 / React Native 0.88 RC validation fixture.
- Added dependency auditing, package-boundary checks and release verification.
