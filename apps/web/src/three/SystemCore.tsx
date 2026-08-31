import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import type { RenderQuality } from '../lib/render-quality';
import type { Theme } from '../theme/theme';
import { Bezel } from './Bezel';
import { Halo } from './Halo';
import { Signals } from './Signals';
import { signalCount } from './signal-marks';

/** Keeps the bezel reading as an ellipse rather than a bar across the type. */
const BASE_TILT_X = -0.32;
import type { CoreDriver } from './core-driver';
import {
  coreAppearance,
  dampFactor,
  heroTravel,
  layerSeparation,
  type CoreAppearance,
} from './core-theme';

/**
 * DATA — a bevelled shell of polished glass.
 *
 * Screen-space transmission was tried first and abandoned. It resolves the
 * shell from a low-resolution buffer of everything behind it, so the emissive
 * core smeared across the whole volume and the object read as a solid violet
 * lump with banding at its edges — the opposite of the neutral, machined
 * result the direction calls for. A reflective shell with a clearcoat keeps
 * the interior open, costs no extra render target, and holds its highlights.
 */
function GlassShell({
  appearance,
  quality,
}: {
  appearance: CoreAppearance;
  quality: RenderQuality;
}): React.JSX.Element {
  const material = useRef<THREE.MeshPhysicalMaterial>(null);

  useFrame((_, delta) => {
    const target = material.current;
    if (!target) return;
    const factor = dampFactor(4, delta);
    target.color.lerp(new THREE.Color(appearance.glassColor), factor);
    target.roughness += (appearance.glassRoughness - target.roughness) * factor;
  });

  return (
    <RoundedBox
      args={[1.18, 1.18, 1.18]}
      radius={0.16}
      smoothness={4}
      rotation={[0, Math.PI / 4, 0]}
    >
      <meshPhysicalMaterial
        ref={material}
        color={appearance.glassColor}
        metalness={0}
        roughness={appearance.glassRoughness}
        transparent
        opacity={appearance.glassOpacity}
        clearcoat={1}
        clearcoatRoughness={0.04}
        // Spectral separation lives on the bevels and nowhere else: it is the
        // only place the prism ramp is allowed onto a neutral surface.
        iridescence={quality === 'ULTRA' ? appearance.dispersion : 0}
        iridescenceIOR={1.3}
        ior={1.46}
        depthWrite={false}
      />
    </RoundedBox>
  );
}

/**
 * API — the emissive centre and its counter-rotating ring.
 *
 * The glow is deliberately not a child of this group. A large additive quad
 * sitting inside the transmissive shell was refracted by it and read as a
 * solid block of colour filling the whole cube; the halo now sits behind the
 * object, where it behaves as light around it.
 */
function ApiCore({
  appearance,
  breathe,
}: {
  appearance: CoreAppearance;
  /** Shared 5s pulse, so the core and the halo behind it move together. */
  breathe: React.RefObject<number>;
}): React.JSX.Element {
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const ring = useRef<THREE.Mesh>(null);

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
  });

  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          ref={material}
          color="#0c0d14"
          metalness={0.4}
          roughness={0.35}
          emissive={appearance.emissiveColor}
          emissiveIntensity={appearance.emissiveIntensity}
        />
      </mesh>
      {/* Near the bezel plane: standing almost upright it read as a wire
          hoop across the object rather than as part of the core. */}
      <mesh ref={ring} rotation={[Math.PI / 2 - 0.12, 0, 0]}>
        <torusGeometry args={[0.66, 0.012, 6, 72]} />
        <meshStandardMaterial color={appearance.emissiveColor} metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
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
  const breathe = useRef(1);
  const appearance = coreAppearance(theme);

  useFrame(({ clock }, delta) => {
    const group = root.current;
    if (!group) return;
    const progress = driver.progress.current;
    const pointer = driver.pointer.current;

    // The object does not spin. One moving part among still ones reads as a
    // mechanism; everything turning at once reads as a screensaver, which is
    // what it was doing — root, bezel, core and inner ring all at different
    // rates. The middle ring is the only thing that turns now.
    const factor = dampFactor(3, delta);
    const approachTilt = Math.min(Math.max((progress - 0.25) / 0.3, 0), 1) * 0.314;
    group.rotation.x +=
      (BASE_TILT_X - approachTilt + pointer.y * 0.052 - group.rotation.x) * factor;
    group.position.y +=
      (Math.sin((clock.elapsedTime * Math.PI * 2) / 7) * 0.06 - group.position.y) * factor;
    group.position.x += (pointer.x * 0.07 - group.position.x) * factor;

    // The core's own ring keeps a slow tilt of its own, on a third period, so
    // the assembly reads as several things moving independently rather than as
    // one rigid body.
    if (core.current) core.current.rotation.z = Math.sin(clock.elapsedTime * 0.09) * 0.2;

    const separation = layerSeparation(progress);
    const travel = heroTravel(progress, canTravelThrough);
    const spread = separation * 1.35 + travel * 1.9;
    if (cage.current) cage.current.position.y = spread;
    if (glass.current) glass.current.scale.setScalar(1 - separation * 0.1);
    if (core.current) core.current.position.y = -spread;
    group.scale.setScalar(0.84 * (1 + travel * 2.4));
  });

  return (
    <group ref={root} rotation={[BASE_TILT_X, 0, 0.16]} scale={0.84}>
      {/* Two rim lights, deliberately weak. The prism ramp is allowed to touch
          the edges of the metal and nothing else: the object has to read as
          titanium under coloured light, not as a coloured object. Earlier
          values were six times higher and turned the whole sculpture violet,
          which broke the 85-90% neutral rule the direction is built on. */}
      <pointLight
        color={appearance.emissiveColor}
        distance={7}
        intensity={appearance.violetIntensity * 3}
        position={[-2.6, 1.4, 1.8]}
      />
      <pointLight
        color="#5ee7f7"
        distance={7}
        intensity={appearance.cyanIntensity * 2.4}
        position={[2.8, -1, 1.4]}
      />
      {/* Neutral key. Without it the fins have no shading of their own and the
          bezel reads as flat plastic. */}
      <directionalLight intensity={appearance.keyIntensity * 0.5} position={[1.6, 3.2, 2.4]} />
      <group position={[0, 0, -1.6]} scale={0.55}>
        <Halo breathe={breathe} color={appearance.emissiveColor} opacity={appearance.haloOpacity} />
      </group>
      <group ref={cage}>
        <Bezel appearance={appearance} />
      </group>
      <group ref={glass}>
        <GlassShell appearance={appearance} quality={quality} />
      </group>
      <group ref={core}>
        <ApiCore appearance={appearance} breathe={breathe} />
      </group>
      <Signals appearance={appearance} count={signalCount(quality)} driver={driver} />
    </group>
  );
}
