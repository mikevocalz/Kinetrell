# Compatibility baseline (2026-11-04)

Versions below come from `node scripts/audit-current-npm.mjs` run on
2026-11-04 against registry.npmjs.org, and from `bundledNativeModules.json`
inside the published `expo@58.0.23` tarball.

## Native lane

Expo SDK 58 is stable (`expo@latest` is 58.0.23) and ships stable React
Native 0.88.1.

| Package | Library devDependency | Expo SDK 58 fixtures |
| --- | --- | --- |
| expo | n/a | 58.0.23 |
| react | 19.3.0 | 19.3.0 |
| react-native | 0.88.1 | 0.88.1 |
| react-native-reanimated | 4.7.1 | 4.7.1 |
| react-native-worklets | 0.13.1 | 0.13.0 |
| react-native-gesture-handler | 3.4.0 | ~3.3.0 |

The library pins npm `latest`. The Expo fixtures pin what Expo 58.0.23
bundles, which is what `npx expo install --fix` writes, so an Expo app built
from them does not trip `expo-doctor` version warnings. Both columns satisfy
Kinetrell's peer ranges.

## Browser lane

- GSAP: **3.15.1**
- @gsap/react: **2.1.2**
- Lenis: **1.3.27**

## One native CI lane

Reanimated 4.7.1 declares `react-native: "0.86 - 0.88"` and
`react-native-worklets: "0.13.x"`. React Native 0.88.1 is a stable release, so
npm's strict resolver accepts it. CI installs the library and the
`examples/expo58` fixture with plain `npm install` in the same job, with no
peer bypass flags.

We do not use `--force`, `--legacy-peer-deps`, or a patched Reanimated
package anywhere.

## Peer ranges

No peer range changed in 0.1.0-alpha.2. Every audited `latest` already falls
inside the published range:

- `react-native`: `>=0.86.0-0 <0.89.0-0` (0.88.1 is inside)
- `react-native-reanimated`: `>=4.7.0 <5` (4.7.1)
- `react-native-worklets`: `>=0.13.0 <0.14` (0.13.1). The `<0.14` ceiling
  stays because Reanimated 4.7.1's own peer metadata still says `0.13.x`.
- `react-native-gesture-handler`: `>=3.2.1 <4` (3.4.0)
- `gsap`: `>=3.15.0 <4` (3.15.1)
- `@gsap/react`: `>=2.1.2 <3` (2.1.2)
- `lenis`: `>=1.3.26 <2` (1.3.27)

The `<0.89.0-0` ceiling also rejects React Native 0.89 release candidates
(`react-native@next` is 0.89.0-rc.0 today), which Reanimated 4.7 does not
declare support for.
