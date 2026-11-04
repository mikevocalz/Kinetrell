# Native performance fixture

`examples/native-performance` is the physical-device performance/integration
fixture for the Expo SDK 58.0.23 / RN 0.88.1 lane.

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

## Physical-device results

| Platform | Device | OS | Refresh rate | Build | Expo / RN / Reanimated / Worklets | Frames | >16.7 ms | >33.4 ms | Max delta | p50 / p95 / p99 | Memory before / after | First-interaction latency | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| iOS | | | | release | 58.0.23 / 0.88.1 / 4.7.1 / 0.13.0 | | | | | | | | not yet run |
| Android | | | | release | 58.0.23 / 0.88.1 / 4.7.1 / 0.13.0 | | | | | | | | not yet run |

No row has been filled in. Do not record simulator, emulator or debug-build
numbers here.

### Commands

From the repository root:

```bash
npm ci
npm run build
cd examples/native-performance
pnpm install --no-frozen-lockfile
npx expo prebuild --clean
```

`app.json` sets no `ios.bundleIdentifier` or `android.package`, so `prebuild`
asks for both. Use any reverse-DNS id you can sign with.

iOS, with the phone connected over USB and trusted:

```bash
npx expo run:ios --configuration Release --device
```

Android, with USB debugging on:

```bash
npx expo run:android --variant release --device
```

### What to record

Scroll the 300-row list end to end, then the nested horizontal scroller.

- **Frames, >16.7 ms, >33.4 ms, max delta**: read from the metrics row under
  the hero. The `useFrameCallback` probe refreshes it every 120 frames.
- **p50 / p95 / p99**: the probe does not compute percentiles. On Android run
  `adb shell dumpsys gfxinfo <package> reset`, scroll, then
  `adb shell dumpsys gfxinfo <package>` and copy the 50th/90th/95th/99th
  percentile lines. On iOS use the Instruments Animation Hitches template.
- **Memory**: Android `adb shell dumpsys meminfo <package>` before mount and
  after leaving the screen; iOS Xcode Debug Navigator or Instruments
  Allocations.
