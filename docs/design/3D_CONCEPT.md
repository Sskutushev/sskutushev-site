# 3D Concept — System Core

## What 3D is for here

The site claims its author designs layered systems that stay honest under load. The System Core is
that claim rendered as an object: three nested layers, visibly separable, with something moving
between them. It is the one thing on the page that HTML and CSS cannot express — a real surface
under real light, whose material changes when the environment changes.

Anything that does not serve that is decoration and is out of scope.

## The object

An abstract industrial sculpture. Not a server, not a globe, not a logo. Three concentric layers,
each standing for a layer of the systems described in the case studies.

```
                    ┌─────────────────────────┐
                    │   INFRASTRUCTURE        │   titanium cage
                    │  ┌───────────────────┐  │   8 struts + 2 rings
                    │  │   DATA            │  │
                    │  │  ┌─────────────┐  │  │   optical glass shell
                    │  │  │   ◉  API    │  │  │   rotated 45° on Y
                    │  │  └─────────────┘  │  │
                    │  │                   │  │   emissive core
                    │  └───────────────────┘  │   + fast inner ring
                    └─────────────────────────┘
                         ↑ pulses travel outward ↑
```

| Layer   | Label          | Geometry                                                 | Material                                                                       |
| ------- | -------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Outer   | INFRASTRUCTURE | 8 vertical struts on a radius, capped by two torus rings | Brushed titanium: `metalness 1.0`, `roughness 0.34`, anisotropic highlight     |
| Middle  | DATA           | Rounded box, bevelled, rotated 45° on Y                  | Optical glass: transmission, `ior 1.46`, low `roughness`, chromatic dispersion |
| Inner   | API            | Icosahedron + a thin counter-rotating ring               | Emissive, prism-tinted, intensity driven by a 5s pulse                         |
| Between | —              | 24 instanced pulses on radial paths                      | Additive-free emissive; visible in both themes                                 |

Built entirely from Three.js primitives and `drei` helpers. **No GLB.** A downloaded model would add
1–2MB to a page whose entry budget is 250KB gzip, and would be harder to make theme-reactive.

## Materials by theme

The theme switch is the most convincing single moment on the site: the same object is re-lit and
re-surfaced, and it reads as two different manufactured things.

| Property      | Dark                                                          | Light                                              |
| ------------- | ------------------------------------------------------------- | -------------------------------------------------- |
| Cage          | Smoked titanium, `#2A2D34`, `roughness 0.34`                  | Brushed aluminium, `#C8CAD0`, `roughness 0.28`     |
| Glass         | Cold smoked glass, slight `#8FA8C8` tint, `transmission 0.94` | Clear optical glass, neutral, `transmission 0.98`  |
| Core emissive | `--prism-violet` → `--prism-cyan`                             | `--prism-violet` → `--prism-blue`, lower intensity |
| Dispersion    | Low — edges only                                              | Higher — visible spectral separation at bevels     |
| Environment   | Two violet and cyan lightformers, low ambient                 | Broad white studio lightformer, high ambient       |
| Bloom         | Subtle, threshold 0.85                                        | Off                                                |

Transition runs 700ms, easing `cubic-bezier(0.22, 1, 0.36, 1)`, on: environment intensity → material
color and roughness → emissive intensity. Values are interpolated per frame, not swapped.

## Motion

| Behaviour     | Specification                                                                          |
| ------------- | -------------------------------------------------------------------------------------- |
| Idle rotation | 0.6°/s on Y. Cage and glass counter-rotate at 0.35× to create parallax between layers. |
| Float         | ±6px vertical, 7s period                                                               |
| Core pulse    | Emissive intensity 0.55 → 1.0 → 0.55, 5s                                               |
| Data pulses   | Travel inner → outer, 2.4s per traversal, staggered                                    |
| Pointer       | Rotation Y ±4°, rotation X ±3°. Damped, `lerp` factor 0.06. Never a 1:1 mouse toy.     |

Pointer response is deliberately small. Large pointer-driven rotation reads as a demo, not as an
object with weight.

## Spatial relationship with typography

The Core is not a background image. It sits **between** the lines of the hero headline:

- line 1 renders in front of the object;
- line 2 renders behind it;
- line 3 renders in front again.

Implemented with a single canvas at a fixed z-index, and two HTML type layers on either side of it,
so no WebGL text and no per-glyph masking is required.

## Performance contract

| Constraint                | Value                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------ |
| Canvases                  | One persistent canvas for the Core. Case visuals reuse it or use 2D.                 |
| Desktop target            | 60fps                                                                                |
| Low-power / mobile target | ≥30fps                                                                               |
| DPR                       | mobile `[1, 1.25]`, desktop max `[1, 1.75]`                                          |
| Textures                  | None. All materials procedural.                                                      |
| Environment               | `drei` `<Environment>` built from `<Lightformer>` children — no external HDRI fetch. |
| Off-screen                | Canvas frameloop set to `demand` and paused via `IntersectionObserver`.              |
| Draw calls                | ≤ 24 for the full Core, pulses instanced.                                            |

## Degradation

| Profile          | Behaviour                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------ |
| `ULTRA` / `HIGH` | Full object, transmission glass, bloom, 24 pulses                                          |
| `BALANCED`       | Transmission `samples` reduced, bloom off, 12 pulses                                       |
| `LOW`            | Glass replaced by `MeshPhysicalMaterial` without transmission, 6 pulses, no dispersion     |
| `STATIC`         | Canvas never mounts. A designed static composition is rendered instead — not a blank area. |

`prefers-reduced-motion: reduce` forces `STATIC`. The static fallback is a real composition that
must be reviewed on its own; a missing object is a design failure, not an acceptable fallback.

## Case visuals

Each case chapter owns a visual that explains its specific engineering problem. Three of the four
are 2D — SVG or canvas — because they show topology and state, which 3D would obscure.

| Case                       | Visual                                                     | Interaction                                                                                   |
| -------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Money & entitlement        | Ledger flow: account → ledger → authorization → grant      | Hover sends a transaction through; a replayed transaction visibly does not double-apply       |
| Ranking / data honesty     | Data field, points repositioning between three projections | Switch basis: absolute → adjusted → category; unknown values stay visibly unknown             |
| Search / cache reliability | Topology: client → search → {cache, provider} → result     | Fail the provider; the route visibly reroutes to stale cache and the result is labelled stale |
| Image similarity           | 3D embedding space — reuses the Core canvas                | Query image; neighbours converge in vector space                                              |

Only the last one is 3D, and only because vector-space proximity is genuinely spatial.
