import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { dampFactor } from './core-theme';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

// A flat disc with a uniform colour reads as a planet. The falloff is what
// turns it into light, and it costs one draw call instead of a bloom pass.
const fragmentShader = `
uniform vec3 uColor;
uniform float uOpacity;
varying vec2 vUv;
void main() {
  float d = length(vUv - 0.5) * 2.0;
  float falloff = pow(clamp(1.0 - d, 0.0, 1.0), 3.0);
  gl_FragColor = vec4(uColor, falloff * uOpacity);
}`;

export function Halo({
  color,
  opacity,
  breathe,
}: {
  color: string;
  opacity: number;
  /** Multiplier from the core's breathing pulse. */
  breathe: React.RefObject<number>;
}): React.JSX.Element {
  const mesh = useRef<THREE.Mesh>(null);
  // Created once. Colour and opacity are interpolated in the loop below rather
  // than rebuilt, so a theme change animates instead of snapping.
  const uniforms = useRef({
    uColor: { value: new THREE.Color(color) },
    uOpacity: { value: opacity },
  }).current;

  useFrame(({ camera }, delta) => {
    if (!mesh.current) return;
    mesh.current.quaternion.copy(camera.quaternion);
    const factor = dampFactor(4, delta);
    uniforms.uColor.value.lerp(new THREE.Color(color), factor);
    const target = opacity * breathe.current;
    uniforms.uOpacity.value += (target - uniforms.uOpacity.value) * dampFactor(8, delta);
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[4.6, 4.6]} />
      <shaderMaterial
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        fragmentShader={fragmentShader}
        transparent
        uniforms={uniforms}
        vertexShader={vertexShader}
      />
    </mesh>
  );
}
