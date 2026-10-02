# Kinetrell handoff

The alpha implementation covers the compiler, GSAP-style authoring, Reanimated
native runtime, scroll choreography, actual GSAP/Lenis web adapters, Expo SDK 58
fixtures, package boundaries, semantic parallax, React DOM bindings, gesture
interruption, and native performance instrumentation.

## Remaining release work

- merge and keep green the packed-consumer, browser interaction, and Next.js SSR
  verification lanes;
- execute the native performance fixture on physical iOS and Android hardware in
  release mode and record the measurements defined in
  `docs/stable-release-gates.md`;
- re-check the GSAP Standard License for the exact release candidate dependency;
- re-run the live npm dependency audit before tagging;
- revisit the Expo SDK 58 RN 0.88 prerelease peer workaround once the stable
  release lane is published.

No production deployment or npm publication is implied by this repository.
