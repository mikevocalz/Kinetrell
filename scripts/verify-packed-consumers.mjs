import { execFileSync } from 'node:child_process';
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const root = process.cwd();
const rootPackage = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const tempRoot = mkdtempSync(join(tmpdir(), 'kinetrell-consumers-'));

function run(args, cwd) {
  execFileSync(npm, args, {
    cwd,
    stdio: 'inherit',
    timeout: 180_000,
    env: { ...process.env, npm_config_audit: 'false', npm_config_fund: 'false' },
  });
}

function node(file, cwd) {
  execFileSync(process.execPath, [file], {
    cwd,
    stdio: 'inherit',
    timeout: 30_000,
  });
}

function createProject(name) {
  const dir = join(tempRoot, name);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, 'package.json'),
    JSON.stringify({ name: `kinetrell-${name}-consumer`, private: true, type: 'module' }, null, 2),
  );
  return dir;
}

let tarballPath;

try {
  // Git installs need the prepare lifecycle so dist is generated from a pinned
  // commit. The packed-consumer test has already built dist explicitly, so
  // suppress lifecycle scripts during npm pack to keep --json output machine-readable.
  const packed = JSON.parse(
    execFileSync(npm, ['pack', '--json', '--ignore-scripts'], {
      cwd: root,
      encoding: 'utf8',
      timeout: 60_000,
    }),
  );
  const findFilename = (value) => {
    if (!value) return null;
    if (typeof value === 'object' && typeof value.filename === 'string') {
      return value.filename;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        const filename = findFilename(item);
        if (filename) return filename;
      }
      return null;
    }
    if (typeof value === 'object') {
      for (const item of Object.values(value)) {
        const filename = findFilename(item);
        if (filename) return filename;
      }
    }
    return null;
  };
  const filename = findFilename(packed);
  if (!filename) {
    throw new Error(`npm pack did not return a tarball filename: ${JSON.stringify(packed)}`);
  }
  tarballPath = resolve(root, filename);

  {
    const dir = createProject('core');
    run(['install', '--omit=optional', tarballPath], dir);
    writeFileSync(
      join(dir, 'verify.mjs'),
      `import { defineMotion, compileMotion } from 'kinetrell/core';
const motion = compileMotion(defineMotion({ id: 'consumer', initial: { box: { x: 0 } }, tracks: [] }));
if (motion.id !== 'consumer') throw new Error('core import failed');
`,
    );
    node('verify.mjs', dir);
  }

  {
    const dir = createProject('lenis-only');
    run(
      [
        'install',
        tarballPath,
        `lenis@${rootPackage.devDependencies.lenis}`,
        `react@${rootPackage.devDependencies.react}`,
      ],
      dir,
    );
    writeFileSync(
      join(dir, 'verify.mjs'),
      `const mod = await import('kinetrell/web/lenis');
if (typeof mod.createKinetrellLenis !== 'function') throw new Error('Lenis entry import failed');
`,
    );
    node('verify.mjs', dir);
  }

  {
    const dir = createProject('gsap-only');
    run(
      [
        'install',
        tarballPath,
        `gsap@${rootPackage.devDependencies.gsap}`,
        `@gsap/react@${rootPackage.devDependencies['@gsap/react']}`,
        `react@${rootPackage.devDependencies.react}`,
      ],
      dir,
    );
    writeFileSync(
      join(dir, 'verify.mjs'),
      `const mod = await import('kinetrell/web/gsap');
if (typeof mod.createGsapTimeline !== 'function') throw new Error('GSAP entry import failed');
`,
    );
    node('verify.mjs', dir);
  }

  {
    const dir = createProject('combined-web');
    run(
      [
        'install',
        tarballPath,
        `gsap@${rootPackage.devDependencies.gsap}`,
        `@gsap/react@${rootPackage.devDependencies['@gsap/react']}`,
        `lenis@${rootPackage.devDependencies.lenis}`,
        `react@${rootPackage.devDependencies.react}`,
      ],
      dir,
    );
    writeFileSync(
      join(dir, 'verify.mjs'),
      `const [gsap, lenis, bridge] = await Promise.all([
  import('kinetrell/web/gsap'),
  import('kinetrell/web/lenis'),
  import('kinetrell/web/gsap-lenis'),
]);
if (!gsap.createGsapTimeline || !lenis.createKinetrellLenis || !bridge.connectGsapLenis) {
  throw new Error('combined browser imports failed');
}
`,
    );
    node('verify.mjs', dir);
  }

  {
    const dir = createProject('native-types');
    run(
      [
        'install',
        tarballPath,
        `react@${rootPackage.devDependencies.react}`,
        `react-native@${rootPackage.devDependencies['react-native']}`,
        `react-native-reanimated@${rootPackage.devDependencies['react-native-reanimated']}`,
        `react-native-worklets@${rootPackage.devDependencies['react-native-worklets']}`,
        `typescript@${rootPackage.devDependencies.typescript}`,
        `@types/react@${rootPackage.devDependencies['@types/react']}`,
      ],
      dir,
    );
    writeFileSync(
      join(dir, 'consumer.ts'),
      `import { useKinetrellScroll, type KinetrellScrollSource } from 'kinetrell/native';
const hook: () => KinetrellScrollSource = useKinetrellScroll;
void hook;
`,
    );
    writeFileSync(
      join(dir, 'tsconfig.json'),
      JSON.stringify(
        {
          compilerOptions: {
            target: 'ES2022',
            module: 'ESNext',
            moduleResolution: 'Bundler',
            strict: true,
            noEmit: true,
            skipLibCheck: true,
          },
          include: ['consumer.ts'],
        },
        null,
        2,
      ),
    );
    run(['exec', 'tsc', '--', '--project', 'tsconfig.json'], dir);
  }

  console.log('Packed consumer verification passed.');
} finally {
  if (tarballPath) rmSync(tarballPath, { force: true });
  rmSync(tempRoot, { recursive: true, force: true });
}
