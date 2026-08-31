import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { dampFactor, type CoreAppearance } from './core-theme';

const FIN_COUNT = 24;
const RING_RADIUS = 1.34;
/** Second ring in the same plane. Two concentric rings read as a machined
    assembly; two crossed rings read as a gyroscope toy. */
const INNER_RING_RADIUS = 0.98;

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
  /** A wider ring, barely off the bezel plane, turning slowly against it. A
      steeply crossed ring read as a bent hoop draped over the object. */
  const tilted = useRef<THREE.Mesh>(null);

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
  }, []);

  useFrame((_, delta) => {
    const target = material.current;
    if (target) {
      const factor = dampFactor(4, delta);
      target.color.lerp(new THREE.Color(appearance.cageColor), factor);
      target.roughness += (appearance.cageRoughness - target.roughness) * factor;
    }
    if (tilted.current) tilted.current.rotation.y += delta * 0.08;
  });

  return (
    <group>
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
      <mesh ref={tilted} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[INNER_RING_RADIUS, 0.03, 10, 128]} />
        <meshStandardMaterial
          color={appearance.cageColor}
          metalness={1}
          roughness={appearance.cageRoughness}
        />
      </mesh>
    </group>
  );
}
