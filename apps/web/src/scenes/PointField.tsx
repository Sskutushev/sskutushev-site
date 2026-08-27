import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { pointBudget, selectRenderQuality } from '../lib/render-quality';
import { useSceneVisibility } from './use-scene-visibility';

const vertex = `
uniform float uTime;
uniform float uScroll;
attribute float seed;
varying float vHeat;
void main() {
  vec3 p = position;
  float wave = sin(p.x * .48 + uTime * .26 + seed) * .22;
  p.y += wave + sin(p.z * .58 + uScroll * 4.) * .18;
  p.z += sin(p.x * .22 + uTime * .14) * .12;
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(15. / -mv.z, 1., 4.);
  vHeat = smoothstep(-7., 7., p.x + p.y * 2.);
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
    const columns = Math.ceil(Math.sqrt(count * 1.35));
    const rows = Math.ceil(count / columns);
    for (let i = 0; i < count; i += 1) {
      const x = ((i % columns) / columns - 0.5) * 22;
      const z = (Math.floor(i / columns) / rows - 0.5) * 15;
      const ridge = Math.sin(x * 0.44) * 1.15 + Math.cos(z * 0.72) * 0.72;
      const crater = Math.exp(-(x * x + z * z) * 0.035) * 2.2;
      positions[i * 3] = x + Math.sin(i * 12.9898) * 0.035;
      positions[i * 3 + 1] = ridge + crater - 1.15;
      positions[i * 3 + 2] = z;
      seeds[i] = (i * 0.61803398875) % 1;
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
  const { container, visible } = useSceneVisibility();
  return (
    <div className="scene-canvas" ref={container}>
      <Canvas
        aria-hidden
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.5]}
        camera={{ position: [0, 4.2, 17], fov: 52 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <Particles count={count} />
      </Canvas>
    </div>
  );
}
