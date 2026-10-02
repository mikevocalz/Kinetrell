import { existsSync, readFileSync } from 'node:fs';

const excluded = (name) => {
  const normalized = name.toLowerCase();
  return (
    normalized === 'tamagui' ||
    normalized.startsWith('@tamagui/') ||
    normalized.includes('bento')
  );
};

const directManifest = JSON.parse(readFileSync('package.json', 'utf8'));
const directSections = [
  directManifest.dependencies,
  directManifest.devDependencies,
  directManifest.peerDependencies,
  directManifest.optionalDependencies,
].filter(Boolean);

const violations = [];

for (const section of directSections) {
  for (const name of Object.keys(section)) {
    if (excluded(name)) violations.push({ scope: 'direct', name });
  }
}

if (existsSync('package-lock.json')) {
  const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
  for (const [path, metadata] of Object.entries(lock.packages ?? {})) {
    if (!path) continue;

    const nodeModulesIndex = path.lastIndexOf('node_modules/');
    const inferredName =
      nodeModulesIndex === -1
        ? metadata?.name
        : path.slice(nodeModulesIndex + 'node_modules/'.length);

    const name = metadata?.name ?? inferredName;
    if (typeof name === 'string' && excluded(name)) {
      violations.push({ scope: 'transitive', name, path });
    }
  }
}

if (violations.length > 0) {
  console.error('Excluded dependency graph entries found:');
  console.error(JSON.stringify(violations, null, 2));
  process.exitCode = 1;
} else {
  console.log('Excluded dependency graph verified: no Bento or Tamagui packages.');
}
