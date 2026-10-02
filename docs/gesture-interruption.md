# Gesture interruption

The optional `kinetrell/native/gesture` entry integrates React Native Gesture
Handler without making it a dependency of the normal `kinetrell/native`
entry.

```tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useMotionPanGesture } from 'kinetrell/native/gesture';

const pan = useMotionPanGesture(motion, {
  axis: 'x',
  distance: 320,
  settle: 'nearest',
});

const composed = Gesture.Simultaneous(nativeScrollGesture, pan);

<GestureDetector gesture={composed}>
  <Motion.View motion={motion} target="card" />
</GestureDetector>
```

The pan gesture cancels the active playhead timing animation on begin, writes
gesture progress directly to the UI-runtime playhead, and optionally settles to
the nearest endpoint using velocity projection.

Kinetrell intentionally does **not** own the parent's gesture relationship.
Callers choose `Simultaneous`, `Exclusive`, failure requirements, and scroll
interaction policy. This keeps nested scrolling and application-specific hit
testing under app control.
