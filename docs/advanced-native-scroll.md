# Advanced native scroll behavior

Kinetrell keeps native scrolling authoritative. The advanced helpers add
velocity-aware snap selection and logical RTL offsets without creating a second
physics engine.

- `directionalSnapPoint()` chooses the nearest point at low velocity and the
  next/previous point after a decisive fling.
- `logicalScrollOffset()` converts horizontal physical offsets into a
  direction-independent logical coordinate for RTL choreography.
- `useNativeSnapController()` is opt-in and should not be combined with native
  `snapToOffsets` on the same axis. One snap owner only.

User drag generations invalidate queued programmatic commands so Kinetrell does
not fight a new touch interaction.
