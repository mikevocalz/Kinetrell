# Performance verification

Kinetrell's architecture avoids a React render or RN↔UI bridge on each frame:

- native playback advances one Reanimated shared-value playhead;
- target styles derive on the UI Runtime;
- native scroll scrubbing writes UI Runtime → UI Runtime;
- GSAP/Lenis coordination uses exactly one owning ticker when Kinetrell drives
  Lenis.

No FPS claim is made from unit tests or CI.

Before a stable release, benchmark 20, 100 and 300 target scenes plus a long
virtualized scroll fixture on physical iOS and Android hardware. Record device,
OS, refresh rate, release/debug mode, package versions, p50/p95/p99 frame time,
missed deadlines and memory before/after disposal.
