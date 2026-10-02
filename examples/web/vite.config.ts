import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const fromRoot = (relativePath: string) =>
  fileURLToPath(new URL(`../../${relativePath}`, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'kinetrell/core': fromRoot('src/core/index.ts'),
      'kinetrell/web/gsap': fromRoot('src/web/gsap.ts'),
      'kinetrell/web/lenis': fromRoot('src/web/lenis.ts'),
      'kinetrell/web/gsap-lenis': fromRoot('src/web/gsap-lenis.ts'),
    },
  },
  server: {
    fs: {
      allow: [fromRoot('.')],
    },
  },
});
