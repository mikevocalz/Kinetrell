# Accessibility

Native motion follows the system reduced-motion preference by default.
Consumers can explicitly choose `always` or `never` where appropriate.

Kinetrell animates caller-owned controls and does not replace their semantic
roles, labels, focus order or input handlers.

Scroll choreography never delays native touch input to imitate desktop wheel
smoothing. Native scrolling remains authoritative for VoiceOver/TalkBack,
keyboard interactions, momentum and platform accessibility behavior.

On web, reduced motion should be used to disable or minimize decorative Lenis
smoothing and GSAP loops. Hidden visual content still needs application-level
focus/accessibility management; opacity alone does not remove it from the
accessibility tree.
