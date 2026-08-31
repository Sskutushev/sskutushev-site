# ADR-018: the hero sequence runs without an animation runtime

Status: accepted. Supersedes the library choice in ADR-017; its ownership rule stands unchanged.

ADR-017 chose Motion over GSAP for the pinned hero because Motion was already a dependency and a
second scheduler was not worth its runtime. Measurement showed the first premise had stopped being
true: Motion was reached for by exactly one file, the hero, and only for four opacity ramps, one
scale, and a scroll progress value. It weighed 44KB gzip — over a quarter of the entry chunk, in
front of the paint it was animating.

The sequence is now a `scroll` listener collapsed onto an animation frame, publishing progress as
custom properties on the pinned element, which the stylesheet reads. The beats stay where they were,
as the pure functions of progress in `hero-sequence.ts`, and stay unit-tested. Two things improve
beyond the weight: the hero is complete at its opening values before any script runs, because those
values are declared in CSS; and the entrance is a keyframe animation, so it is the compositor's
work rather than React's.

The ownership rule from ADR-017 is unchanged and is now easier to hold. CSS owns hover, press, focus
and the hero sequence. React Three Fiber's `useFrame` owns everything inside the canvas and reads
scroll progress through a ref. Nothing else writes to a transform.

An animation runtime returns the moment a section needs orchestration that ramps and keyframes
cannot express — sequenced layout transitions, shared-element movement, gesture-driven springs.
Reintroducing one for a handful of opacities would not be.
