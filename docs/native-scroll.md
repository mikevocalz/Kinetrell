# Native scroll choreography

Kinetrell keeps iOS and Android scrolling native. It does **not** install a
Lenis-like physics engine under a React Native ScrollView.

`useKinetrellScroll()` observes the authoritative native offset on the UI
Runtime and exposes:

- offset
- velocity and direction
- viewport/content length
- drag state
- an interaction generation counter for interruption-aware commands

The hook supports vertical and horizontal axes.

## Section progress

`useSectionProgress()` maps a section into a normalized 0–1 progress value.
The section start, section length, viewport length and scroll offset must all
use the same content coordinate space. A missing/offscreen virtualized cell is
not treated as position zero.

## Scrubbing

`useScrollScrub(motion, progress)` writes scroll progress directly to the
native Kinetrell playhead on the UI Runtime. This is the native equivalent of a
GSAP/ScrollTrigger scrub: no React state update and no JS-thread update occurs
per frame.

## Parallax

`useParallax(progress, distance)` returns a derived native value centered at
progress 0.5. Consumers choose how to apply it to their own animated style.

## Programmatic scrolling

`useNativeScrollController()` wraps Reanimated's native `scrollTo` and
Worklets 0.13 `scheduleOnUI`. Pass the observed scroll source's
`interactionGeneration` when programmatic commands should be invalidated as
soon as a native drag begins. The controller is axis-aware, does not create an
RAF loop, and does not take over touch handling. New commands invalidate older
queued commands; once a platform-native animated scroll has started, native
user input remains authoritative.

Platform-native animated scrolling itself remains owned by the native scroll
view. Kinetrell does not claim byte-for-byte Lenis wheel/touch physics parity.

## Snapping

`nearestSnapPoint()` provides deterministic snap selection. Only one layer
should own snapping on a given axis: either the native list/scroll view, a
Kinetrell command policy, or another scrolling system.
