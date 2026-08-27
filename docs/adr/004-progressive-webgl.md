# ADR-004: progressive WebGL quality

Status: accepted

The hero is a custom shader-driven point field rendered through React Three Fiber. It is lazy-loaded, caps device pixel ratio, reduces particle count on narrow screens, pauses when hidden, and provides a CSS fallback for reduced motion or unavailable WebGL. Visual quality must never block portfolio content.
