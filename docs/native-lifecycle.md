# Native lifecycle and reduced motion

`useMotion()` responds to changes in the system reduced-motion preference while
a scene is already running.

The default behavior is `finish`: decorative travel is removed and the scene
moves immediately to its stable endpoint. Applications that need to preserve
the exact current visual state can set `reducedMotionBehavior: 'pause'`.

Native motion also pauses when the app backgrounds and resumes only when the
same motion instance was previously playing. Set `pauseOnBackground: false`
only when the host intentionally owns that policy.

Unmount cleanup clears pending resume state and cancels the Reanimated
playhead. This keeps Strict Mode remounts and screen replacement from reviving
an obsolete animation.
