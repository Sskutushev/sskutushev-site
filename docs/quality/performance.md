# Performance contract

- Essential text and navigation render without WebGL.
- The Three.js chunk is lazy-loaded.
- Desktop uses one `THREE.Points` draw call for 230,000 procedural points.
- Narrow screens use 15,000 points and DPR is capped at 1.5.
- Reduced-motion users receive the complete DOM experience with no animated canvas.
- The production build fails when the initial application chunk exceeds 250 KB gzip or any lazy
  chunk exceeds 300 KB gzip.

Targets are budgets, not claims: LCP below 2.5s, CLS below 0.1, accessibility at least 95, and sustained desktop WebGL near 60 FPS. CI must measure them before the site displays them as achieved.

# Performance gates

The frontend build enforces compressed entry and lazy-chunk budgets. Lighthouse CI checks the
production preview. The backend integration workflow runs the k6 portfolio-read scenario against a
real migrated CockroachDB/Redis/MinIO stack and publishes `k6-summary.json`; p95 must remain below
500 ms, p99 below 1 s, and failed requests below 1%.
