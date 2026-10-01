import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

const registry = 'https://registry.npmjs.org/';
const observedAt = new Date().toISOString();

const selections = [
  ['expo', '58.0.1', 'Expo SDK 58 target (next tag)'],
  ['react', '19.3.0', 'Expo SDK 58 target'],
  ['react-native', '0.87.1', 'strict-npm library validation lane'],
  ['react-native', '0.88.0-rc.3', 'Expo SDK 58 target lane'],
  ['react-native-reanimated', '4.7.0', 'RN 0.86-0.88 compatible release'],
  ['react-native-worklets', '0.13.0', 'Reanimated 4.7 required lane'],
  ['react-native-gesture-handler', '3.2.1', 'Expo SDK 58 target'],
  ['gsap', '3.15.0', 'browser adapter'],
  ['@gsap/react', '2.1.2', 'React DOM adapter'],
  ['lenis', '1.3.26', 'browser scroll adapter'],
  ['typescript', '7.0.2', 'library toolchain'],
  ['vitest', '5.0.3', 'library tests'],
  ['tsdown', '0.23.0', 'library build'],
];

function view(spec, fields) {
  const raw = execFileSync(
    process.platform === 'win32' ? 'npm.cmd' : 'npm',
    ['view', spec, ...fields, '--json', '--registry', registry],
    { encoding: 'utf8', timeout: 20_000, stdio: ['ignore', 'pipe', 'pipe'] },
  );
  return JSON.parse(raw || '{}');
}

function unwrap(value) {
  return Array.isArray(value) ? value[0] : value;
}

const entries = [];
let failed = false;

for (const [name, version, reason] of selections) {
  const latest = unwrap(view(name, ['dist-tags.latest']));
  const metadata = unwrap(
    view(`${name}@${version}`, [
      'name',
      'version',
      'engines',
      'peerDependencies',
      'peerDependenciesMeta',
      'license',
      'deprecated',
      'dist.integrity',
    ]),
  );

  const latestVersion =
    typeof latest === 'string'
      ? latest
      : latest?.['dist-tags.latest'] ?? latest?.latest ?? null;

  const selectedVersion =
    typeof metadata === 'string'
      ? metadata
      : metadata?.version ?? null;

  const deprecated =
    typeof metadata === 'object' && metadata !== null
      ? metadata.deprecated ?? null
      : null;

  const ok = selectedVersion === version && !deprecated;
  failed ||= !ok;

  entries.push({
    name,
    selectedVersion: version,
    resolvedVersion: selectedVersion,
    reason,
    observedLatest: latestVersion,
    selectedIsLatest: latestVersion === version,
    prerelease: version.includes('-'),
    deprecated,
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
    react: '19.3.0',
    reactNative: '0.88.0-rc.3',
    reanimated: '4.7.0',
    worklets: '0.13.0',
  },
  validationLane: {
    reactNative: '0.87.1',
    reason:
      'npm strict peer resolution rejects the RN 0.88 prerelease against Reanimated 4.7.0 published peer metadata even though Reanimated 4.7 officially supports RN 0.88. Expo 58 is validated separately.',
  },
  entries,
};

mkdirSync('docs', { recursive: true });
writeFileSync('docs/dependency-audit.json', JSON.stringify(report, null, 2) + '\n');

if (failed) {
  const failures = entries.filter((entry) => !entry.ok);
  console.error('Dependency audit failed for:');
  console.error(JSON.stringify(failures, null, 2));
  process.exitCode = 1;
}
