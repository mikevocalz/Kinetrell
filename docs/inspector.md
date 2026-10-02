# Inspector and diagnostics

Kinetrell exposes a development-only inspector from `kinetrell/dev/inspector`.
It is pure and tree-shakeable: it does not become the runtime clock and it does
not install UI, global listeners, or browser/native dependencies.

```ts
import { createMotionInspector } from 'kinetrell/dev/inspector';

const inspector = createMotionInspector(compiled);
console.log(inspector.snapshotAt(420));
console.log(inspector.diagnostics);
```

The inspector reports scene duration, labels, track ownership, active tracks at
an arbitrary time, evaluated state, and overlapping-property diagnostics.

Stable diagnostic codes are exported from `kinetrell/core/diagnostics`:

- `KINETRELL_UNSUPPORTED_NATIVE_PROPERTY`
- `KINETRELL_UNRESOLVED_TARGET`
- `KINETRELL_INVALID_POSITION`
- `KINETRELL_CONFLICTING_OWNER`
- `KINETRELL_MISSING_OPTIONAL_PEER`
- `KINETRELL_UNSUPPORTED_RUNTIME`

Diagnostics may include scene/target/property context and a corrective action,
but should never log application content or other sensitive values.
