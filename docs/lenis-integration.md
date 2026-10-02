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
