# Art Direction — Computational Luxury

## Status

Active. Supersedes the previous `Signal / Material` direction (acid-lime on carbon, blueprint grid,
outline display type), which is retired and must not be reintroduced.

## The problem with the previous direction

`Signal / Material` failed for reasons that were structural, not cosmetic:

- Every viewport carried the same visual weight — one oversized black uppercase headline, a hairline
  grid, and monospaced metadata. Nothing was dominant, so nothing read as important.
- The acid-lime accent appeared in navigation, section markers, buttons, tags, hover states, footer
  and headlines simultaneously. An accent used everywhere is a background color.
- The WebGL layer was a flat point field with no silhouette. It contributed noise, not an object.
- Outline (`-webkit-text-stroke`) display type was used as the standard second line of every
  heading, which turned a device into a tic.
- Case studies rendered as table rows. A table communicates enumeration, not depth.

Cosmetic iteration on that system could not fix it. The direction is replaced.

## The direction

**Computational luxury.** The site should read as an object built by a studio, not a template filled
by a developer. Three commitments:

1. **One dominant subject per viewport.** A viewport shows a headline, or an object, or a case
   visual — not all three competing. Whitespace exists to create hierarchy, not to fill space.
2. **Material over decoration.** Depth comes from surfaces, light and reflection on a physically
   plausible object, not from gradients, glass panels or particle fields.
3. **Restraint in color.** 85–90% of every screen is neutral. Chromatic color appears only where it
   carries meaning: 3D lighting, active state, focus, CTA, and degraded/failed system states.

## Borrowed principles

Principles, not appearances. None of these sites is to be imitated.

| Source                       | Principle taken                                                                                                                           |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Tesla                        | One product-scale visual per viewport; short, declarative copy; minimal interface chrome.                                                 |
| Microsoft Fluent             | Layered surfaces with defined elevation; translucency reserved for transient surfaces; light and dark as two materials, not an inversion. |
| Google Material 3 Expressive | Hierarchy expressed through scale, shape and motion rather than through added color.                                                      |
| Yandex Cloud                 | Technology rendered as a dimensional object with real lighting instead of terminal iconography.                                           |

## The subject: System Core

The site is organised around a single recurring 3D object, the **System Core** — an abstract
industrial sculpture representing the three layers this engineer actually works on: **API**,
**DATA**, **INFRASTRUCTURE**.

It appears twice, and the site is bracketed by it:

- **Hero** — assembled, slowly rotating, sitting spatially between the lines of the headline.
- **Contact** — reassembled after having been taken apart across the page.

Full geometry, material and lighting specification: [`3D_CONCEPT.md`](3D_CONCEPT.md).

## Section structure

Seven parts. Not fifteen.

| #   | Section                  | Dominant element                                        |
| --- | ------------------------ | ------------------------------------------------------- |
| 00  | Hero                     | System Core, spatially interleaved with type            |
| 01  | Manifesto                | Type, with the Core separated into API / DATA / INFRA   |
| 02  | Selected systems         | Four case chapters, each with its own visual            |
| 03  | Interactive architecture | Resilience Explorer — a live topology, not a button row |
| 04  | Capabilities             | Backend / Data / Frontend / Infrastructure              |
| 05  | About                    | Portrait, philosophy, stack                             |
| 06  | Contact                  | System Core reassembled                                 |

Case studies are **chapters**, not rows. Each occupies 90–110vh and owns a visual that explains the
specific engineering problem it solves. A case without a visual is a case that has not been designed.

## Prohibited

These produce the exact failure being corrected and are not permitted:

- Green-on-black or any "developer terminal" palette.
- A visible grid overlay on more than one section.
- `-webkit-text-stroke` outline type as a recurring device.
- Uniform heavy uppercase display type in every section.
- Generic spheres, floating icons, gradient blobs, infinite particle fields, mouse-follower glows.
- Glassmorphism as a general surface treatment.
- Repeated rounded cards as a layout strategy.
- `fadeInUp` applied to every section; staggered reveal of every paragraph.
- Fake terminal UI, typewriter text, text scrambling.
- Dashboards showing invented numbers. Every displayed metric is measured or explicitly labelled as
  a simulation.

## Engineering mode

The runtime telemetry panel stays, as an easter egg bound to `~`, not as a primary surface. It is
evidence for a reviewer who goes looking, not a design element.

## Related documents

- [`COLOR_SYSTEM.md`](COLOR_SYSTEM.md)
- [`TYPOGRAPHY.md`](TYPOGRAPHY.md)
- [`3D_CONCEPT.md`](3D_CONCEPT.md)
- [`HERO_STORYBOARD.md`](HERO_STORYBOARD.md)
- [`MOTION.md`](MOTION.md)
- [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md)
