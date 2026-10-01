# Verification

CI has two lanes.

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

## Expo SDK 58 lane

Pins Expo 58.0.1 + React 19.3.0 + RN 0.88.0-rc.3 + Reanimated 4.7.0 +
Worklets 0.13.0 and typechecks the fixture.

pnpm is used only for this preview fixture because npm currently rejects the
RN prerelease against Reanimated's published peer range. The mismatch is
documented instead of bypassed with force flags.

## Not yet equivalent to physical-device validation

CI does not prove native 60/120 Hz performance, gesture feel, platform scroll
physics, App Store behavior or device-specific layout-animation correctness.
Those remain explicit release gates for a stable version.
