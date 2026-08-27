# ADR-005: progressive interface motion

Status: accepted

Native CSS transitions and Motion handle component-level reveals and state changes. Lenis owns wheel smoothing because it provides one bounded, removable scroll scheduler without coupling page structure to an animation timeline.

The scheduler is disabled when `prefers-reduced-motion` is active and destroyed on unmount. Essential content, anchors and navigation remain native HTML; motion is never required to understand or operate the portfolio. GSAP was rejected because no timeline orchestration currently justifies its additional runtime and API surface.
