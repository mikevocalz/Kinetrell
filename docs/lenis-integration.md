# Real Lenis browser integration

`kinetrell/web/lenis` imports the current `lenis` package and
`lenis/react`.

`createKinetrellLenis()` creates an owned Lenis instance. The wrapper only
destroys instances it created. With `autoRaf: false`, `start()` owns one
requestAnimationFrame loop. With `autoRaf: true`, Lenis owns its own clock and
Kinetrell does not start another loop.

`ReactLenis` is re-exported from the official package and
`useKinetrellLenis()` delegates to the official `useLenis()` hook.

Browser applications should import the recommended stylesheet themselves:

```ts
import 'lenis/dist/lenis.css';
```

The stylesheet is never imported by native/core entry points.


## ReactLenis / useLenis interoperability

The Vite showcase includes a separate nested `ReactLenis` provider and reads
its caller-owned instance through `useKinetrellLenis()`, which delegates to
the official `useLenis()` hook.

```tsx
import { ReactLenis, useKinetrellLenis } from 'kinetrell/web/lenis';

function Status() {
  const lenis = useKinetrellLenis();
  return <span>{lenis ? 'connected' : 'initializing'}</span>;
}

<ReactLenis options={{ autoRaf: true }}>
  <Status />
  <ScrollableContent />
</ReactLenis>
```

This is intentionally a nested/custom scrolling example, so it does not create
a second root scroller alongside the page-level GSAP/Lenis bridge. Kinetrell
does not destroy caller-owned `ReactLenis` instances.
