'use client';

import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';

function AbilityCore({ score, paused }: { score: number; paused: boolean }) {
  const intensity = Math.max(0.2, score / 100);
  const coreColor = score >= 80 ? '#15a78d' : score >= 45 ? '#3e9fb4' : '#a8c9c2';

  return <Float speed={paused ? 0 : 1.25} rotationIntensity={paused ? 0 : 0.22} floatIntensity={paused ? 0 : 0.38}>
    <group rotation={[0.35, 0.2, 0]}>
      <mesh>
        <icosahedronGeometry args={[0.76, 2]} />
        <meshStandardMaterial color={coreColor} emissive={coreColor} emissiveIntensity={0.18 + intensity * 0.38} roughness={0.28} metalness={0.08} />
      </mesh>
      <mesh rotation={[1.25, 0.2, 0.55]}>
        <torusGeometry args={[1.03, 0.035, 12, 60]} />
        <meshStandardMaterial color="#6ad1bc" emissive="#6ad1bc" emissiveIntensity={0.32} />
      </mesh>
      <mesh rotation={[0.48, 1.08, 0.1]}>
        <torusGeometry args={[1.3, 0.022, 10, 60]} />
        <meshStandardMaterial color="#b4e7db" transparent opacity={0.9} />
      </mesh>
      {[-0.88, 0.88].map((x) => <mesh key={x} position={[x, x > 0 ? 0.47 : -0.47, 0.12]}>
        <sphereGeometry args={[0.1 + intensity * 0.05, 18, 18]} />
        <meshStandardMaterial color="#e7fff8" emissive="#8be0cb" emissiveIntensity={0.75} />
      </mesh>)}
    </group>
  </Float>;
}

export function SelfStudyAbilityModel({ score, paused = false }: { score: number; paused?: boolean }) {
  return <div className="self-study-ability-model" aria-label={`Three.js 能力数模型，当前 ${score} 分`}>
    <Canvas camera={{ position: [0, 0, 4.25], fov: 42 }} dpr={[1, 1.5]}>
      <ambientLight intensity={1.2} />
      <pointLight position={[3, 3, 3]} intensity={18} color="#9bf1dd" />
      <pointLight position={[-3, -2, 2]} intensity={8} color="#b7dff0" />
      <AbilityCore paused={paused} score={score} />
      <OrbitControls enablePan={false} enableZoom={false} autoRotate={!paused} autoRotateSpeed={0.75} />
    </Canvas>
  </div>;
}
