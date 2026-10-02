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

Expo SDK 58 preview validation is a separate fixture because of the currently
published React Native prerelease / Reanimated peer-metadata mismatch.

Do not add `--force`, `--legacy-peer-deps`, dependency patches, Git URL
runtime dependencies or global GSAP ticker policy changes to make CI green.
