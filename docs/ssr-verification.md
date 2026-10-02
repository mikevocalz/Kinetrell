# SSR and hydration verification

`examples/next-ssr` is a real Next.js 16.3.8 App Router consumer.

The server component imports only `kinetrell/core`, compiles a portable scene,
and emits HTML. A client boundary imports the real GSAP and Lenis adapters and
hydrates the same scene in the browser.

Playwright verifies both halves:

1. an HTTP request contains the server-rendered shell before client JavaScript;
2. Chromium hydrates the client boundary and switches the marker to
   `hydrated`;
3. no hydration mismatch or `window/document is not defined` errors are
   emitted.

This catches browser-side effects leaking into SSR imports and keeps the
portable core usable from server components.
