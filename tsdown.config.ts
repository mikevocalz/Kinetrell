import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/core/index.ts',
    'src/core/diagnostics.ts',
    'src/dev/inspector.ts',
    'src/native/index.ts',
    'src/native/gesture.ts',
    'src/compat/gsap.ts',
    'src/web/gsap.ts',
    'src/web/lenis.ts',
    'src/web/gsap-lenis.ts',
  ],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  deps: {
    neverBundle: [
      'react',
      'react-native',
      'react-native-reanimated',
      'react-native-worklets',
      'react-native-gesture-handler',
      'gsap',
      'gsap/ScrollTrigger',
      '@gsap/react',
      'lenis',
      'lenis/react',
    ],
  },
});
