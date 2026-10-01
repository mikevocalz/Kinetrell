# Compatibility baseline (2026-10-01)

Kinetrell's **product target** is Expo SDK 58 with the versions currently published by Expo:

- Expo SDK: **58.0.1** (`next`)
- React: **19.3.0**
- React Native: **0.88.0-rc.3**
- React Native Reanimated: **4.7.0**
- React Native Worklets: **0.13.0**
- React Native Gesture Handler: **3.2.1**

The browser integrations currently target:

- GSAP: **3.15.0**
- @gsap/react: **2.1.2**
- Lenis: **1.3.26**

## Why CI has two native lanes

Reanimated 4.7 officially documents React Native 0.86-0.88 support and pairs
with Worklets 0.13.x. Expo SDK 58 currently publishes React Native
0.88.0-rc.3.

However, Reanimated 4.7.0's npm peer metadata is `react-native: "0.86 - 0.88"`.
npm's strict resolver does not consider the prerelease
`0.88.0-rc.3` to satisfy that range, so a plain npm install fails with
`ERESOLVE` even though this is the combination Expo itself publishes.

Kinetrell therefore keeps:

1. a strict **npm library validation lane** on React Native 0.87.1 + Reanimated
   4.7.0, with no peer bypass flags; and
2. an **Expo SDK 58 target fixture** on RN 0.88.0-rc.3 using pnpm, which reports
   the upstream peer mismatch without blocking the preview combination.

We do not use `--force`, `--legacy-peer-deps`, or a patched Reanimated
package to hide the mismatch.

Kinetrell's own React Native peer range uses
`>=0.86.0-0 <0.89.0-0` so supported 0.88 prereleases are not rejected by
Kinetrell itself.
