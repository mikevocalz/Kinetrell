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
- re-run the live npm dependency audit immediately before tagging.

The Expo SDK 58 RN 0.88 prerelease peer workaround is gone as of
0.1.0-alpha.2: Expo 58.0.23 ships stable RN 0.88.1, and CI installs the library
and the Expo fixture in one strict-npm lane. `docs/native-performance-fixture.md`
has the device commands and an empty results table.

GSAP 3.15.1's current Standard "No Charge" License has been reviewed and the
repository enforces the no-Bento/no-Tamagui constraint across direct and locked
transitive dependencies.

No production deployment or npm publication is implied by this repository.
