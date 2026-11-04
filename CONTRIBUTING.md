# Contributing

Kinetrell intentionally has a small runtime surface. Changes should preserve:

1. zero browser imports from root/core/native entry points;
2. native scrolling as the authoritative iOS/Android scroll system;
3. one authoritative motion playhead per native motion instance;
4. explicit capability errors instead of fake parity;
5. no Bento, Tamagui or unrelated UI-kit dependencies.

Before opening a PR run:

```bash
npm run audit:current
npm run verify
```

CI installs `examples/expo58` with strict npm peers in the same job as the
library (see `docs/compatibility.md`).

Do not add `--force`, `--legacy-peer-deps`, dependency patches, Git URL
runtime dependencies or global GSAP ticker policy changes to make CI green.
