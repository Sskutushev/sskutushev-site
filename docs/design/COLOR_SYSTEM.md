# Color System — Titanium / Prism

## Principle

Neutral by default, chromatic by exception. Measured across a full viewport, 85–90% of pixels are
neutral. Chromatic color is reserved for:

- lighting and dispersion on the System Core;
- the primary CTA;
- focus and selection;
- the active item in a set;
- degraded, stale and failed system states.

Chromatic color is **not** used for section markers, body copy, decorative rules, tag lists, hover
underlines, or headline highlights. Those were the failure mode of the previous system.

## Token architecture

Three layers. Components consume only semantic tokens.

```
primitive  →  --prism-violet-500          raw value, never used directly in a component
semantic   →  --accent, --surface-2       role, theme-dependent
component  →  --nav-bg, --cta-fg          only when a component needs a value no role covers
```

## Neutral ramp

Dark is the primary expression. Light is a separate material, not an inversion: it is warm paper,
not white, and its surfaces get _lighter_ as they elevate while dark surfaces also get lighter —
elevation always means "closer to the light".

### Dark

| Token               | Value                   | Role                              |
| ------------------- | ----------------------- | --------------------------------- |
| `--bg`              | `#06070A`               | Page ground                       |
| `--surface-1`       | `#0D0F14`               | Raised section background         |
| `--surface-2`       | `#12151C`               | Panel, card, drawer               |
| `--surface-3`       | `#191D26`               | Hover / pressed surface           |
| `--text`            | `#F4F3EF`               | Primary text                      |
| `--text-secondary`  | `#A6A8B1`               | Secondary text, labels            |
| `--text-tertiary`   | `#6A6D77`               | Metadata, disabled                |
| `--hairline`        | `rgba(255,255,255,.10)` | Structural rules                  |
| `--hairline-strong` | `rgba(255,255,255,.18)` | Emphasised rules, control borders |

### Light

| Token               | Value              | Role                              |
| ------------------- | ------------------ | --------------------------------- |
| `--bg`              | `#F2F0EA`          | Page ground (warm paper)          |
| `--surface-1`       | `#F8F7F3`          | Raised section background         |
| `--surface-2`       | `#FFFFFF`          | Panel, card, drawer               |
| `--surface-3`       | `#FFFFFF` + shadow | Hover / pressed surface           |
| `--text`            | `#08090C`          | Primary text                      |
| `--text-secondary`  | `#5C5F69`          | Secondary text, labels            |
| `--text-tertiary`   | `#85888F`          | Metadata, disabled                |
| `--hairline`        | `rgba(8,9,12,.10)` | Structural rules                  |
| `--hairline-strong` | `rgba(8,9,12,.20)` | Emphasised rules, control borders |

## Prism ramp

The chromatic set is a spectrum, not a palette of unrelated hues. It runs violet → blue → cyan, and
it exists first as **light** on the 3D object; the UI borrows from it.

### Dark

| Token            | Value     |
| ---------------- | --------- |
| `--prism-violet` | `#7868FF` |
| `--prism-blue`   | `#38BDF8` |
| `--prism-cyan`   | `#5EE7F7` |
| `--critical`     | `#FF557E` |
| `--warning`      | `#F0A93B` |

### Light

| Token            | Value     |
| ---------------- | --------- |
| `--prism-violet` | `#6258FF` |
| `--prism-blue`   | `#168BFF` |
| `--prism-cyan`   | `#16BFD3` |
| `--critical`     | `#EB426E` |
| `--warning`      | `#B4700B` |

Light-theme values are darkened so that text and 1px strokes hold contrast on warm paper. They are
not the dark values reused.

## Semantic roles

| Token              | Dark             | Light            | Used for                             |
| ------------------ | ---------------- | ---------------- | ------------------------------------ |
| `--accent`         | `--prism-violet` | `--prism-violet` | Primary CTA, focus ring, active item |
| `--accent-fg`      | `#0A0A12`        | `#FFFFFF`        | Text on `--accent`                   |
| `--accent-quiet`   | `--prism-blue`   | `--prism-blue`   | Links, secondary emphasis            |
| `--state-ok`       | `--prism-cyan`   | `--prism-cyan`   | Healthy / live                       |
| `--state-degraded` | `--warning`      | `--warning`      | Stale, fallback, degraded            |
| `--state-failed`   | `--critical`     | `--critical`     | Fail-closed, error                   |

System states use the three-token set above and nothing else. `stale` is never rendered in the same
color as `ok` — the previous implementation blurred that distinction, and it is a claim about data
honesty the site makes explicitly.

## Contrast requirements

Enforced, not aspirational. CI runs axe against WCAG 2 AA.

| Pair                                | Minimum                                          |
| ----------------------------------- | ------------------------------------------------ |
| `--text` on `--bg` / `--surface-*`  | 7:1                                              |
| `--text-secondary` on `--bg`        | 4.5:1                                            |
| `--text-tertiary` on `--bg`         | 4.5:1 at ≥16px, 3:1 only for ≥24px or bold ≥19px |
| `--accent-fg` on `--accent`         | 4.5:1                                            |
| Focus ring against adjacent surface | 3:1                                              |

`--text-tertiary` is metadata-only and is never the sole carrier of information.

## Theme switching

A theme change is a change of material, not of CSS variables alone. Switching must drive, in order,
over 600–900ms:

1. document background and surfaces;
2. the 3D environment map and lightformer intensities;
3. System Core material parameters (see [`3D_CONCEPT.md`](3D_CONCEPT.md));
4. the remaining interface tokens.

Preference resolution: explicit `data-theme` on `<html>` wins; otherwise `prefers-color-scheme`.
The choice persists in `localStorage` and is applied before first paint to avoid a flash.

## Noise

A single 1.5% monochrome noise layer over the page ground, `pointer-events: none`. It exists to stop
large flat areas from banding. It is not a texture, and there is no second decorative overlay.
