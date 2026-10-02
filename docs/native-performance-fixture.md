# Native performance fixture

`examples/native-performance` is the physical-device performance/integration
fixture for the Expo SDK 58 / RN 0.88 RC lane.

It intentionally combines:

- a 300-row virtualized `Animated.FlatList`;
- a Kinetrell native scroll source;
- scroll-linked hero parallax;
- a nested horizontal scroller;
- a lightweight Reanimated frame-delta probe sampled back to React only once
  every 120 frames;
- an RTL indicator for manual RTL runs.

The fixture is not evidence of a frame-rate claim until it is run on physical
hardware in release mode. Record device model, OS, refresh rate, build mode,
package versions, p50/p95/p99 frame intervals, missed deadlines, memory, and
first-interaction latency.

## Host benchmark

`node benchmarks/core.mjs` measures only deterministic compiler/evaluator CPU
time for 20, 100, and 300 targets. CI uploads the JSON result as evidence, but
the report explicitly states that it is **not** a native UI FPS benchmark.
