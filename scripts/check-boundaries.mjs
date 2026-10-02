import { existsSync, readFileSync } from 'node:fs';

const files = [
  'dist/index.mjs',
  'dist/core/index.mjs',
  'dist/native/index.mjs',
];

const browserOnlyFragments = [
  "from 'gsap'",
  'from "gsap"',
  "from 'gsap/",
  'from "gsap/',
  "from '@gsap/react'",
  'from "@gsap/react"',
  "from 'lenis'",
  'from "lenis"',
  "from 'lenis/",
  'from "lenis/',
];

for (const file of files) {
  if (!existsSync(file)) {
    throw new Error(`Expected build output is missing: ${file}`);
  }

  const source = readFileSync(file, 'utf8');
  for (const fragment of browserOnlyFragments) {
    if (source.includes(fragment)) {
      throw new Error(
        `Browser-only dependency leaked into ${file}: ${fragment}`,
      );
    }
  }
}

console.log('Kinetrell import boundaries verified.');
