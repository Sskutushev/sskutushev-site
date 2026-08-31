import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { dampFactor, type CoreAppearance } from './core-theme';

const FIN_COUNT = 24;
const RING_RADIUS = 1.34;
/** Second ring in the same plane. Two concentric rings read as a machined
    assembly; two crossed rings read as a gyroscope toy. */
const INNER_RING_RADIUS = 0.98;
/** Markers that make the middle ring's rotation visible. */
const NOTCH_COUNT = 10;

/**
 * INFRASTRUCTURE — a machined bezel in the horizontal plane: a titanium ring
 * with radial fins, plus a second ring tilted off-axis.
 *
 * A vertical cage was tried first and read as a birdcage at every size: eight
 * tall struts dominate the silhouette and hide the layers they surround. A flat
 * bezel keeps the outer layer legible while leaving the core visible.
 */
export function Bezel({ appearance }: { appearance: CoreAppearance }): React.JSX.Element {
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const fins = useRef<THREE.InstancedMesh>(null);
  /**
   * The one moving part. It turns inside its own plane, so its silhouette never
   * changes: tilted and turned about a different axis it passed through an
   * edge-on phase every few seconds and degenerated into a black bar across the
   * object. The notches are what make the rotation legible instead.
   */
  const middle = useRef<THREE.Group>(null);
  const middleTilt = useRef<THREE.Group>(null);
  const outer = useRef<THREE.Group>(null);
  const notches = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = fins.current;
    if (!mesh) return;
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3(1, 1, 1);
    for (let index = 0; index < FIN_COUNT; index += 1) {
      const angle = (index / FIN_COUNT) * Math.PI * 2;
      // Seated on the ring rather than beside it: fins placed on the exact
      // ring radius read as loose tabs orbiting the torus instead of as part
      // of the same machined part.
      position.set(
        Math.cos(angle) * (RING_RADIUS - 0.045),
        0,
        Math.sin(angle) * (RING_RADIUS - 0.045),
      );
      quaternion.setFromEuler(new THREE.Euler(0, -angle, 0));
      matrix.compose(position, quaternion, scale);
      mesh.setMatrixAt(index, matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;

    const ring = notches.current;
    if (!ring) return;
    for (let index = 0; index < NOTCH_COUNT; index += 1) {
      const angle = (index / NOTCH_COUNT) * Math.PI * 2;
      position.set(Math.cos(angle) * INNER_RING_RADIUS, Math.sin(angle) * INNER_RING_RADIUS, 0);
      quaternion.setFromEuler(new THREE.Euler(0, 0, angle));
      matrix.compose(position, quaternion, scale);
      ring.setMatrixAt(index, matrix);
    }
    ring.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(({ clock }, delta) => {
    const target = material.current;
    if (target) {
      const factor = dampFactor(4, delta);
      target.color.lerp(new THREE.Color(appearance.cageColor), factor);
      target.roughness += (appearance.cageRoughness - target.roughness) * factor;
    }

    // Each ring turns on its own axis and its own period. Both spin inside
    // their own plane, where the fins and the notches make the motion legible;
    // the tilts on top are oscillations rather than full turns, because a ring
    // carried all the way round a second axis passes through an edge-on phase
    // and collapses into a bar across the object.
    const time = clock.elapsedTime;
    if (outer.current) {
      outer.current.rotation.y -= delta * 0.11;
      outer.current.rotation.x = Math.sin(time * 0.06) * 0.12;
      outer.current.rotation.z = Math.cos(time * 0.045) * 0.08;
    }
    if (middle.current) middle.current.rotation.z += delta * 0.34;
    if (middleTilt.current) {
      middleTilt.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.13) * 0.26;
      middleTilt.current.rotation.y = Math.cos(time * 0.1) * 0.22;
    }
  });

  return (
    <group>
      <group ref={outer}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[RING_RADIUS, 0.075, 12, 128]} />
          <meshStandardMaterial
            ref={material}
            color={appearance.cageColor}
            metalness={1}
            roughness={appearance.cageRoughness}
          />
        </mesh>
        <instancedMesh args={[undefined, undefined, FIN_COUNT]} ref={fins}>
          <boxGeometry args={[0.2, 0.05, 0.14]} />
          <meshStandardMaterial
            color={appearance.cageColor}
            metalness={1}
            roughness={appearance.cageRoughness + 0.1}
          />
        </instancedMesh>
      </group>
      <group ref={middleTilt} rotation={[Math.PI / 2, 0, 0]}>
        <group ref={middle}>
          <mesh>
            <torusGeometry args={[INNER_RING_RADIUS, 0.03, 10, 128]} />
            <meshStandardMaterial
              color={appearance.cageColor}
              metalness={1}
              roughness={appearance.cageRoughness}
            />
          </mesh>
          <instancedMesh args={[undefined, undefined, NOTCH_COUNT]} ref={notches}>
            <boxGeometry args={[0.055, 0.1, 0.055]} />
            <meshStandardMaterial
              color={appearance.cageColor}
              metalness={1}
              roughness={appearance.cageRoughness + 0.12}
            />
          </instancedMesh>
        </group>
      </group>
    </group>
  );
}
