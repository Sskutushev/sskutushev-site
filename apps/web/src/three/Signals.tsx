import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { CoreDriver } from './core-driver';
import type { CoreAppearance } from './core-theme';
import { SIGNAL_ICONS } from './signal-icons';
import { MARK_SCALE, markDepthOpacity, markTexture } from './signal-marks';

/** Seconds for one turn of the orbit. */
const PERIOD = 26;
/**
 * Between the shell and the bezel, and lifted out of the bezel plane, so a mark
 * is never behind the metal and never outside the canvas — which is what the
 * previous model, where marks travelled outward and left, could not avoid.
 */
const RADIUS = 1.16;
const LIFT = 0.34;
/**
 * Where the marks sit once the hero sequence starts: just proud of the shell,
 * so they ride its surface instead of orbiting past it. The shell is a 1.18
 * cube, half an edge is 0.59, and a bevelled corner reaches a little further.
 */
const SHELL_RADIUS = 0.76;
const SHELL_LIFT = 0.12;

/**
 * The stack orbiting the core, as marks inside small discs.
 *
 * They used to fly out of the core and fade, which meant two or three were ever
 * on screen and the ones that reached the edge of the canvas were cut in half
 * rather than leaving. All of them are present now, turning slowly enough to be
 * read one at a time.
 */
export function Signals({
  appearance,
  count,
  driver,
}: {
  appearance: CoreAppearance;
  count: number;
  driver: CoreDriver;
}): React.JSX.Element {
  const group = useRef<THREE.Group>(null);
  const turned = useRef(0);

  const marks = useMemo(
    () =>
      SIGNAL_ICONS.slice(0, count).map((icon, index) => ({
        slug: icon.slug,
        texture: markTexture(icon.path, appearance.mark),
        angle: (index / count) * Math.PI * 2,
        // Alternating above and below the bezel plane: on one ring they would
        // occlude each other every time two crossed.
        lift: (index % 2 === 0 ? 1 : -1) * LIFT * (0.7 + ((index % 4) / 4) * 0.6),
      })),
    [appearance.mark, count],
  );

  useEffect(
    () => () => {
      for (const mark of marks) mark.texture.dispose();
    },
    [marks],
  );

  useFrame(({ camera, size, clock }, delta) => {
    const node = group.current;
    if (!node) return;
    // The orbital plane itself precesses on two axes, on periods that do not
    // divide into each other, so the path never repeats and the marks are seen
    // from a different angle each time round. Sprites always face the camera,
    // so tilting the plane cannot degenerate the way a ring seen edge-on does.
    const time = clock.elapsedTime;
    node.rotation.x = Math.sin(time * 0.11) * 0.34;
    node.rotation.z = Math.cos(time * 0.07) * 0.22;
    // Scrolling draws the orbit down onto the shell: by a fifth of the way in
    // the marks are riding its surface and turning with it, which is what the
    // camera is moving in to look at.
    const progress = driver.progress.current;
    const settle = Math.min(1, progress / 0.2);
    const eased = settle * settle * (3 - 2 * settle);
    const wanted = RADIUS + (SHELL_RADIUS - RADIUS) * eased;

    // Clamped to what the canvas can actually show. The camera moves through
    // the sequence and the object scales with it, so any radius chosen by hand
    // is right at one moment and cropped at the next; this asks the frustum
    // instead. A mark is never cut by the edge of its own container.
    const perspective = camera as THREE.PerspectiveCamera;
    const halfHeight = Math.tan(THREE.MathUtils.degToRad(perspective.fov / 2)) * camera.position.z;
    const halfWidth = halfHeight * (size.width / size.height);
    const scale = node.parent?.scale.x ?? 1;
    const margin = MARK_SCALE[0] / 2 + 0.06;
    const limit = Math.max(0.3, Math.min(halfWidth, halfHeight) / Math.max(scale, 0.001) - margin);
    const radius = Math.min(wanted, limit);
    const liftFactor = 1 + (SHELL_LIFT / LIFT - 1) * eased;
    // Faster once they are on the shell, so the surface is visibly turning
    // rather than the marks hanging still against it.
    const rate = 1 + eased * 2.6;
    // Accumulated rather than derived from elapsed time: multiplying the whole
    // elapsed time by a rate that changes makes the angle jump the moment the
    // page starts moving.
    turned.current += ((delta / PERIOD) * Math.PI * 2 * rate) % (Math.PI * 2);
    const turn = turned.current;
    node.children.forEach((child, index) => {
      const mark = marks[index];
      if (!mark) return;
      const angle = mark.angle + turn;
      child.position.set(
        Math.cos(angle) * radius,
        mark.lift * liftFactor,
        Math.sin(angle) * radius,
      );
      // Dimmer on the far side, so the orbit reads as depth rather than as a
      // flat ring of stickers.
      (child as THREE.Sprite).material.opacity =
        markDepthOpacity(Math.sin(angle)) * appearance.markOpacity;
    });
  });

  return (
    <group ref={group}>
      {marks.map((mark) => (
        <sprite key={mark.slug} scale={MARK_SCALE}>
          <spriteMaterial
            depthWrite={false}
            map={mark.texture}
            opacity={0}
            transparent
            toneMapped={false}
          />
        </sprite>
      ))}
    </group>
  );
}
