# ADR-004: progressive WebGL quality

Status: accepted

The hero is a custom shader-driven point field rendered through React Three Fiber. It is lazy-loaded, caps device pixel ratio, reduces particle count on narrow screens, pauses when hidden, and provides a CSS fallback for reduced motion or unavailable WebGL. Visual quality must never block portfolio content.

Ranking and request-pipeline scenes use shader attributes and uniforms instead of rebuilding geometry during interaction. Each particle field remains one draw call. Intersection observers stop the render loop when a scene leaves the viewport.
