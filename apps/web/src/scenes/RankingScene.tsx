import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useSceneVisibility } from './use-scene-visibility';

const vertex = `
uniform float uTime;
uniform vec2 uMorph;
attribute vec3 adjusted;
attribute vec3 category;
attribute float seed;
varying float vSignal;
void main() {
  vec3 p = mix(position, adjusted, uMorph.x);
  p = mix(p, category, uMorph.y);
  p.y += sin(uTime * .5 + seed * 12.) * .025;
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(18. / -mv.z, 1.2, 4.2);
  vSignal = seed;
}`;

const fragment = `
varying float vSignal;
void main() {
  float d = length(gl_PointCoord - .5);
  float alpha = smoothstep(.5, .05, d);
  vec3 cold = vec3(.08, .68, .78);
  vec3 hot = vec3(1., .25, .05);
  gl_FragColor = vec4(mix(cold, hot, smoothstep(.35, .85, vSignal)), alpha * .86);
}`;

function MorphPoints({ mode, count }: { mode: number; count: number }): React.JSX.Element {
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const absolute = new Float32Array(count * 3);
    const adjusted = new Float32Array(count * 3);
    const category = new Float32Array(count * 3);
    const seeds = new Float32Array(count);

    for (let index = 0; index < count; index += 1) {
      const seed = index / count;
      const column = index % 160;
      const row = Math.floor(index / 160);
      absolute[index * 3] = (column / 160 - 0.5) * 11;
      absolute[index * 3 + 1] = (seed - 0.5) * 5 + Math.sin(column * 0.14) * 0.55;
      absolute[index * 3 + 2] = Math.sin(row * 0.27) * 0.45;

      const angle = seed * Math.PI * 15;
      adjusted[index * 3] = Math.cos(angle) * (1.2 + seed * 3.6);
      adjusted[index * 3 + 1] = (seed - 0.5) * 6;
      adjusted[index * 3 + 2] = Math.sin(angle) * (1.2 + seed * 3.6);

      const cluster = index % 5;
      const clusterAngle = (cluster / 5) * Math.PI * 2;
      const localAngle = seed * Math.PI * 40;
      category[index * 3] = Math.cos(clusterAngle) * 3.8 + Math.cos(localAngle) * 0.75;
      category[index * 3 + 1] = Math.sin(clusterAngle) * 2.2 + Math.sin(localAngle) * 0.75;
      category[index * 3 + 2] = Math.sin(seed * 35) * 0.8;
      seeds[index] = (index * 0.61803398875) % 1;
    }

    const value = new THREE.BufferGeometry();
    value.setAttribute('position', new THREE.BufferAttribute(absolute, 3));
    value.setAttribute('adjusted', new THREE.BufferAttribute(adjusted, 3));
    value.setAttribute('category', new THREE.BufferAttribute(category, 3));
    value.setAttribute('seed', new THREE.BufferAttribute(seeds, 1));
    return value;
  }, [count]);

  useFrame(({ clock }, delta) => {
    const shader = material.current;
    if (!shader) return;
    const morph = shader.uniforms.uMorph?.value as unknown;
    if (!(morph instanceof THREE.Vector2)) return;
    const targetX = mode === 1 ? 1 : 0;
    const targetY = mode === 2 ? 1 : 0;
    morph.x = THREE.MathUtils.damp(morph.x, targetX, 4, delta);
    morph.y = THREE.MathUtils.damp(morph.y, targetY, 4, delta);
    shader.uniforms.uTime!.value = clock.elapsedTime;
  });

  return (
    <points geometry={geometry} rotation={[-0.08, 0.2, -0.04]}>
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{ uTime: { value: 0 }, uMorph: { value: new THREE.Vector2() } }}
      />
    </points>
  );
}

export default function RankingScene(): React.JSX.Element {
  const [mode, setMode] = useState(0);
  const { container, visible } = useSceneVisibility();
  const labels = ['ABSOLUTE', 'ADJUSTED', 'CATEGORY'];
  const count = window.innerWidth < 760 ? 8_000 : 28_000;

  return (
    <div className="ranking-visual" ref={container}>
      {visible && (
        <Canvas
          aria-hidden
          dpr={[1, 1.35]}
          camera={{ position: [0, 0, 10], fov: 48 }}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
        >
          <MorphPoints mode={mode} count={count} />
        </Canvas>
      )}
      <div className="scene-label">RANKING V3 / SAME ENTITIES · DIFFERENT BASIS</div>
      <div className="scene-tabs" aria-label="Ranking projection">
        {labels.map((label, index) => (
          <button
            className={mode === index ? 'active' : ''}
            onClick={() => setMode(index)}
            key={label}
          >
            <span>0{index + 1}</span> {label}
          </button>
        ))}
      </div>
    </div>
  );
}
