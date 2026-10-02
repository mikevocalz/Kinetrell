import { performance } from 'node:perf_hooks';
import { mkdirSync, writeFileSync } from 'node:fs';
import { compileMotion, defineMotion, evaluateMotion } from '../dist/core/index.mjs';

function percentile(sorted, fraction) {
  if (sorted.length === 0) return 0;
  const index = Math.min(sorted.length - 1, Math.floor(sorted.length * fraction));
  return sorted[index];
}

function createScene(count) {
  const initial = {};
  const tracks = [];
  for (let index = 0; index < count; index += 1) {
    const target = `item-${index}`;
    initial[target] = { x: 0, opacity: 0 };
    tracks.push({
      target,
      to: { x: 100 + index, opacity: 1 },
      atMs: index * 2,
      durationMs: 600,
      ease: 'cubic.out',
    });
    tracks.push({
      target,
      to: { x: 0 },
      atMs: 450 + index * 2,
      durationMs: 500,
      ease: 'cubic.inOut',
    });
  }
  return defineMotion({ id: `scene-${count}`, initial, tracks });
}

const cases = [];
for (const targets of [20, 100, 300]) {
  const compileSamples = [];
  const evaluateSamples = [];
  let compiled;

  for (let run = 0; run < 30; run += 1) {
    const start = performance.now();
    compiled = compileMotion(createScene(targets));
    compileSamples.push(performance.now() - start);
  }

  for (let run = 0; run < 300; run += 1) {
    const time = (run / 299) * compiled.durationMs;
    const start = performance.now();
    evaluateMotion(compiled, time);
    evaluateSamples.push(performance.now() - start);
  }

  compileSamples.sort((a, b) => a - b);
  evaluateSamples.sort((a, b) => a - b);

  cases.push({
    targets,
    tracks: compiled.tracks.length,
    compileMs: {
      p50: percentile(compileSamples, 0.5),
      p95: percentile(compileSamples, 0.95),
      p99: percentile(compileSamples, 0.99),
    },
    evaluateMs: {
      p50: percentile(evaluateSamples, 0.5),
      p95: percentile(evaluateSamples, 0.95),
      p99: percentile(evaluateSamples, 0.99),
    },
  });
}

const report = {
  generatedAt: new Date().toISOString(),
  runtime: {
    node: process.version,
    platform: process.platform,
    arch: process.arch,
  },
  warning:
    'Host compiler/evaluator timing only. This is not a native UI FPS claim or physical-device benchmark.',
  cases,
};

mkdirSync('benchmarks/results', { recursive: true });
writeFileSync(
  'benchmarks/results/host-core.json',
  JSON.stringify(report, null, 2) + '\n',
);
console.log(JSON.stringify(report, null, 2));
