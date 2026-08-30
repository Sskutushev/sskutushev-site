# ADR-017: single owner per animated transform

Status: accepted. Supersedes the scroll-scheduler decision in ADR-005.

The hero is a pinned, scroll-scrubbed sequence. Two implementations were considered.

GSAP with ScrollTrigger provides pinning and scrubbing directly, at roughly 50KB gzip against a 250KB gzip entry budget. Motion is already a dependency and provides `useScroll` with element offsets, which combined with a `position: sticky` container reproduces pinning without a second animation runtime. Motion was chosen: the added capability did not justify a second scheduler whose timeline could contend with the existing one for the same transforms.

The rule that follows is stricter than a dependency choice. Each animated transform has exactly one owner. CSS owns hover, press and focus. Motion owns component entrance, layout and the scroll progress value. React Three Fiber's `useFrame` owns everything inside the canvas and reads scroll progress through a ref; Motion never writes to a Three.js object. Two systems animating one transform produce frame-rate-dependent jitter that is difficult to attribute during review.

Lenis remains for wheel smoothing but is now scoped rather than global. Attaching it unconditionally to `window` swallowed wheel events inside the engineering drawer's own scroll container, making its lower half unreachable by mouse. The scheduler is stopped while any overlay with an independent scroll container is open, and remains disabled under `prefers-reduced-motion`.
