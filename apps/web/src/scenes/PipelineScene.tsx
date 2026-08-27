import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useSceneVisibility } from './use-scene-visibility';

const vertex = `
uniform float uTime;
attribute float speed;
attribute float lane;
varying float vPulse;
void main() {
  vec3 p = position;
  p.x = mod(p.x + 9. + uTime * speed, 18.) - 9.;
  p.y += sin(p.x * .9 + lane * 2.4) * .16;
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(22. / -mv.z, 1.5, 5.);
  vPulse = fract(p.x * .19 + lane * .23 + uTime * speed);
}`;

const fragment = `
varying float vPulse;
void main() {
  float alpha = smoothstep(.5, .06, length(gl_PointCoord - .5));
  vec3 color = mix(vec3(.08, .72, .82), vec3(1., .27, .06), step(.86, vPulse));
  gl_FragColor = vec4(color, alpha * (.35 + vPulse * .65));
}`;

function DataFlow({ count }: { count: number }): React.JSX.Element {
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const lanes = new Float32Array(count);
    for (let index = 0; index < count; index += 1) {
      const lane = index % 7;
      positions[index * 3] = (index / count) * 18 - 9;
      positions[index * 3 + 1] = (lane - 3) * 0.62;
      positions[index * 3 + 2] = Math.sin(index * 0.71) * 0.5;
      speeds[index] = 0.24 + ((index * 13) % 23) / 28;
      lanes[index] = lane;
    }
    const value = new THREE.BufferGeometry();
    value.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    value.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
    value.setAttribute('lane', new THREE.BufferAttribute(lanes, 1));
    return value;
  }, [count]);

  useFrame(({ clock }) => {
    if (material.current) material.current.uniforms.uTime!.value = clock.elapsedTime;
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{ uTime: { value: 0 } }}
      />
    </points>
  );
}

export default function PipelineScene(): React.JSX.Element {
  const { container, visible } = useSceneVisibility();
  return (
    <div className="pipeline-visual" ref={container}>
      <Canvas
        aria-hidden
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.25]}
        camera={{ position: [0, 0, 10], fov: 48 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <DataFlow count={window.innerWidth < 760 ? 4_000 : 14_000} />
      </Canvas>
      <span className="scene-label">REQUEST → CONTRACT → DOMAIN → DATA → RESPONSE</span>
    </div>
  );
}
