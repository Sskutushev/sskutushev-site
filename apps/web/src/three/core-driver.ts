/**
 * The two values the render loop reads each frame. Both are refs: updating them
 * never re-renders React and never contends with `useFrame` for the same
 * transform. See ADR-017.
 */
export interface CoreDriver {
  /** Hero scroll progress, 0 → 1, written by the pinned section. */
  progress: React.RefObject<number>;
  /** Pointer offset in normalised device coordinates, damped in the loop. */
  pointer: React.RefObject<{ x: number; y: number }>;
}
