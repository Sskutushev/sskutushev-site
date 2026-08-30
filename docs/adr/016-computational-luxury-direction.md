# ADR-016: replace the Signal / Material art direction

Status: accepted. Supersedes the visual half of ADR-004 and ADR-005.

The `Signal / Material` direction failed for structural reasons rather than execution ones. Every viewport carried identical weight — oversized uppercase display type, a painted column grid and monospaced metadata — so no viewport had a subject. The acid-lime accent appeared in navigation, section markers, buttons, tags, hover states, headings and footer simultaneously, which made it a background colour rather than a signal. Case studies rendered as table rows, which communicates enumeration rather than depth. The WebGL layer was a flat point field with no silhouette, and used additive blending, which is mathematically invisible against the light theme's near-white ground.

Those defects are not reachable by iteration, because each fix is constrained by the others: the grid demands the mono metadata, the mono metadata demands the accent, and the accent demands the dark ground.

The replacement direction, `Computational Luxury`, fixes three properties at the level of the system: one dominant subject per viewport; depth from material and light on a real object rather than from gradients or overlays; and neutral-by-default colour where chromatic values are reserved for lighting, primary action, focus, active state and degraded system states.

The direction is specified in `docs/design/`. Those documents are the contract for visual work and are versioned alongside the code they govern; the previous direction's documents were untracked, so agent instructions referenced files absent from a fresh clone.
