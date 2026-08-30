import { MeshTransmissionMaterial, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { RenderQuality } from '../lib/render-quality';
import type { Theme } from '../theme/theme';
import { Bezel } from './Bezel';
import { Halo } from './Halo';

/** Keeps the bezel reading as an ellipse rather than a bar across the type. */
const BASE_TILT_X = -0.32;
import { pulseCount, type CoreDriver } from './core-driver';
import {
  coreAppearance,
  dampFactor,
  heroTravel,
  layerSeparation,
  type CoreAppearance,
} from './core-theme';

/** DATA — a bevelled shell of optical glass, rotated off-axis from the cage. */
function GlassShell({
  appearance,
  quality,
}: {
  appearance: CoreAppearance;
  quality: RenderQuality;
}): React.JSX.Element {
  // Real refraction re-renders the scene into a buffer every frame; it earns
  // its cost only on the top profile.
  const refractive = quality === 'ULTRA';
  return (
    <RoundedBox
      args={[1.18, 1.18, 1.18]}
      radius={0.16}
      smoothness={4}
      rotation={[0, Math.PI / 4, 0]}
    >
      {refractive ? (
        <MeshTransmissionMaterial
          samples={2}
          resolution={128}
          transmission={appearance.glassTransmission}
          roughness={appearance.glassRoughness}
          thickness={0.6}
          ior={1.46}
          chromaticAberration={appearance.dispersion}
          anisotropy={0.25}
          iridescence={0.7}
          iridescenceIOR={1.28}
          color={appearance.glassColor}
        />
      ) : (
        <meshPhysicalMaterial
          color={appearance.glassColor}
          metalness={0}
          roughness={appearance.glassRoughness + 0.08}
          transparent
          opacity={0.34}
          clearcoat={1}
          clearcoatRoughness={0.08}
          ior={1.46}
        />
      )}
    </RoundedBox>
  );
}

/** API — the emissive centre, its counter-rotating ring and its glow. */
function ApiCore({ appearance }: { appearance: CoreAppearance }): React.JSX.Element {
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const ring = useRef<THREE.Mesh>(null);
  const breathe = useRef(1);

  useFrame(({ clock }, delta) => {
    // 5s breathing pulse, shared with the halo so both move together.
    breathe.current = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin((clock.elapsedTime * Math.PI * 2) / 5));
    if (material.current) {
      material.current.emissive.lerp(
        new THREE.Color(appearance.emissiveColor),
        dampFactor(4, delta),
      );
      const target = appearance.emissiveIntensity * breathe.current;
      material.current.emissiveIntensity +=
        (target - material.current.emissiveIntensity) * dampFactor(8, delta);
    }
    if (ring.current) ring.current.rotation.z -= delta * 0.9;
  });

  return (
    <group>
      <Halo breathe={breathe} color={appearance.emissiveColor} opacity={appearance.haloOpacity} />
      <mesh>
        <icosahedronGeometry args={[0.34, 0]} />
        <meshStandardMaterial
          ref={material}
          color="#0c0d14"
          metalness={0.4}
          roughness={0.35}
          emissive={appearance.emissiveColor}
          emissiveIntensity={appearance.emissiveIntensity}
        />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[0.66, 0.012, 6, 72]} />
        <meshStandardMaterial color={appearance.emissiveColor} metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

/** Data pulses travelling from the core outward through the cage. */
function Pulses({
  appearance,
  count,
  driver,
}: {
  appearance: CoreAppearance;
  count: number;
  driver: CoreDriver;
}): React.JSX.Element {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const paths = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        angle: (index / count) * Math.PI * 2,
        tilt: ((index % 5) - 2) * 0.28,
        offset: index / count,
      })),
    [count],
  );

  useFrame(({ clock }) => {
    const target = mesh.current;
    if (!target) return;
    // Pulses accelerate as the hero camera approaches the object.
    const speed = 1 + driver.progress.current * 1.6;
    const matrix = new THREE.Matrix4();
    for (const [index, path] of paths.entries()) {
      const t = ((clock.elapsedTime * speed) / 2.4 + path.offset) % 1;
      const radius = 0.45 + t * 0.72;
      matrix.makeTranslation(
        Math.cos(path.angle) * radius,
        Math.sin(path.tilt) * radius,
        Math.sin(path.angle) * radius,
      );
      matrix.scale(new THREE.Vector3(1, 1, 1).multiplyScalar(1 - Math.abs(t - 0.5) * 0.8));
      target.setMatrixAt(index, matrix);
    }
    target.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh args={[undefined, undefined, count]} ref={mesh}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial
        color={appearance.emissiveColor}
        emissive={appearance.emissiveColor}
        emissiveIntensity={appearance.emissiveIntensity * 0.7}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

export { type CoreDriver };

export function SystemCore({
  theme,
  quality,
  driver,
  canTravelThrough,
}: {
  theme: Theme;
  quality: RenderQuality;
  driver: CoreDriver;
  canTravelThrough: boolean;
}): React.JSX.Element {
  const root = useRef<THREE.Group>(null);
  const cage = useRef<THREE.Group>(null);
  const glass = useRef<THREE.Group>(null);
  const core = useRef<THREE.Group>(null);
  const appearance = coreAppearance(theme);

  useFrame(({ clock }, delta) => {
    const group = root.current;
    if (!group) return;
    const progress = driver.progress.current;
    const pointer = driver.pointer.current;

    // Idle rotation of 0.6°/s, plus a deliberately small pointer response.
    // A larger one reads as a toy rather than as an object with weight.
    group.rotation.y += delta * 0.0105;
    const factor = dampFactor(3, delta);
    const approachTilt = Math.min(Math.max((progress - 0.25) / 0.3, 0), 1) * 0.314;
    group.rotation.x +=
      (BASE_TILT_X - approachTilt + pointer.y * 0.052 - group.rotation.x) * factor;
    group.position.y +=
      (Math.sin((clock.elapsedTime * Math.PI * 2) / 7) * 0.06 - group.position.y) * factor;
    group.position.x += (pointer.x * 0.07 - group.position.x) * factor;

    // Counter-rotation gives the layers visible parallax against each other.
    if (cage.current) cage.current.rotation.y -= delta * 0.0037;
    if (core.current) core.current.rotation.y += delta * 0.012;

    const separation = layerSeparation(progress);
    const travel = heroTravel(progress, canTravelThrough);
    const spread = separation * 1.35 + travel * 1.9;
    if (cage.current) cage.current.position.y = spread;
    if (glass.current) glass.current.scale.setScalar(1 - separation * 0.1);
    if (core.current) core.current.position.y = -spread;
    group.scale.setScalar(0.92 * (1 + travel * 2.4));
  });

  return (
    <group ref={root} rotation={[BASE_TILT_X, 0, 0.16]} scale={0.92}>
      <pointLight
        color={appearance.emissiveColor}
        intensity={appearance.violetIntensity * 6}
        position={[-2.6, 1.4, 1.8]}
      />
      <pointLight
        color="#5ee7f7"
        intensity={appearance.cyanIntensity * 5}
        position={[2.8, -1, 1.4]}
      />
      <group ref={cage}>
        <Bezel appearance={appearance} />
      </group>
      <group ref={glass}>
        <GlassShell appearance={appearance} quality={quality} />
      </group>
      <group ref={core}>
        <ApiCore appearance={appearance} />
      </group>
      <Pulses appearance={appearance} count={pulseCount(quality)} driver={driver} />
    </group>
  );
}
