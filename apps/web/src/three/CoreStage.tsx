import { Environment, Lightformer } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import type * as THREE from 'three';
import { renderDpr, type RenderQuality } from '../lib/render-quality';
import type { Theme } from '../theme/theme';
import { cameraDistance, coreAppearance, dampFactor } from './core-theme';
import { RuntimeProfiler } from '../scenes/RuntimeProfiler';
import type { CoreDriver } from './core-driver';
import { SystemCore } from './SystemCore';

/**
 * Drives the camera along the hero sequence. The camera is animated here, in
 * the render loop, reading scroll progress from a ref — Motion never writes to
 * a Three.js object. See ADR-017.
 */
function CameraRig({ driver }: { driver: CoreDriver }): null {
  const { camera } = useThree();
  useFrame((_, delta) => {
    const progress = driver.progress.current;
    camera.position.z += (cameraDistance(progress) - camera.position.z) * dampFactor(6, delta);
  });
  return null;
}

/**
 * Studio built from lightformers so no HDRI is fetched at runtime. The cubemap
 * is rendered at start-up, and its resolution is measurable in the Lighthouse
 * score, so it is sized by profile.
 */
function Stage({ theme, quality }: { theme: Theme; quality: RenderQuality }): React.JSX.Element {
  const key = useRef<THREE.Mesh>(null);
  const violet = useRef<THREE.Mesh>(null);
  const cyan = useRef<THREE.Mesh>(null);
  const fill = useRef<THREE.Mesh>(null);
  const ambient = useRef<THREE.AmbientLight>(null);
  const appearance = coreAppearance(theme);

  useFrame((_, delta) => {
    const factor = dampFactor(3.2, delta);
    const approach = (mesh: THREE.Mesh | null, target: number): void => {
      if (!mesh) return;
      const material = mesh.material as THREE.MeshBasicMaterial & { intensity?: number };
      if (typeof material.intensity !== 'number') return;
      material.intensity += (target - material.intensity) * factor;
    };
    approach(key.current, appearance.keyIntensity);
    approach(violet.current, appearance.violetIntensity);
    approach(cyan.current, appearance.cyanIntensity);
    approach(fill.current, appearance.fillIntensity);
    if (ambient.current) {
      ambient.current.intensity +=
        (appearance.ambientIntensity - ambient.current.intensity) * factor;
    }
  });

  return (
    <>
      <ambientLight intensity={appearance.ambientIntensity} ref={ambient} />
      <Environment resolution={quality === 'ULTRA' ? 128 : 64}>
        <Lightformer
          form="rect"
          intensity={appearance.fillIntensity}
          position={[0, 0, 9]}
          scale={[22, 22, 1]}
          ref={fill}
        />
        <Lightformer
          form="rect"
          intensity={appearance.keyIntensity}
          position={[0, 4, 2]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[8, 4, 1]}
          ref={key}
        />
        {/* A second broad source from below. Metal at `metalness: 1` renders
            whatever the environment contains, and on the near-black ground a
            single top source left the bezel with nothing to reflect: it read
            as black rubber rather than as titanium. */}
        <Lightformer
          form="rect"
          intensity={appearance.fillIntensity * 1.6}
          position={[-3, -3, 3]}
          rotation={[-Math.PI / 3, 0, 0]}
          scale={[10, 5, 1]}
        />
        <Lightformer
          form="circle"
          color="#7868ff"
          intensity={appearance.violetIntensity}
          position={[-4, 1, 2]}
          scale={4}
          ref={violet}
        />
        <Lightformer
          form="circle"
          color="#5ee7f7"
          intensity={appearance.cyanIntensity}
          position={[4, -1, 1]}
          scale={3.4}
          ref={cyan}
        />
      </Environment>
    </>
  );
}

export interface CoreStageProps {
  theme: Theme;
  quality: RenderQuality;
  driver: CoreDriver;
  /** Paused while the hero is off-screen, so the loop costs nothing below the fold. */
  active: boolean;
}

export default function CoreStage({
  theme,
  quality,
  driver,
  active,
}: CoreStageProps): React.JSX.Element {
  // The camera does not travel through the object on small viewports: at that
  // field of view the pass-through reads as a glitch rather than as motion.
  const canTravelThrough = quality !== 'LOW' && window.innerWidth > 760;
  return (
    <Canvas
      aria-hidden
      frameloop={active ? 'always' : 'never'}
      dpr={renderDpr(quality)}
      camera={{ position: [0, 0, 6], fov: 35 }}
      gl={{ antialias: quality === 'ULTRA', powerPreference: 'high-performance', alpha: true }}
    >
      <RuntimeProfiler />
      <Stage quality={quality} theme={theme} />
      <CameraRig driver={driver} />
      <SystemCore
        canTravelThrough={canTravelThrough}
        driver={driver}
        quality={quality}
        theme={theme}
      />
    </Canvas>
  );
}
