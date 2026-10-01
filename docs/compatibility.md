# Compatibility baseline (2026-10-01)

Primary development lane:

- Expo SDK: **58.0.1 (`next`)**
- React: **19.3.0**
- React Native: **0.88.0-rc.3**
- React Native Reanimated: **4.7.0**
- React Native Worklets: **0.13.0**
- React Native Gesture Handler: **3.2.1**
- GSAP: **3.15.0**
- @gsap/react: **2.1.2**
- Lenis: **1.3.26**
- TypeScript: **7.0.2**
- Vitest: **5.0.3**
- tsdown: **0.23.0**

Expo SDK 58 targets React Native 0.88 and React 19.3.0. The current Expo 58 bundled native module set includes React Native 0.88.0-rc.3, Reanimated 4.7.0, Worklets 0.13.0, and Gesture Handler 3.2.1.

Kinetrell keeps a broader published React Native peer range (`>=0.86 <0.89`) because Reanimated 4.7 officially supports RN 0.86-0.88, while the maintained example and development lane intentionally exercise the newest Expo 58 / RN 0.88 RC combination.

Reanimated 4.x requires the New Architecture. The Expo 58 fixture keeps `newArchEnabled` on.
