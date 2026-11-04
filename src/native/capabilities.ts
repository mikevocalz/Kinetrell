export const REANIMATED_BASELINE = '4.7.1' as const;
export const WORKLETS_BASELINE = '0.13.x' as const;
export const EXPO_BASELINE = '58.0.23' as const;
export const REACT_NATIVE_BASELINE = '0.88.1' as const;

export const reanimated47Capabilities = Object.freeze({
  newArchitectureRequired: true,
  newLayoutAnimationsEngineDefault: true,
  sharedElementTransitions: 'experimental' as const,
  animatedBackgroundImageGradients: true,
  contrastColor: true,
  androidPlatformCssTransitions: 'experimental' as const,
  supportedReactNativeRange: '0.86-0.88',
  expo58Target: true,
  /** @deprecated Expo SDK 58 now ships stable React Native 0.88.1. Use `reactNative088StableTarget`. */
  reactNative088ReleaseCandidateTarget: false,
  reactNative088StableTarget: true,
  worklets: Object.freeze({
    fixedTypeSynchronizable: true,
    bundleModeNetworking: true,
    oxcBabelPlugin: true,
    fasterStartup: true,
    hermesMicrotaskQueue: true,
    saferRuntimeTeardown: true,
    swiftPackageManager: true,
  }),
});
