# Browser interaction verification

The browser showcase is verified in real Chromium and WebKit with
`@playwright/test@1.63.0`.

The suite checks that:

- the actual GSAP + ScrollTrigger + Lenis renderer initializes;
- scrolling changes the motion panel's computed transform/opacity;
- keyboard scrolling remains available;
- reload/cleanup does not surface browser runtime errors.

The Playwright web server builds and serves the Vite showcase for every run.
This is separate from unit tests: it verifies browser behavior, DOM integration,
and the real external animation libraries.
