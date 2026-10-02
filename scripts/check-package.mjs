import { existsSync, readFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync('package.json', 'utf8'));
const dependencySections = [
  manifest.dependencies,
  manifest.devDependencies,
  manifest.peerDependencies,
  manifest.optionalDependencies,
].filter(Boolean);

for (const dependencies of dependencySections) {
  for (const name of Object.keys(dependencies)) {
    const normalized = name.toLowerCase();
    if (normalized === 'tamagui' || normalized.startsWith('@tamagui/')) {
      throw new Error(`Excluded dependency found: ${name}`);
    }
    if (normalized.includes('bento')) {
      throw new Error(`Excluded Bento dependency found: ${name}`);
    }
  }
}

for (const [subpath, conditions] of Object.entries(manifest.exports)) {
  const target =
    typeof conditions === 'string'
      ? conditions
      : conditions.import ?? conditions.default;

  if (target && !existsSync(target.replace('./', ''))) {
    throw new Error(`Export ${subpath} points to missing file ${target}`);
  }

  if (
    typeof conditions === 'object' &&
    conditions.types &&
    !existsSync(conditions.types.replace('./', ''))
  ) {
    throw new Error(
      `Export ${subpath} points to missing declaration ${conditions.types}`,
    );
  }
}

console.log('Kinetrell package surface verified.');
