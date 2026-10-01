import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

const packages = [
  'expo',
  'react',
  'react-native',
  'react-native-reanimated',
  'react-native-worklets',
  'react-native-gesture-handler',
  'gsap',
  '@gsap/react',
  'lenis',
  'typescript',
  'vitest',
  'tsdown',
];

const registry = 'https://registry.npmjs.org/';
const observedAt = new Date().toISOString();
const selected = {
  expo: '58.0.1',
  react: '19.3.0',
  'react-native': '0.88.0-rc.3',
  'react-native-reanimated': '4.7.0',
  'react-native-worklets': '0.13.0',
  'react-native-gesture-handler': '3.2.1',
  gsap: '3.15.0',
  '@gsap/react': '2.1.2',
  lenis: '1.3.26',
  typescript: '7.0.2',
  vitest: '5.0.3',
  tsdown: '0.23.0',
};

function view(spec, fields) {
  const raw = execFileSync(
    process.platform === 'win32' ? 'npm.cmd' : 'npm',
    ['view', spec, ...fields, '--json', '--registry', registry],
    { encoding: 'utf8', timeout: 20_000, stdio: ['ignore', 'pipe', 'pipe'] },
  );
  return JSON.parse(raw || '{}');
}

const entries = [];
let failed = false;

for (const name of packages) {
  const latest = view(name, ['dist-tags.latest']);
  const version = selected[name];
  const metadata = view(`${name}@${version}`, [
    'name',
    'version',
    'engines',
    'peerDependencies',
    'peerDependenciesMeta',
    'license',
    'deprecated',
    'dist.integrity',
  ]);

  const latestVersion =
    typeof latest === 'string'
      ? latest
      : latest?.['dist-tags.latest'] ?? latest?.latest ?? null;

  const ok = metadata.version === version && !metadata.deprecated;
  failed ||= !ok;

  entries.push({
    name,
    selectedVersion: version,
    observedLatest: latestVersion,
    selectedIsLatest: latestVersion === version,
    compatiblePreviewException:
      name === 'react-native' && version.includes('-rc.'),
    metadata,
    ok,
  });
}

const report = {
  schemaVersion: 1,
  registry,
  observedAt,
  target: {
    expoSdk: '58.0.1',
    reactNative: '0.88.0-rc.3',
    reanimated: '4.7.0',
    worklets: '0.13.0',
  },
  entries,
};

mkdirSync('docs', { recursive: true });
writeFileSync('docs/dependency-audit.json', JSON.stringify(report, null, 2) + '\n');

if (failed) {
  console.error('Dependency audit failed. See docs/dependency-audit.json');
  process.exitCode = 1;
}
