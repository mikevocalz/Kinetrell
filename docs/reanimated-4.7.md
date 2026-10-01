# Reanimated 4.7 / Worklets 0.13 / Expo SDK 58

Kinetrell's primary native target is **Expo SDK 58 + React Native 0.88.0-rc.3 + React Native Reanimated 4.7.x + React Native Worklets 0.13.x**.

## Features Kinetrell deliberately uses or exposes

- **New light-tree layout animation engine** is Reanimated 4.7's default. Kinetrell interoperates with it rather than replacing it.
- **Animated `backgroundImage` gradients** are supported by Reanimated 4.7 and React Native 0.87+. `gradientToBackgroundImage()` serializes Kinetrell gradient values into the supported linear/radial gradient syntax.
- **`contrastColor()`** is available from Reanimated for UI-thread readable foreground selection. Kinetrell does not wrap it unnecessarily; examples use the upstream API directly.
- **Shared Element Transitions** are closer to stable but still experimental. Kinetrell does not enable `ENABLE_SHARED_ELEMENT_TRANSITIONS` automatically.
- **Android platform CSS transitions** can route opacity, colors, numeric border radius, and shadow color through Android's platform animation path when the experimental `ANDROID_CSS_PLATFORM_TRANSITIONS` flag is enabled. Kinetrell keeps this opt-in.
- **RN 0.88 support** is official in Reanimated 4.7. Kinetrell's Expo fixture uses 0.88.0-rc.3.
- **Mutables use Synchronizable state** in Reanimated 4.7; the old feature flag is gone.
- **Animated refs changed**: UI refs are shareables read through `.value`, and unmounted `measure()` returns `null`. Kinetrell adapters must treat missing measurement as unresolved instead of zero.

## Worklets 0.13

Kinetrell accounts for fixed-type Synchronizable values, faster startup, Hermes microtask queues, Bundle Mode networking, safer runtime teardown, Swift Package Manager support, and the OXC Babel-plugin path. Stable public APIs do not require experimental Worklets configuration.

## Expo configuration

Expo already includes the Worklets Babel plugin in its starter/babel preset flow. Do not add a second Worklets/Reanimated Babel plugin to the Expo fixture. Reanimated 4 requires the New Architecture.
