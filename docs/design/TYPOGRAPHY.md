# Typography

## Families

Two. Self-hosted as variable `woff2` via `@fontsource-variable`, so the site has no external font
dependency and no render-blocking third-party request.

| Role              | Family                       | Why                                                                                                                                  |
| ----------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Display and body  | **Onest Variable** (100–900) | Contemporary grotesk with a complete, properly drawn Cyrillic set. Variable weight lets one file cover 400 body through 750 display. |
| Metadata and code | **JetBrains Mono Variable**  | Technical register, Cyrillic support, legible at 11px.                                                                               |

`Arial`, the previous display face, is retired. System `-apple-system`/`Segoe UI` stacks are fallback
only.

Loading: `font-display: swap`, Latin + Cyrillic subsets preloaded for the two weights used above the
fold (400, 700). No other subsets are preloaded.

## The problem this replaces

The previous system had one register: heavy uppercase display at maximum size, everywhere. Contrast
must come from the interaction of size, weight, case and measure — not from making everything loud.

## Scale

| Role            | Size                              | Weight | Line height | Tracking          |
| --------------- | --------------------------------- | ------ | ----------- | ----------------- |
| Display (hero)  | `clamp(4.75rem, 10vw, 11.875rem)` | 720    | 0.86        | −0.055em          |
| H1 (section)    | `clamp(3.25rem, 6vw, 6.875rem)`   | 680    | 0.9         | −0.045em          |
| H2 (case title) | `clamp(3rem, 5vw, 6rem)`          | 650    | 0.92        | −0.04em           |
| H3              | `clamp(1.75rem, 2.4vw, 2.5rem)`   | 600    | 1.05        | −0.03em           |
| Lead            | `clamp(1.5rem, 2.2vw, 2.625rem)`  | 400    | 1.28        | −0.02em           |
| Body large      | `1.3125rem`                       | 400    | 1.5         | −0.012em          |
| Body            | `1.0625rem`                       | 400    | 1.55        | −0.01em           |
| Small           | `0.9375rem`                       | 400    | 1.5         | 0                 |
| Meta (mono)     | `0.6875rem`–`0.8125rem`           | 500    | 1.4         | 0.08em, uppercase |

The rhythm is the point: display is tight and heavy, body is open and light. A section that uses
only display sizes has not been laid out.

## Case

- Display and headings: **sentence case** by default. Uppercase is permitted for a single hero line
  and for mono metadata.
- Uppercase Cyrillic loses ascender/descender differentiation and becomes a slab of rectangles at
  display size. Russian headings are sentence case unless the line is four words or fewer.

## Measure

| Content | Max measure   |
| ------- | ------------- |
| Lead    | 22em          |
| Body    | 34em          |
| Meta    | no constraint |

Body text is never full-bleed across a 1920px viewport.

## Bilingual constraints

Every heading must be checked in both RU and EN at 375 / 768 / 1440 / 1920.

- Russian runs 15–25% longer than English at the same content. Display line breaks are authored per
  locale, not left to the browser.
- Manual breaks are expressed as data (an array of lines per locale), never as `<br>` hardcoded in a
  component shared between locales.
- `hyphens: none` on display type. Hyphenated display type is broken display type.

## Prohibited

- `-webkit-text-stroke` outline type as a recurring device. It may appear at most once on the page,
  and currently appears zero times.
- Three or more type families.
- Body copy in mono.
- Tracking below −0.02em on body text.
- Uppercase paragraphs.
- Text below 11px, in any role.
- Display type where the ascender of one line collides with the descender of the line above
  (`line-height` below 0.86 at the current family).
