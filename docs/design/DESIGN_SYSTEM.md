# Design System

Implementation contract for [`ART_DIRECTION.md`](ART_DIRECTION.md). Components consume tokens; they
do not declare raw values.

## Grid

| Viewport    | Columns | Gutter    | Max content |
| ----------- | ------- | --------- | ----------- |
| ≥1440px     | 12      | `4.5rem`  | 1560px      |
| 1024–1439px | 12      | `3rem`    | fluid       |
| 768–1023px  | 8       | `2rem`    | fluid       |
| ≤767px      | 4       | `1.25rem` | fluid       |

Token: `--gutter: clamp(1.25rem, 4vw, 4.5rem)`.

The grid is a layout tool. It is **not drawn**. The previous implementation painted column rules on
`body` across the whole page; that is removed.

Sections are asymmetric by default. A centred section must justify itself — currently only the
contact closing is centred.

## Spacing

A 4px base, exposed as steps. Arbitrary pixel values in components are a review failure.

| Token    | Value                        | Typical use              |
| -------- | ---------------------------- | ------------------------ |
| `--s-1`  | 4px                          | Icon-to-label            |
| `--s-2`  | 8px                          | Inline gap               |
| `--s-3`  | 12px                         | Control padding          |
| `--s-4`  | 16px                         | Compact block gap        |
| `--s-5`  | 24px                         | Block gap                |
| `--s-6`  | 32px                         | Group gap                |
| `--s-7`  | 48px                         | Sub-section gap          |
| `--s-8`  | 72px                         | Section internal gap     |
| `--s-9`  | 112px                        | Section gap              |
| `--s-10` | `clamp(7rem, 12vw, 13.5rem)` | Section vertical padding |

## Elevation

Four levels. Elevation is expressed by surface token plus, in light theme only, a shadow. Dark theme
uses surface lightness alone — shadows on near-black are invisible and only cost paint time.

| Level | Surface       | Light-theme shadow                                           |
| ----- | ------------- | ------------------------------------------------------------ |
| 0     | `--bg`        | none                                                         |
| 1     | `--surface-1` | none                                                         |
| 2     | `--surface-2` | `0 1px 2px rgb(8 9 12 / .04), 0 8px 24px rgb(8 9 12 / .06)`  |
| 3     | `--surface-3` | `0 2px 4px rgb(8 9 12 / .06), 0 20px 48px rgb(8 9 12 / .10)` |

## Radius

| Token      | Value | Use                                    |
| ---------- | ----- | -------------------------------------- |
| `--r-sm`   | 6px   | Controls, chips                        |
| `--r-md`   | 12px  | Panels, inputs                         |
| `--r-lg`   | 20px  | Substantial interactive surfaces       |
| `--r-full` | 999px | Status pills and the theme toggle only |

Radius is not applied uniformly. Full-bleed sections, case chapters and hairline-separated rows have
square corners.

## Translucency

Permitted on exactly two surfaces, per Fluent's rule that translucent material marks transient
context:

1. the floating navigation;
2. the engineering drawer.

Specification: `background: color-mix(in oklab, var(--surface-2) 62%, transparent)`,
`backdrop-filter: blur(18px) saturate(130%)`, `border: 1px solid var(--hairline)`. Any other
element uses an opaque surface.

## Icons

**Lucide**, one language, no mixing. `stroke-width: 1.5`, `currentColor`, sized on a 4px step
(16 / 20 / 24). Imported per-icon so the bundle carries only what is used.

An icon accompanies a label or has an `aria-label`. Decorative icons carry `aria-hidden`. Icon-only
buttons are ≥44×44px hit area.

The previous implementation had three hand-drawn inline SVGs and no icon language; that is replaced.

## Focus

```css
outline: 2px solid var(--accent);
outline-offset: 3px;
border-radius: inherit;
```

Applied through `:focus-visible`. Focus is never removed, and never relies on colour alone against a
similarly-toned surface — the offset guarantees a visible boundary.

## Components

| Component       | Surface                                 | Radius     | Notes                                    |
| --------------- | --------------------------------------- | ---------- | ---------------------------------------- |
| Nav             | translucent                             | `--r-full` | Floating, `top: 20px`, inset from gutter |
| Primary CTA     | `--accent`                              | `--r-sm`   | One per viewport                         |
| Secondary CTA   | transparent, `--hairline-strong` border | `--r-sm`   |                                          |
| Case chapter    | `--bg`, separated by `--hairline`       | 0          | 90–110vh                                 |
| Capability card | `--surface-1`                           | `--r-md`   | Icon, title, one sentence, stack row     |
| Explorer node   | `--surface-2`                           | `--r-md`   | State colour on border, never on fill    |
| Drawer          | translucent                             | 0          | Own scroll container, see below          |
| Status pill     | `--surface-2`                           | `--r-full` | Dot + mono label                         |

## Scroll containment

Smooth scrolling is applied to the document only, and is disabled while any overlay with its own
scroll container is open. The previous implementation attached Lenis to `window` unconditionally,
which swallowed wheel events inside the engineering drawer and made its lower half unreachable.

Any element with `overflow: auto` must be verified by wheel, touch, and keyboard.

## Data-state rendering

The site's stated position is that unknown must not become zero. That has a UI contract:

| State     | Rendering                                                                      |
| --------- | ------------------------------------------------------------------------------ |
| Live      | `--state-ok` dot, no qualifier                                                 |
| Stale     | `--state-degraded` dot, plus age: `обновлено 18 минут назад`                   |
| Failed    | `--state-failed` dot, plus what is unavailable and what is being shown instead |
| Simulated | Explicit `СИМУЛЯЦИЯ` label adjacent to the value                               |

No metric is displayed without one of these four states resolved. An empty panel is never shipped —
if there is no data, the empty state says which source is unavailable.

## Responsive checkpoints

375 / 768 / 1024 / 1440 / 1920, in both themes, in RU and EN, with and without reduced motion.
