# Reference Library

Record the principle borrowed — composition, material, transition, hierarchy — not the URL. Nothing
here is to be reproduced.

## Direction

| Source                         | What to study                                                        |
| ------------------------------ | -------------------------------------------------------------------- |
| Tesla                          | Product-scale hero composition; how few words a confident page needs |
| Microsoft Fluent 2             | Elevation as a system; where translucency is and is not appropriate  |
| Google Material 3 Expressive   | Hierarchy through scale, shape and motion instead of added colour    |
| Yandex Cloud                   | Dimensional technology imagery in a light, high-key environment      |
| Awwwards / SiteInspire / Godly | Editorial grid, asymmetry, scroll narrative                          |
| Typewolf                       | Real type pairings and how display type behaves at scale             |

## Type

- Fontshare, Google Fonts — variable families with genuine Cyrillic coverage.
- Onest and JetBrains Mono are the chosen pair; see [`TYPOGRAPHY.md`](TYPOGRAPHY.md). Adding a third
  family requires a written reason.

## 3D

- React Three Fiber and `drei` — the implementation stack.
- Poly Haven — HDRI and material reference for _look development only_. No HDRI is shipped; the
  environment is built from `<Lightformer>` primitives.
- Blender — used only if a primitive-built object proves insufficient. It has not, and a GLB would
  breach the bundle budget.
- Spline — prototyping only. Never shipped.

## Interaction

- Mobbin — navigation, overlay and mobile behaviour patterns.
- Lucide — the icon language. One set, no mixing.
- Motion — interface and scroll-linked motion.

## Not to be used

- Component libraries adopted wholesale (shadcn/ui, Aceternity, Magic UI, React Bits). Mechanics may
  be studied; markup and styling are not imported. Each brings its own visual language, and mixing
  those languages is what produces a template.
- Stock 3D models and sci-fi asset packs.
- Any CDN-hosted font, HDRI or texture. The site ships as a static bundle with no third-party
  runtime dependency.
