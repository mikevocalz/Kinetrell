# Kinetrell handoff

The alpha implementation now covers the compiler, GSAP-style authoring,
Reanimated native runtime, scroll choreography, actual GSAP/Lenis web adapters,
Expo SDK 58 fixtures, package boundaries, semantic parallax, React DOM
bindings, gesture interruption, native performance instrumentation, clean packed
consumer verification, browser E2E coverage, Next.js SSR/hydration, and
caller-owned ReactLenis interoperability.

## Remaining release work

Only hardware/final-release gates remain:

- execute the native performance fixture on physical iOS hardware in release mode;
- execute the native performance fixture on physical Android hardware in release mode;
- re-run the live npm dependency audit immediately before tagging;
- revisit the Expo SDK 58 RN 0.88 prerelease peer workaround when the matching
  stable Expo/RN/Reanimated lane is published.

GSAP 3.15.0's current Standard "No Charge" License has been reviewed and the
repository enforces the no-Bento/no-Tamagui constraint across direct and locked
transitive dependencies.

No production deployment or npm publication is implied by this repository.
