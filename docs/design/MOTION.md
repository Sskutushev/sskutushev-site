# Motion System

## Registers

Four, each with a defined owner. Mixing registers is what makes a site feel cheap.

| Register  | Duration   | Easing                      | Used for                                         | Implemented with         |
| --------- | ---------- | --------------------------- | ------------------------------------------------ | ------------------------ |
| Micro     | 120–220ms  | `cubic-bezier(.4,0,.2,1)`   | Hover, press, icon state, focus ring             | CSS transition           |
| Interface | 250–450ms  | `cubic-bezier(.22,1,.36,1)` | Drawer, theme change, locale change, tab switch  | Motion                   |
| Editorial | 500–900ms  | `cubic-bezier(.16,1,.3,1)`  | Section reveal, case chapter entrance, type mask | Motion                   |
| Cinematic | 900–1800ms | linear, scrubbed by scroll  | Hero sequence, Core layer separation             | Motion `useScroll` → R3F |

## Ownership

One transform has exactly one animator.

- **CSS** owns hover, focus and simple state colour changes.
- **Motion** owns component entrance, layout, drawer, and the scroll progress value.
- **R3F `useFrame`** owns everything inside the canvas. It reads scroll progress from a ref; Motion
  never writes to a Three.js object.
- **GSAP is not used.** The pinned hero is a `position: sticky` container plus Motion's
  `useScroll({ offset })`. Adding ScrollTrigger would cost ~50KB gzip against a 250KB entry budget
  to duplicate capability already present. Recorded in ADR 016.

## Reveal policy

Section reveal is deliberately sparse. A page where everything animates in has no hierarchy.

| Element         | Reveal                                |
| --------------- | ------------------------------------- |
| Section heading | Line mask, 700ms, once                |
| Case chapter    | Title mask + visual fade, 800ms, once |
| Body paragraph  | **None**                              |
| List item       | **None**                              |
| Metadata row    | **None**                              |
| Case visual     | Activates on entry, pauses on exit    |

Staggering is permitted only within a heading's own lines, at 90ms.

## Prohibited

Directly responsible for the previous implementation reading as generic:

- `fadeInUp` on every section.
- Staggered reveal of every paragraph and list item.
- Infinite particle fields.
- Mouse-follower blobs or cursor glows.
- Parallax applied to more than one element per viewport.
- Text scramble, typewriter, per-character animation.
- Marquee tickers.
- Animation that runs while off-screen.

## Reduced motion

`prefers-reduced-motion: reduce` is a first-class layout, not a switch that disables things:

- The cinematic register does not run; the hero is its static composition.
- Editorial reveals resolve instantly to their final state.
- Micro and interface transitions reduce to ≤100ms opacity changes.
- The WebGL canvas does not mount.
- Every piece of content revealed by motion is present and reachable without it.

## Performance

- Animate `transform` and `opacity` only. Never `width`, `height`, `top`, `left`, `filter` or
  `box-shadow` in a running animation.
- `will-change` is applied for the duration of an animation and removed after, never left standing.
- Scroll listeners are passive; scroll-linked work happens in `useFrame` or a Motion spring, not in
  the scroll handler.
- Off-screen canvases set `frameloop="never"`.
