# Kinetrell — Master Implementation Prompt

**Working name:** Kinetrell (kin-eh-TRELL)  
**Positioning:** One motion language. Native execution.  
**Revised:** September 27, 2026 — revision 2: actual GSAP + Lenis integrations are required; animation and scrolling only.  
**Deliverable:** A standalone, publishable TypeScript motion library for React Native and React web.  
**Status:** Implementation specification, not an already-built or published npm package. The proposed name has not been reserved or cleared.

## Scope correction

Remove **Bento and Tamagui entirely**: no grid/UI kit, branded component collection, animation-driver integration, adapter, paid component dependency, related example, or related release requirement. In particular, do not install `tamagui` or any `@tamagui/*` package, directly or transitively. Do not substitute a different UI kit. Consumers bring their own components and layouts.

Kinetrell has two product pillars: **GSAP tween/timeline interoperability** and **Lenis scroll interoperability**, with supported behavior mapped to React Native Reanimated. **The real npm libraries `gsap` and `lenis` must be installed, integrated, exercised, and shipped behind isolated browser entry points.** They are not merely design references. Their adapters are required v1 deliverables; only their installation and activation by native-only consumers is optional. Native execution remains Reanimated, with native scrolling. Generic animated host bindings, gesture integration, and layout-transition interoperability serve the motion library; they are not a separate component system.

Kinetrell API names below are proposed APIs to implement; imports from `gsap`, `@gsap/react`, and `lenis` refer to the actual external libraries. A browser library is not automatically native-compatible. Build and test explicit mappings, and document unsupported features honestly.

Do not use remembered package versions. The implementation must query the live npm registry and select a current, published, compatible release set before installing dependencies. This prompt is not a verified dependency lockfile.

---

# BEGIN IMPLEMENTATION PROMPT

## 1. Mission

Build **Kinetrell**, a standalone code-first animation library that provides:

1. GSAP-like tweening, timelines, labels, stagger, sequencing, overlap, playback controls, and a clearly specified compatibility subset.
2. Lenis-like scroll choreography: reveals, scrubbing, parallax, progress, supported snapping, and controlled programmatic scrolling, while preserving native scrolling on iOS and Android.

Author motion as a typed, platform-independent definition. Execute supported motion through Reanimated on native. Support React Native Web with Reanimated, and implement a React DOM renderer powered by actual `gsap`, a browser scroll driver powered by actual `lenis`, and their joint ScrollTrigger integration. These browser integrations are mandatory to implement and test, not deferred extensions. Keep their imports out of native dependency graphs. The portable definition is the bridge; do not suggest that arbitrary GSAP/Lenis code can execute as native worklets.

This is a library project, not a Moyo Learn feature, a DVNT feature, a Viro feature, an application redesign, a WebView solution, or a fork of Reanimated. Do not modify another application or repository unless explicitly instructed. Inspect the current workspace first; create a standalone workspace only when no intended library workspace exists. Preserve unrelated work and respect repository instructions.

Implement the complete documented v1 contract, examples, tests, packaging, and documentation. Do not stop after scaffolding or a decorative demo. Do not hide missing behavior behind successful-looking stubs. If a capability cannot be verified, mark that capability unverified and preserve a runnable handoff; never label the release complete on that basis.

## 2. Expert-reference roster and ownership

Use these as craft references, not claims that these people are employed on, endorse, or have reviewed this project. Consult relevant published work rather than impersonating them or inventing quotations.

**Standing reference roster:** Luigi Rosso, Guido Rosso, Chris Dalton, Marc Rousavy, Eduardo Dorantes, William Candillon, Evan Bacon, Szymon Rybczak, Ricardo Cabello, Paul Henschel, Mike Alger, Ada Rose Cannon, and Brandon Jones.

**Reference organizations and projects:** Software Mansion, Margelo, Callstack, Expo, React Native, GSAP/GreenSock, darkroom.engineering, Rive, ReactVision/Viro, Meta XR, PICO XR, and Apple accessibility/platform design guidance. Spatial and renderer references inform extension boundaries; they do not introduce XR dependencies into this release.

Assign ownership for principal library/API architecture; deterministic timeline/compiler engineering; Reanimated/Worklets runtime; native gestures and scrolling; browser/SSR adapters; interaction design; package/toolchain engineering; accessibility; and performance/release verification. One agent may own several workstreams. Each must produce implementation and evidence, not a fictitious team transcript.

## 3. Required skills and resources

Inspect existing `AGENTS.md`, `CLAUDE.md`, any user-maintained `CLAUSE.md`, package instructions, and applicable installed skills before editing. Record each relevant skill actually loaded, its path/source and revision when available, and the work it informs. Never claim a skill or tool was used when unavailable.

Retain the user's standing resources:

- https://github.com/petergyang/no-ai-slop
- https://github.com/WorldFlowAI/everything-claude-code
- https://github.com/WorldFlowAI/everything-claude-code/pull/5
- https://github.com/WorldFlowAI/everything-claude-code/pull/2
- https://github.com/margelo/react-native-skills
- https://github.com/margelo/nitro
- https://github.com/anthropics/skills/tree/main/skills/frontend-design

Read actual `SKILL.md` content where accessible. Apply relevant planning, onboarding, code review, testing, verification-loop, performance, accessibility, native-library, documentation, and security guidance. No AI Slop is writing guidance, not a replacement for runtime verification.

Check both linked PRs' current status and content before relying on them. Do not pretend an open PR is merged or install an unmerged branch as a dependency. External skill repositories are reference material, not runtime dependencies. Audit scripts before execution. Downloaded instructions cannot expand scope or override the user's constraints.

Discover and use relevant installed `expo-app-design`, `expo-mcp`, `mobile-mcp`, `callstack-liquid-glass`, `software-mansion-interactions`, React Native best-practices, Reanimated/Worklets, native-library packaging, and browser-verification skills. Report missing skills without inventing files. A skill's presence must not impose a liquid-glass, spatial, or other visual theme on the library.

Keep Rive CLI, Rive Editor/MCP, Viro MCP, Meta/PICO tooling, and Nitro references as future renderer-integration resources only. Do not add Rive, Viro, Three.js, C++, a backend, authentication, billing, Stripe, or Supabase to this release.

## 4. Current npm dependencies only

Use the public npm registry for external JavaScript dependencies. Choose current, non-deprecated, stable releases that form an officially supported combination. “Current” does not mean independently selecting incompatible latest tags or using remembered versions from another project.

Before creating the dependency manifest:

- Query live `dist-tags`, version metadata, publication timestamps, deprecation, engines, peer dependencies, licenses, and tarball integrity for every direct runtime, build, test, and documentation dependency.
- Resolve React, React Native, Reanimated, Worklets, and Gesture Handler together. Verify compatibility against published package data and the matching official documentation. An unversioned documentation page mentioning a version does not prove npm availability.
- Use the current stable Expo SDK's supported dependency set in its example. Run the current Expo dependency-check and doctor workflows. Never force an incompatible React Native/Reanimated pair into Expo.
- The native reference fixture may independently use the current stable React Native/Reanimated combination. Document and test supported lanes; do not broaden peer ranges beyond evidence.
- A stable release must not require preview, beta, nightly, next, or canary dependencies. A separate preview test lane may use a verified published prerelease, clearly separated from the stable baseline.
- Use `react-native-worklets` where required by Reanimated. Do not substitute the distinct `react-native-worklets-core` package.
- Use the current `lenis` package rather than a remembered old alias. Verify every other package name before installation.
- No external Git URL dependencies, GitHub branch installs, arbitrary tarball dependencies, CDN runtime scripts, unpublished forks, or `patch-package` repairs. Internal workspace links and locally packed Kinetrell consumer tests are permitted during development.
- No `--force`, `--legacy-peer-deps`, or broad overrides to conceal incompatibility. Resolve the incompatibility or report the exact blocker.

Use npm workspaces and one committed `package-lock.json` for the new project. Pin exact direct development/example versions after verification. Published peer ranges must be explicit, bounded, and backed by the compatibility matrix. Do not publish `latest` as a dependency version. Verify Node/npm toolchain requirements as well.

Create `scripts/audit-current-npm.mjs`, `docs/dependency-audit.json`, `docs/compatibility.md`, and a license inventory. Record audit time, registry, observed latest tag, selected version, selection reason, publication date, engines, peers, license, deprecation, and integrity. Inspect deprecated and unresolved transitive packages; document upstream constraints rather than suppressing them.

Extend this query pattern into a robust script with bounded network timeouts and structured failures. It is not a complete compatibility resolver:

```bash
set -euo pipefail
mkdir -p .research/npm
packages=(
  react react-dom react-native react-native-web
  react-native-reanimated react-native-worklets
  react-native-gesture-handler expo gsap @gsap/react lenis
  typescript react-native-builder-bob
)
for package in "${packages[@]}"; do
  filename="${package//\//__}"
  npm view "$package" dist-tags time --json \
    --registry=https://registry.npmjs.org/ \
    > ".research/npm/${filename}.tags-and-time.json"
  npm view "$package@latest" \
    name version engines peerDependencies peerDependenciesMeta \
    dependencies license deprecated dist.integrity dist.tarball \
    --json --registry=https://registry.npmjs.org/ \
    > ".research/npm/${filename}.latest.json"
done
```

A DNS failure, timeout, authentication error, or rate limit is not evidence that a name is free. Check `kinetrell` and any proposed scope before publication. Do not reserve names, create remote repositories, or publish without authorization.

Enforce the exclusions at the top of this document in manifests, lockfiles, packed artifacts, example apps, and transitive dependency graphs. Do not leave an excluded integration behind as an optional peer.

### 4.1 Required real npm libraries — not just similarly named APIs

Implement and test these exact package integrations. The import locations are documented by their maintainers [G1–G4, L1–L3].

| npm package | Required use in Kinetrell | Consumption boundary |
| --- | --- | --- |
| `gsap` | Real `gsap.timeline()`, tweens, labels, stagger, playback, easing, and ScrollTrigger execution on the browser; reference execution for compatibility tests. | Required by `kinetrell/web/gsap` and the combined browser bridge. Never imported by root/native/core/recorder entry points. |
| `@gsap/react` | Official `useGSAP()` integration for Kinetrell's React DOM bindings and examples, including context-based cleanup and context-safe interactions. | Required by the React hooks in `kinetrell/web/gsap`; isolated from native and pure-core types. |
| `lenis` | A real Lenis scroll driver, owned or caller-injected instances, scroll commands/events, and joint GSAP/ScrollTrigger synchronization. | Required by `kinetrell/web/lenis` and the combined browser bridge. Never imported by native entry points. |
| `react-native-reanimated` | Native target styles, a UI-runtime playhead, native scroll-linked motion, and playback of the supported portable definitions. | Native / React Native Web binding lane, selected with compatible peers. |
| `react-native-worklets` | Supported worklet compilation and cross-runtime scheduling for the selected Reanimated version. | Compatible native execution lane; do not assume that imported browser code becomes worklet-safe. |
| `react-native-gesture-handler` | Native gesture ownership, interruption, and interaction integration. | Native binding/gesture lane. |

`gsap/ScrollTrigger` is an import from the installed `gsap` package, **not a separate npm dependency**. `lenis/react` is a subpath of `lenis`, **not a separate package to install**. Use its `ReactLenis` / `useLenis` interfaces for the required interoperability example. Include `lenis/dist/lenis.css` only in the browser app's stylesheet entry. Do not use deprecated `@studio-freight/lenis`, the old separate React wrapper, a private GreenSock registry, or CDN script injection [G1, L1–L3].

Create the standalone browser playground at `apps/playground-web` (or document an existing equivalent workspace). Before installation, run and record:

```bash
npm view gsap@latest version engines peerDependencies deprecated --json --registry=https://registry.npmjs.org/
npm view @gsap/react@latest version engines peerDependencies deprecated --json --registry=https://registry.npmjs.org/
npm view lenis@latest version engines peerDependencies deprecated --json --registry=https://registry.npmjs.org/
```

After the full audit approves the current stable combination, install the exact resolved versions. For an immediately audited latest-tag combination, the browser-workspace command is:

```bash
npm install --workspace=apps/playground-web --save-exact \
  gsap@latest @gsap/react@latest lenis@latest
```

For reproducible automation, have the audit script pass its exact approved version strings to this command instead of re-resolving tags between audit and install. Commit the exact versions actually installed and the lockfile. Do not replace native/Expo peer-resolution requirements with this browser command.

**Manifest requirements:** the browser playground declares all three browser packages as ordinary direct runtime dependencies. The library's development/test environment installs them to compile and test the integrations. In the single published `kinetrell` package, declare them as external optional peers with audited, bounded ranges and corresponding `peerDependenciesMeta` entries. They must not be bundled or copied into Kinetrell. Optional peer metadata means that native-only consumers can omit them; it does **not** mean that these implementations, examples, or tests may be skipped. Document the peers needed by each entry point. A missing peer should produce a clear setup error without breaking unrelated entry points or their TypeScript declarations.

If the chosen publishing toolchain cannot prove this isolation, document the reason and split browser adapters into separate packages rather than forcing browser dependencies onto native consumers. Keep one public package unless the isolation tests demonstrate a concrete need to split.

**Evidence boundary for this prompt:** public npm pages checked on September 27, 2026 displayed GSAP `3.15.0` and Lenis `1.3.26` [G0, L0]. These are observations, not a verified dependency lockfile or a substitute for a new registry check. Direct registry access in the prompt-authoring environment failed; no package installation, peer resolution, or runtime verification is claimed here. Resolve `@gsap/react` and every remaining package from npm during implementation rather than guessing their versions.

## 5. Architecture and package boundaries

Prefer one public package, `kinetrell`, with isolated entry points. Internal workspace modules need not all become separate published packages.

```text
kinetrell/                   # shared React Native / RN Web bindings
kinetrell/core               # pure definitions, compiler, math, types
kinetrell/compat/gsap        # supported-subset recorder; no GSAP import
kinetrell/web/gsap           # required implementation: real GSAP + React DOM hooks
kinetrell/web/lenis          # required implementation: actual Lenis scroll driver
kinetrell/web/gsap-lenis     # required implementation: joint GSAP/ScrollTrigger/Lenis bridge
```

The root resolves correctly for React Native and React Native Web. Browser entry points must work without importing native modules. `kinetrell/core` must run without React, the DOM, React Native, or native initialization. Keep its runtime dependencies at zero unless a documented necessity justifies otherwise.

Architecture: typed portable definitions → validated intermediate representation → execution adapters → target bindings. Publish an entry-point capability matrix. Avoid a generic abstraction that conceals unsupported behavior.

Use appropriate peer dependencies for React, React Native, Reanimated, Worklets, and Gesture Handler. Implement the required browser integrations with the optional-consumer-peer arrangement in section 4.1 and isolated imports. Missing browser peers must not break root/core/native imports or consumer TypeScript builds. Native artifacts must not accidentally import GSAP, `@gsap/react`, Lenis, browser stylesheets, `window`, or `document` through a barrel export. The Lenis-only entry must work without GSAP; put code requiring both libraries in `kinetrell/web/gsap-lenis`. Never re-export all web entries from the root.

Define interfaces for clock, target binding, measurements, scroll source, capabilities, and lifecycle. The same definition can target several renderers, but not every RN style automatically becomes a DOM style. An extension contract may expose numeric channels for future graphics integrations without bundling those renderers.

## 6. Motion language and compilation

Implement typed immutable definitions with schema version, scene ID, target IDs, initial values, tracks, keyframes, labels, stagger, timing, easing, loops, and discrete lifecycle events. Compile once per actual definition change, not per render or frame.

Kinetrell uses milliseconds: `durationMs`, `delayMs`, `atMs`, `offsetMs`. Rotation uses explicit `deg`/`rad` units; translations use platform logical layout units. The GSAP compatibility boundary accepts its documented seconds and converts exactly once. Never mix seconds, milliseconds, percentages, and logical pixels silently.

Require explicit initial values or a documented capture step for deterministic `to`/`from` behavior. Specify when snapshots are taken/refreshed. An unmeasured target is unresolved, not at position zero. Layout-dependent values need explicit measured inputs, not arbitrary strings or runtime `eval`.

Support opacity, x/y translation, scale/scaleX/scaleY, rotation, supported colors, border radius, and explicitly documented layout properties. Define transform order, origin capability, color interpolation, and interaction with nonanimated styles. Reject unsupported properties/units; preserve styles Kinetrell does not own.

Support tween/set/from/fromTo, keyframes, sequences, parallel and overlapping tracks, labels, label-relative positions, deterministic stagger, repeat, repeat delay, and yoyo. Define overwrite rules: reject conflicting writers or use a precise replacement policy. Object iteration must never accidentally choose a winner.

Implement label resolution, cycle detection, validation of targets and finite numbers, duration/progress bounds, immutable compiled output, and structured diagnostics. Reject unsupported negative absolute starts instead of silently shifting the scene. Stable target IDs must not depend on visible/translatable text or array indexes.

## 7. Native timeline runtime and lifecycle

Use current public Reanimated and Worklets APIs. One authoritative UI-runtime playhead drives a scene's tracks. Share scheduling where practical; do not create independent frame loops per property.

Compile track intervals/evaluators before playback and index active segments. Do not parse every definition each frame. Preserve reverse/seek correctness when using cursor optimizations. Stop idle work when paused, complete, disposed, or configured offscreen.

Implement `play`, `pause`, `resume`, `seek`, `reverse`, `restart`, `setPlaybackRate`, `setProgress`, `cancel`, `revert`, and `dispose`. Distinguish pause, cancellation, disposal, and restoration. Completion promises must resolve with completed/cancelled outcomes; replacement/unmount must not strand them.

Test zero-duration tracks, exact endpoints, repeated seeks, pre-play seek, mid-animation reverse, speed changes without jumps, loop boundaries, infinite repeats, and invalid progress. Distinguish cycle progress from total progress. Infinite repeats must not produce NaN total progress.

Seek suppresses lifecycle callbacks by default unless requested otherwise. Define play/reverse/repeat event-crossing rules. Guard queued callbacks with scene-generation IDs so replaced/disposed scenes cannot update new scenes. Reversible visual state and nonreversible application side effects are different contracts.

A seekable timeline spring needs a deterministic, duration-bounded evaluator with documented tolerances. An interactive spring can use physical spring execution and velocity continuity. Do not claim a live physical spring is automatically seekable or equivalent to a named GSAP easing curve.

No frame-by-frame GSAP `onUpdate` bridge into native shared values. No React state updates per frame. No private `_value`, undocumented scheduler calls, native source patches, or eval-based worklet generation. Use supported worklet-safe code and current cross-runtime scheduling for discrete events. Any JS progress subscription is explicit and throttled, never the native motion clock.

Respect hooks, Strict Mode, concurrent rendering, Fast Refresh, replacement, target mount/unmount, background/foreground, reduced-motion changes, and gesture cancellation. Specify clock policy after backgrounding; default to pausing nonessential motion rather than jumping through missed callbacks unpredictably.

## 8. GSAP-style recording and actual browser execution

Provide two distinct features.

### A. Supported-subset definition recorder

`kinetrell/compat/gsap` records documented GSAP-like definitions into the portable intermediate representation. It does not import GSAP, inspect arbitrary live timelines, parse arbitrary JavaScript, or execute browser plugins on native.

Support explicit target IDs/arrays, `set`, `to`, `from`, `fromTo`, labels, defaults, basic stagger, overlap, supported ease names, repeat/yoyo, and documented position expressions. Test numeric positions, labels, `<`, `>`, and positive/negative relative offsets. Reject invalid resulting positions or unsupported syntax with actionable diagnostics.

Map familiar x/y, opacity, scale, and rotation into portable values. Reject native CSS selectors unless caller-owned ID mapping resolves them. Reject unsupported DOM measurements, CSS custom properties, plugins, function-valued options, and callbacks that cannot be preserved. No silent field dropping or “100% GSAP compatible” claims.

### B. Required real GSAP browser runtime

`kinetrell/web/gsap` imports the actual npm `gsap` package and translates supported definitions into actual GSAP timelines. Do not substitute a homegrown evaluator, recorder, mock, or renamed Reanimated wrapper for this adapter. The shared deterministic evaluator belongs to native/core execution and differential tests, not a fake GSAP runtime. Provide React DOM bindings with explicit refs and the official `useGSAP()` hook from `@gsap/react`. Use context cleanup, `revertOnUpdate` where definitions change, and `contextSafe` for delayed/event-created animations. Register plugins in a controlled client initialization path, with no DOM reads at module scope. Verify SSR imports against the actual packed package and selected versions [G1–G3].

Separately typed browser-only escape hatches may expose nonportable behavior. Native consumers must receive capability errors, not fake equivalents for arbitrary ScrollTrigger pinning, DOM Flip, SplitText, MorphSVG, filters, or browser layout features.

Only one renderer may write a target/property at a time. Do not let GSAP and Reanimated fight over transforms. Define interruption, ownership transfer, and restoration, including when consumers combine timelines with Reanimated layout transitions or active gestures.

GSAP retains its own license. Do not copy its implementation into Kinetrell or relicense it. Preserve notices. Deliver a code-first library and read-only debugging aid, not a visual/no-code animation builder. Review current terms before adding a visual builder or a use that may require permission; do not claim legal clearance.

### C. Actual imports, playback, and independent parity evidence

The browser implementation must use the real imports below in its isolated client implementation. Do not eagerly load them from the root or native barrel. Public browser entry points must remain safe for the documented SSR import path; use a tested client-only implementation boundary or lazy initialization where necessary.

```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
```

Use `gsap.timeline()` for the supported tracks, converting Kinetrell milliseconds to GSAP seconds exactly once. Map transport commands to the real timeline while preserving Kinetrell's specified cancellation, callback, seek, and ownership semantics. Keep an explicit distinction between native portable options and browser-only GSAP/ScrollTrigger options.

Register `ScrollTrigger` and `useGSAP` only where needed. Do not include every GSAP plugin in the default bundle. Implement a real ScrollTrigger-backed browser reveal/scrub flow; do not merely update a fake progress value in a mock. Preserve caller-owned timelines, triggers, styles, and listeners. Never use `gsap.globalTimeline.clear()`, `ScrollTrigger.killAll()`, or global defaults as component cleanup.

Use real GSAP as an independent reference in parity tests. For portable numeric tracks and supported ease mappings, construct real paused GSAP timelines on independent target objects and sample both implementations at start/end, interior times, overlapping boundaries, labels, repeats, yoyo, and reverse/seek positions. Supplement these tests with real DOM binding tests. Document tolerances, initial snapshots, and unsupported semantics. Passing the same Kinetrell evaluator through two wrappers does not prove GSAP parity.

## 9. Scroll choreography and required Lenis integration

Build a scroll-source abstraction around native scroll events/offsets and browser equivalents. Native mode uses native scrolling components. Preserve momentum, touch handling, pull-to-refresh, keyboard behavior, accessibility scrolling, nested scrolling, and virtualization.

Offer a convenience scroll wrapper and hooks for existing animated ScrollViews/virtualized lists. Do not require replacement of every list, disable virtualization, or monopolize consumers' `onScroll` callbacks.

Expose offset, viewport/content dimensions, normalized progress, velocity/direction, overscroll policy, section progress, and cancellation-aware `scrollTo`. Support vertical/horizontal axes, insets, keyboard/viewport changes, orientation, foldables, RTL, nested containers, dynamic content, late images, and text reflow.

Provide section enter/leave, one-shot/reversible reveal, direct scrub, optionally smoothed visual scrub, parallax, scroll-linked scale/fade/rotation, and supported snapping. Input and hit testing follow actual native scroll position. Do not delay input to imitate desktop wheel smoothing. Decorative smoothed progress is distinct from authoritative position.

Define measurement coordinate spaces. Never subtract screen-relative target coordinates from content-relative offsets. Cache measurements and invalidate on relevant changes; avoid JS measurement every frame. Virtualized/offscreen targets can use estimates or caller-provided positions with explicit uncertainty; missing cells are not zero-position elements.

Snapping has one owner. Do not combine native snapping, custom snap springs, and another scrolling engine on one axis. Touch/drag cancels programmatic scrolling, resolves pending commands appropriately, and does not fight the user's next input. Protect nested content and focused text inputs.

Native pinning covers specifically implemented patterns such as sticky headers or bounded measured overlays with correct space reservation. Document limitations. Do not advertise arbitrary ScrollTrigger DOM pin equivalence.

The required `kinetrell/web/lenis` implementation imports current npm `lenis` and uses a real Lenis instance, either owned or injected. Implement real scrolling, command cancellation, progress/events, and start/stop integration; a stub or a Lenis-like class does not satisfy this requirement. Support caller-owned instances obtained through `lenis/react` without creating a second root scroller. Destroy only resources Kinetrell owns. Keep stylesheets out of native paths and document the browser CSS import explicitly [L1–L3].

Exactly one clock calls an owned Lenis instance. For GSAP coordination, use documented seconds-to-ms conversion and remove only Kinetrell's ticker subscription. Never combine automatic RAF with a second RAF/ticker. Do not globally alter GSAP ticker policy, broadly prevent browser interactions, or reset other consumers' listeners.

Handle anchors, nested scrollers, route cleanup, resizing, reduced motion, and restoration of owned styles. Smoothing is intentional, not automatically enabled because a page mounts.

### 9.1 Real Lenis and combined GSAP/ScrollTrigger integration

The isolated browser implementation uses these real published import paths; the CSS import belongs in the browser example/consumer, not native modules:

```ts
import Lenis from 'lenis';
import { ReactLenis, useLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
```

Implement `kinetrell/web/gsap-lenis` as the joint adapter. Its proposed `connectGsapLenis` contract receives the actual GSAP engine, ScrollTrigger plugin, and Lenis instance plus an explicit clock-ownership mode. This is an API to implement, not a currently available package export.

- **Kinetrell-driven mode:** only attach when this layer has explicit authority to drive a Lenis instance created/configured with `autoRaf: false` and no other active driver. Register one stable ticker callback that calls `lenis.raf(timeInSeconds * 1000)`. Connect the Lenis `scroll` event to ScrollTrigger updates and Kinetrell's scroll-source notifications. The documented conversion is required because the APIs use different time units [G4, L2, L3].
- **Externally driven mode:** accept a caller-owned instance that already has RAF/ticker ownership, subscribe to its events, and do not add another clock or change its configuration. Both modes must be available without assuming ownership merely because an instance was injected.
- **Cleanup and failures:** return an idempotent disconnect function. Remove only the callbacks this bridge registered; leave caller instances, unrelated GSAP animations, and host ticker settings untouched. Destroy an owned Lenis instance only in the owning driver's disposal. Roll back partial initialization on failure. Prevent duplicate ownership for the same instance across Strict Mode mounts and nested providers.

The maintainers show GSAP ticker coordination in Lenis's official integration examples [L2, L3]. They also show an application-level `gsap.ticker.lagSmoothing(0)` configuration [L2]. Because GSAP's ticker policy affects all GSAP animations, Kinetrell must **not** silently set or reset that global policy; document it as an explicit host-application choice and test the supported host configurations [G4].

Do not run Lenis and GSAP ScrollSmoother simultaneously on the same scroll container. Lenis owns smooth scrolling in this integration; ScrollTrigger reacts to scroll and controls scene progress. Avoid unnecessary `scrollerProxy` configuration; use it only when the selected custom-scroller arrangement actually requires it and is covered by a fixture. Trigger expensive measurement refreshes after relevant layout changes, not on every scroll event.

### 9.2 Native behavior mapping — not browser code running in worklets

| Browser behavior | Required native mapping |
| --- | --- |
| Actual GSAP tween/timeline | Supported portable definition compiled to Reanimated's native timeline/playhead; unsupported GSAP features produce capability diagnostics. |
| Actual Lenis offset/progress events | Native animated scroll events/shared values, mapped into the same typed scroll-source contract. |
| ScrollTrigger-style reveal/scrub/parallax | Measured native section progress driving the compiled motion; explicit coordinate spaces and invalidation. |
| Lenis programmatic scrolling | A cancellation-aware native `scrollTo` implementation; do not claim identical desktop-wheel/touch physics. |
| Browser pinning/snapping | Only the documented native sticky/overlay/snap capabilities; no fabricated universal DOM parity. |

Require a shared portable scene to run in (1) native Reanimated, (2) React Native Web/Reanimated, and (3) React DOM with **actual GSAP + actual Lenis**. Explicitly identify any renderer-specific settings. The native path must stay operational with `gsap`, `@gsap/react`, and `lenis` completely absent from its clean consumer fixture.

## 10. Composable bindings, not a UI kit

Expose thin animated host bindings and hooks for consumer-owned views, text, images, and existing components. The library controls motion; consumers control layout, content, styling, navigation, and application state.

Document timeline integration with supported native gestures, presses, hover/focus, and public Reanimated layout transitions. Keep property ownership explicit. Do not introduce a grid renderer, card system, drag-reorder component collection, design system, mandatory theme, translation framework, or prebuilt page layouts.

Support dynamic child content, lists, images, translated strings, and async loading without depending on their semantics. Use stable target IDs; do not derive keys from English strings. Test RTL, CJK, long text, emoji, large type, and delayed measurements.

Existing interactive controls retain their accessibility semantics, focus behavior, and input handlers. A consumer must be able to animate its existing UI without rebuilding it around Kinetrell-specific visual components.

## 11. Proposed API to implement and compile-test

These are proposed APIs. Implement them before claiming the examples work.

```tsx
import { StyleSheet } from 'react-native';
import { defineMotion, Motion, useMotion } from 'kinetrell';

const introduction = defineMotion({
  id: 'introduction',
  initial: {
    panel: { opacity: 0, y: 24, scale: 0.98 },
    title: { opacity: 0, y: 8 },
  },
  tracks: [
    {
      target: 'panel',
      to: { opacity: 1, y: 0, scale: 1 },
      atMs: 0,
      durationMs: 420,
      ease: 'cubic.out',
    },
    {
      target: 'title',
      to: { opacity: 1, y: 0 },
      atMs: 100,
      durationMs: 260,
      ease: 'cubic.out',
    },
  ],
});

export function Introduction() {
  const motion = useMotion(introduction, {
    autoplay: true,
    reducedMotion: 'system',
  });

  return (
    <Motion.View motion={motion} target="panel" style={styles.panel}>
      <Motion.Text motion={motion} target="title">
        One definition. Native motion.
      </Motion.Text>
    </Motion.View>
  );
}

const styles = StyleSheet.create({
  panel: { padding: 24 },
});
```

Provide DOM equivalents from the browser entry, such as `Motion.div`, preserving the definition's meaning without pretending host types are identical.

Implement this supported-subset migration experience:

```ts
import { recordGsap } from 'kinetrell/compat/gsap';

export const reveal = recordGsap((timeline) => {
  // A registered target ID, not a CSS selector.
  timeline.fromTo(
    'panel',
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out' },
    0,
  );
});
```

The recorder returns a portable definition, not a GSAP timeline. Maintain an explicit easing-equivalence table; similarly named curves are not necessarily mathematically identical.

Each `useMotion` creates an isolated playback instance. Shared definitions must not accidentally share mutable state. Bindings are typed, stable across rerenders, and cleaned up on unmount. Do not require hooks inside loops or imperative style mutation during React render.

## 12. Accessibility

Default to system reduced-motion preferences and handle changes during playback. Define reduced-motion behavior per feature: immediate stable state, reduced travel, or an appropriate minimal transition. Preserve lifecycle correctness without decorative loops.

Support VoiceOver, TalkBack, keyboard navigation on web, visible focus, readable contrast, logical reading order, and caller-provided roles/labels. Opacity zero does not automatically make hidden content inaccessible to focus; coordinate visibility, pointer events, and accessibility state explicitly.

Avoid flashing, hover-only controls, scroll traps, and infinite motion without a stop policy. Demonstrations must include reduced-motion controls and real accessibility notes. Do not add an unrelated visual theme to demonstrate accessibility.

## 13. Distribution and configuration

Evaluate the current npm-published React Native Builder Bob toolchain and its official guidance. Use the smallest suitable build setup. Ship declarations, appropriate source maps, clean exports, README, license, and a curated files list.

Verify export-condition ordering, Metro, browser bundlers, Node core import, and consumer TypeScript resolution. Preserve required client-only boundaries in server-rendered React environments without browser side effects at module scope.

Follow current Worklets library-distribution guidance. Avoid worklets precompiled with an incompatible Babel plugin. Where consumer compilation is required, preserve directives and prove the packed artifact is processed correctly by an external app. Workspace aliases are not release evidence.

No config plugin unless Kinetrell itself needs native configuration. Peer setup does not justify a no-op plugin. Document current Expo/bare RN setup, Worklets/Babel ordering where required, Gesture Handler root setup, and native rebuild steps. Do not install the same Babel plugin twice.

Run `npm pack --dry-run`, then install the packed tarball into clean consumer fixtures. Verify optional dependencies remain optional, source maps do not expose secrets, and development files are not shipped.

## 14. Tests, benchmarks, and evidence

Choose current compatible npm-published tooling for compiler tests, type tests, native integration, browser interaction, and packed-consumer tests. Do not add multiple frameworks without a clear need.

Compiler tests cover labels/cycles; seconds-to-ms conversion; sequence/parallel/overlap; snapshots; stagger; keyframes; transforms/colors; easing endpoints; zero duration; repeat/yoyo/reverse; seeking; cancellation; invalid input; and deterministic evaluation at arbitrary times. Sample matching definitions through each applicable adapter with documented numerical tolerance.

Lifecycle tests cover Strict Mode, rapid mount/unmount, background/foreground, late target registration, replacement, promises, callback suppression, and stale events. Mocked clocks prove math, not actual UI-runtime execution.

Native integration tests cover native scroll plus parallax, long virtualized lists, horizontal/RTL scrolling, nested scrolling, snapping interruption, gestures with parent scrolling, content resize, large text, reduced motion, and consumer theme/content changes during playback. Read the current Gesture Handler API for the chosen stable lane rather than copying older callback names.

Browser tests cover RN Web, actual DOM/GSAP, actual Lenis on/off, their joint ScrollTrigger adapter, resize, route cleanup, Strict Mode, reduced motion, keyboard/focus, exactly one owned RAF/ticker, SSR imports, and hydration without initial-state flash/mismatch. Use installed real packages for end-to-end integration tests, not only mocked GSAP/Lenis APIs. Include a GSAP-only fixture, a Lenis-only fixture without GSAP installed, a combined fixture, and a clean native fixture with none of the browser peers installed. Verify that two consumer components sharing an externally owned Lenis instance neither double-drive nor destroy it, and that unrelated GSAP animations survive Kinetrell disposal.

Benchmark representative 20/100/300-target scenes, overlapping timelines, scrubbing, and a long virtualized feed. Record device/model, OS, refresh rate, app mode, package versions, complexity, and memory. Measure UI/JS frame timing, missed deadlines, p50/p95/p99 where possible, first-interaction latency, and cleanup using the display's actual frame budget.

Establish explicit budgets from a measured baseline before optimizing. Require no leaked owned loops/listeners after disposal and no React render per frame. Do not claim 120 fps from Jest, a simulator, a dev build, or a budget calculation. Identify physical-device evidence; unavailable hardware is untested, not passed.

## 15. Showcase and documentation

Deliver native and browser playgrounds using the same definitions where capabilities match. Demonstrate tween/sequence/overlap/stagger, transport controls, scroll reveal/scrub, parallax, gesture interruption, dynamic content, layout-transition interoperability, and reduced motion. The browser playground must visibly run the actual GSAP renderer, the actual Lenis driver, and their combined ScrollTrigger scene; include a separate ReactLenis/useLenis interoperability example. Label the active renderer and the actually installed versions in development diagnostics. Use simple consumer-owned views and text, not a separately shipped visual component collection.

A development-only, tree-shakeable inspector can show scenes, ownership, progress, labels, capabilities, and warnings. It may expose playback/testing controls, but is not a visual/no-code editor and must not become the runtime clock.

Write quickstart, API reference, GSAP migration table, native/Lenis scrolling guide, architecture, compatibility/capabilities, troubleshooting, accessibility, performance methodology, and contribution/release instructions. Every public example must compile against the packed library. Document unsupported features without exaggerating parity.

Provide diagnostics such as `KINETRELL_UNSUPPORTED_NATIVE_PROPERTY`, `KINETRELL_UNRESOLVED_TARGET`, `KINETRELL_INVALID_POSITION`, `KINETRELL_CONFLICTING_OWNER`, `KINETRELL_MISSING_OPTIONAL_PEER`, and `KINETRELL_UNSUPPORTED_RUNTIME`. Include relevant scene/target/property and corrective action without logging sensitive content.

## 16. Delivery order and release gates

Continue through every gate:

**A — Evidence and architecture:** workspace inspection; skills log; live npm audit; license inventory; compatibility/capabilities; API/IR decisions; name-check status.

**B — Compiler and native runtime:** deterministic core; typed bindings; full playback/lifecycle contract; unit/type tests; external native consumer.

**C — Native interactions:** scroll integration; gestures; accessibility; layout-transition interoperability; dynamic content and virtualization tests.

**D — Required real-library integrations:** GSAP-like recorder; actual npm `gsap` timeline/ScrollTrigger execution; official `@gsap/react` bindings; actual npm `lenis` driver; joint GSAP/Lenis bridge; `lenis/react` interoperability; independent GSAP parity tests; browser/SSR/package-isolation tests. None of these deliverables is optional.

**E — Release candidate:** complete playgrounds; compiled documentation; packed-install tests; benchmarks; CI; changelog/release process; limitations report.

Do not publish, create paid accounts, reserve names, change production apps, merge remote PRs, or deploy without authorization. Release verification must include fresh dependency evidence, frozen lockfile install, types, lint, tests, builds, package contents, licenses, scope-exclusion checks, and consumer fixtures. An empty vulnerability-scanner report is not a complete security review.

Deliver source modules, both playgrounds, consumer fixtures, scripts, CI, `README.md`, `LICENSE`, `THIRD_PARTY_NOTICES.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `docs/dependency-audit.json`, `docs/compatibility.md`, `docs/capabilities.md`, `docs/architecture.md`, `docs/gsap-migration.md`, `docs/gsap-integration.md`, `docs/lenis-integration.md`, `docs/gsap-lenis-bridge.md`, `docs/native-scroll.md`, `docs/accessibility.md`, `docs/performance.md`, `docs/verification.md`, and `HANDOFF.md` when anything remains unverified. The three integration guides must include exact verified package installation commands, imports, platform restrictions, owned/injected examples, cleanup, and links to the running fixtures.

The final report separates implemented, tested, unverified, and blocked work. Include exact selected npm versions/timestamps, actual commands/results, evidence paths, installation instructions, limitations, and external actions needing permission. Never invent commits, test counts, device runs, publication, or name availability.

Begin with workspace inspection and the live dependency audit, then implement. Do not return another plan instead of building the library.

# END IMPLEMENTATION PROMPT

---

## Primary reference locations to verify during implementation

These are reference locations, not guarantees that an unversioned page matches the package chosen for release. Read current sources and published metadata.

- npm queries: https://docs.npmjs.com/cli/v11/commands/npm-view/
- Reanimated compatibility: https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/
- Reanimated installation: https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/
- Reanimated troubleshooting: https://docs.swmansion.com/react-native-reanimated/docs/guides/troubleshooting/
- Reanimated web: https://docs.swmansion.com/react-native-reanimated/docs/guides/web-support/
- Worklets: https://docs.swmansion.com/react-native-worklets/
- Gesture Handler: https://docs.swmansion.com/react-native-gesture-handler/
- GSAP timelines: https://gsap.com/docs/v3/GSAP/Timeline/
- GSAP license: https://gsap.com/community/standard-license/
- Lenis: https://www.npmjs.com/package/lenis
- Builder Bob: https://oss.callstack.com/react-native-builder-bob/build

## Reference keys for the real-library requirements

These are maintainer/npm sources consulted for this revision. Recheck the published package version and matching documentation when implementing. A source on a repository's `main` branch may describe work newer than an installed package.

- **[G0] GSAP public npm package and displayed release:** https://www.npmjs.com/package/gsap
- **[G1] GSAP installation and plugin imports:** https://gsap.com/docs/v3/Installation/
- **[G2] Official React/useGSAP integration and cleanup:** https://gsap.com/resources/React/
- **[G3] ScrollTrigger:** https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- **[G4] GSAP ticker, units, callbacks, and global lag policy:** https://gsap.com/docs/v3/GSAP/gsap.ticker/
- **[L0] Lenis public npm package and displayed release:** https://www.npmjs.com/package/lenis
- **[L1] Lenis current package installation and deprecated alias notice:** https://www.npmjs.com/package/@studio-freight/lenis
- **[L2] Lenis maintained README, CSS, methods, and GSAP integration:** https://github.com/darkroomengineering/lenis/blob/main/README.md
- **[L3] Lenis React entry, hooks, ownership, and GSAP ticker example:** https://github.com/darkroomengineering/lenis/blob/main/packages/react/README.md
- **[R1] Reanimated worklet execution model:** https://docs.swmansion.com/react-native-reanimated/docs/guides/worklets/
