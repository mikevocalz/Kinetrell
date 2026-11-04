# Verification

CI has one native lane. The library and the Expo SDK 58 fixture install in the same job with strict npm peers.

## Library lane

Uses current npm and a strict, published-stable React Native validation set.
It runs:

- live npm metadata audit
- TypeScript
- Vitest
- tsdown build
- browser/native import-boundary checks
- package export checks
- npm pack dry run

## Expo SDK 58 fixture (same job)

After `npm run verify`, the library job runs `npm install --ignore-scripts` and
`npm run typecheck` in `examples/expo58`. That fixture pins Expo 58.0.23 +
React 19.3.0 + RN 0.88.1 + Reanimated 4.7.1 + Worklets 0.13.0 + Gesture
Handler ~3.3.0, the versions Expo 58.0.23 bundles.

Before 0.1.0-alpha.2 this was a separate pnpm job, because npm rejected the
RN 0.88.0-rc.3 prerelease against Reanimated's `0.86 - 0.88` peer range.
RN 0.88.1 is stable, so that workaround is gone.

## Not yet equivalent to physical-device validation

CI does not prove native 60/120 Hz performance, gesture feel, platform scroll
physics, App Store behavior or device-specific layout-animation correctness.
Those remain explicit release gates for a stable version.


## Packed consumer matrix

`npm run verify:consumers` packs the actual publishable tarball and installs it
into fresh temporary projects. It verifies:

- core-only import with optional peers omitted;
- Lenis-only browser import without GSAP;
- GSAP-only browser import without Lenis;
- combined GSAP + Lenis browser imports;
- a clean native TypeScript consumer using React Native/Reanimated/Worklets.

This is intentionally stronger than workspace imports because every consumer
resolves Kinetrell through the packed artifact.
