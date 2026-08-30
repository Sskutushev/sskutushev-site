# Hero Storyboard

The hero is a pinned cinematic sequence, not a static screen that scrolls away. It is the single
highest-leverage surface on the site: if it is not excellent, no later section rescues it.

## Frame 0 — first paint (0% progress)

```
┌────────────────────────────────────────────────────────────────────────┐
│  SK/26                    Работы   Система   О себе          RU  ◐     │  floating nav
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   FULL-STACK / PRODUCT ENGINEER                              2026      │  mono, 12px
│                                                                        │
│   Проектирую                                                           │  ← in front
│                          ╭──────────────╮                              │
│   системы,               │  SYSTEM CORE │                              │  ← behind
│                          ╰──────────────╯                              │
│   которые выдерживают                                                  │  ← in front
│   продакшен.                                                           │
│                                                                        │
│   Backend-ориентированный инженер. 11 лет.                             │  lead, 22em
│                                                                        │
│   ● Доступен для senior+ backend работы          ↓ Исследовать систему │
└────────────────────────────────────────────────────────────────────────┘
```

- Viewport height `100svh`, pinned for a further 140vh of scroll.
- Object occupies roughly the middle third horizontally, offset right of centre.
- No grid overlay. Noise at 1.5%. Nothing else in the background.
- Entrance: display lines rise 24px and clear a mask over 900ms, 90ms apart. The Core fades from
  0 to full over 1400ms and settles into its idle rotation. This runs once, on load, and never again.

## Scroll sequence

Progress is the pinned section's scroll progress, 0 → 1.

| Range       | Camera                                              | Object                                                                                                                             | Type                                              | Purpose                                                        |
| ----------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------- |
| 0 → 0.25    | `z 6.0`, static                                     | Idle rotation                                                                                                                      | Display holds; lead and status fade out from 0.15 | Let the reader finish the sentence                             |
| 0.25 → 0.55 | `z 6.0 → 4.2`, `rotationX 0 → 18°`                  | Idle continues, pulses accelerate                                                                                                  | Display scales to 0.92 and fades to 0 by 0.45     | Approach — the object becomes the subject                      |
| 0.55 → 0.80 | `z 4.2 → 2.6`                                       | **Layers separate.** Cage → `y +1.6`, glass → `y 0`, core → `y −1.6`. Labels INFRASTRUCTURE / DATA / API fade in beside each layer | Layer labels only                                 | Reveal the structure — this is the argument the site is making |
| 0.80 → 1.0  | `z 2.6 → 0.4`, passing between the separated layers | Layers drift apart to clear the camera path                                                                                        | Manifesto heading fades up from within the scene  | The next section emerges from 3D space, it does not slide in   |

At progress 1 the pin releases and the manifesto is already in place. There is no cut.

## Reduced motion and static profile

The sequence does not run. The hero renders as Frame 0 with the static Core composition, and the
manifesto follows as a normal section. All content that the sequence would have revealed —
the three layer labels and their meaning — is present in the DOM as a plain list. Nothing is
reachable only through animation.

## Mobile (≤760px)

The pinned sequence is reduced to two beats rather than four, over 100vh of extra scroll:

1. 0 → 0.5 — display fades, camera pulls to `z 4.6`;
2. 0.5 → 1.0 — layers separate, labels appear.

The camera does not travel through the object on mobile: at that field of view the pass-through
reads as a glitch rather than as motion.

## Copy

Authored per locale, as data, with explicit line breaks.

**RU**

```
Проектирую
системы,
которые выдерживают
продакшен.
```

**EN**

```
I build
systems that
hold under
production load.
```

Lead, RU: `Backend-ориентированный fullstack-инженер. 11 лет в продукте — от денежных инвариантов
до наблюдаемого rollout.`

Lead, EN: `Backend-oriented fullstack engineer. 11 years in product — from money invariants to
observable rollout.`

## Rules

- One entrance animation, on first load only. Re-entering the hero by scrolling up does not replay it.
- The display type is never animated per character or per word. Per-line masking only.
- The Core is never the target of a pointer-following transform larger than ±4°.
- The scroll sequence drives a single motion source. GSAP and Motion do not both animate the same
  transform.
