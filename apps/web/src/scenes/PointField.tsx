import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { pointBudget, selectRenderQuality } from '../lib/render-quality';

const vertex = `
uniform float uTime;
uniform float uScroll;
attribute float seed;
varying float vHeat;
void main() {
  vec3 p = position;
  float wave = sin(p.x * .24 + uTime * .35 + seed * 6.283) * .42;
  p.y += wave + sin(p.z * .3 + uScroll * 4.) * .25;
  p.z += sin(p.x * .15 + uTime * .18) * .35;
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(15. / -mv.z, 1., 4.);
  vHeat = smoothstep(-8., 8., p.x + wave * 4.);
}`;

const fragment = `
varying float vHeat;
void main() {
  vec2 uv = gl_PointCoord - .5;
  float alpha = smoothstep(.5, .08, length(uv));
  vec3 cold = vec3(.10, .58, .72);
  vec3 hot = vec3(1., .31, .08);
  gl_FragColor = vec4(mix(cold, hot, vHeat), alpha * .78);
}`;

function Particles({ count }: { count: number }): React.JSX.Element {
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      const radius = 2 + Math.pow(Math.random(), 0.55) * 15;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 2;
      seeds[i] = Math.random();
    }
    const value = new THREE.BufferGeometry();
    value.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    value.setAttribute('seed', new THREE.BufferAttribute(seeds, 1));
    return value;
  }, [count]);

  useFrame(({ clock }) => {
    if (!material.current) return;
    material.current.uniforms.uTime!.value = clock.elapsedTime;
    material.current.uniforms.uScroll!.value =
      window.scrollY / Math.max(document.body.scrollHeight, 1);
  });

  return (
    <points geometry={geometry} rotation={[-0.25, 0, -0.12]}>
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{ uTime: { value: 0 }, uScroll: { value: 0 } }}
      />
    </points>
  );
}

export default function PointField(): React.JSX.Element {
  const count = pointBudget(selectRenderQuality(window.innerWidth, false));
  return (
    <Canvas
      aria-hidden
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 18], fov: 55 }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
    >
      <Particles count={count} />
    </Canvas>
  );
}
