/**
 * The System Core as line-work, for every visit that never mounts the canvas:
 * reduced motion, a software renderer, and the window between first paint and
 * the deferred mount.
 *
 * It is a drawing of the same object rather than an abstraction of it — same
 * bezel, same fin count, same bevelled shell, same core — so the two do not
 * read as two different pages. The previous fallback was a pair of blurred
 * radial gradients, which is the gradient blob the direction rules out.
 */
const FIN_COUNT = 24;
const RING_RX = 190;
const RING_RY = 74;

/** Fin positions on the bezel ellipse, drawn as short radial ticks. */
function fins(): { x1: number; y1: number; x2: number; y2: number }[] {
  return Array.from({ length: FIN_COUNT }, (_, index) => {
    const angle = (index / FIN_COUNT) * Math.PI * 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x1: 240 + cos * (RING_RX - 13),
      y1: 240 + sin * (RING_RY - 5),
      x2: 240 + cos * (RING_RX + 5),
      y2: 240 + sin * (RING_RY + 2),
    };
  });
}

export function CoreStill(): React.JSX.Element {
  return (
    <svg aria-hidden className="core-still" viewBox="0 0 480 480">
      <defs>
        <radialGradient id="core-still-glow">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="240" cy="240" fill="url(#core-still-glow)" r="118" />

      {/* DATA — the bevelled shell, drawn as the silhouette the camera sees. */}
      <path
        className="core-still__shell"
        d="M240 132 L322 180 L322 300 L240 348 L158 300 L158 180 Z"
      />

      {/* INFRASTRUCTURE — bezel and inner ring, in the same plane. */}
      <ellipse className="core-still__ring" cx="240" cy="240" rx={RING_RX} ry={RING_RY} />
      <ellipse className="core-still__ring" cx="240" cy="240" rx="140" ry="54" />
      <g className="core-still__fins">
        {fins().map((fin) => (
          <line key={`${fin.x1}-${fin.y1}`} x1={fin.x1} x2={fin.x2} y1={fin.y1} y2={fin.y2} />
        ))}
      </g>

      {/* API — the emissive centre. */}
      <path
        className="core-still__core"
        d="M240 210 L268 226 L268 254 L240 270 L212 254 L212 226 Z"
      />
    </svg>
  );
}
