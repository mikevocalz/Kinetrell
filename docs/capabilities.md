# Capability matrix

| Capability | Core | Native / Reanimated | Web / GSAP + Lenis |
| --- | --- | --- | --- |
| Typed tween definitions | yes | yes | yes |
| to / from / fromTo / set | yes | yes | yes |
| Labels and relative positions | yes | yes after compile | yes after compile |
| Repeat / yoyo | yes | yes | yes |
| Keyframes | yes; compiled to segments | yes | yes |
| Seek / reverse / playback rate | yes | yes | GSAP native controls |
| Target-array stagger | recorder | compiled tracks | compiled tracks |
| Scroll reveal / scrub | math only | UI-runtime progress | ScrollTrigger |
| Parallax | math only | UI-runtime derived value | Lenis/GSAP |
| Programmatic scroll | n/a | native scrollTo | Lenis scrollTo |
| Smooth desktop wheel physics | n/a | platform native only | Lenis |
| Arbitrary CSS selectors | no | no | caller maps real targets |
| Arbitrary GSAP plugins | no | no | browser escape hatch only |
| Shared element transitions | n/a | experimental upstream; opt-in only | n/a |
| Reanimated background gradients | value support | Reanimated 4.7 path | browser CSS/GSAP |

Kinetrell does not claim 100% GSAP or Lenis API compatibility. Portable motion
is the common contract; renderer-specific behavior remains renderer-specific.
