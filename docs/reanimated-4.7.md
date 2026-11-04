# Reanimated 4.7 / Worklets 0.13 / Expo SDK 58

Kinetrell's primary native target is **Expo SDK 58 (58.0.23) + React Native 0.88.1 + React Native Reanimated 4.7.x + React Native Worklets 0.13.x**.

The claims in the next section were re-checked on 2026-11-04 against the published `react-native-reanimated@4.7.1` npm tarball. File paths are relative to that package root.

## Features Kinetrell deliberately uses or exposes

- **New light-tree layout animation engine** is Reanimated 4.7's default. Kinetrell interoperates with it rather than replacing it. Source: `src/featureFlags/staticFlags.json` sets `USE_LEGACY_LAYOUT_ANIMATIONS_PROXY` to `false`, and `Common/cpp/reanimated/NativeModules/ReanimatedModuleProxy.cpp` creates the default (light-tree) proxy registry unless that flag is on.
- **Animated `backgroundImage` gradients** are supported by Reanimated 4.7 and React Native 0.87+. `gradientToBackgroundImage()` serializes Kinetrell gradient values into the supported linear/radial gradient syntax. Source: `src/common/style/processors/backgroundImage.ts` parses `linear-gradient(...)` and `radial-gradient(...)` for both `backgroundImage` and `experimental_backgroundImage`.
- **`contrastColor()`** is available from Reanimated for UI-thread readable foreground selection. Kinetrell does not wrap it unnecessarily; examples use the upstream API directly. Source: `src/Colors.ts` defines `contrastColor(color): 'white' | 'black'` and `src/index.ts` re-exports it.
- **Shared Element Transitions** are closer to stable but still experimental. Kinetrell does not enable `ENABLE_SHARED_ELEMENT_TRANSITIONS` automatically. Source: the flag defaults to `false` in `src/featureFlags/staticFlags.json` and `src/featureFlags/staticFeatureFlags.ts`; `android/build.gradle.kts` refuses to build with it on together with `USE_LEGACY_LAYOUT_ANIMATIONS_PROXY`.
- **Android platform CSS transitions** can route opacity, colors, numeric border radius, and shadow color through Android's platform animation path when the experimental `ANDROID_CSS_PLATFORM_TRANSITIONS` flag is enabled. Kinetrell keeps this opt-in. Source: `ANDROID_CSS_PLATFORM_TRANSITIONS` defaults to `false` in `src/featureFlags/staticFlags.json`; the Android path lives in `android/src/main/java/com/swmansion/reanimated/css/CSSPlatformTransitionsManager.kt`.
- **RN 0.88 support** is official in Reanimated 4.7. `compatibility.json` lists React Native 0.86, 0.87 and 0.88 with Worklets 0.13.x for 4.7.x. Kinetrell's Expo fixtures use stable 0.88.1.
- **Mutables use Synchronizable state** in Reanimated 4.7; the old feature flag is gone.
- **Animated refs changed**: UI refs are shareables read through `.value`, and unmounted `measure()` returns `null`. Kinetrell adapters must treat missing measurement as unresolved instead of zero. Source: `src/platformFunctions/measure.native.ts` is typed `MeasuredDimensions | null` and returns `null` on every failure path.

## Worklets 0.13

Kinetrell accounts for fixed-type Synchronizable values, faster startup, Hermes microtask queues, Bundle Mode networking, safer runtime teardown, Swift Package Manager support, and the OXC Babel-plugin path. Stable public APIs do not require experimental Worklets configuration.

## Expo configuration

Expo already includes the Worklets Babel plugin in its starter/babel preset flow. Do not add a second Worklets/Reanimated Babel plugin to the Expo fixture. Reanimated 4 requires the New Architecture.
