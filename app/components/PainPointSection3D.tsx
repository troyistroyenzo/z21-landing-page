'use client';

import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Box, Sphere, Octahedron, Torus, MeshDistortMaterial, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import ClientOnly from './ClientOnly';
import { useMousePosition3D, useIsMobile } from './3d/MouseTracker3D';

// 3D Icon Components
function PainIcon3D({ type, position, color, mouseX, mouseY }: { 
  type: 'box' | 'sphere' | 'octahedron' | 'torus';
  position: [number, number, number];
  color: string;
  mouseX: number;
  mouseY: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Rotation animation
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.005;
    
    // Mouse influence
    meshRef.current.position.x = position[0] + mouseX * 0.2;
    meshRef.current.position.y = position[1] + mouseY * 0.2;
    
    // Scale on hover
    const targetScale = hovered ? 1.3 : 1;
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1);
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.1);
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.1);
  });

  const geometry = useMemo(() => {
    switch(type) {
      case 'box': return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere': return <sphereGeometry args={[0.6, 16, 16]} />;
      case 'octahedron': return <octahedronGeometry args={[0.7]} />;
      case 'torus': return <torusGeometry args={[0.6, 0.3, 16, 32]} />;
      default: return <boxGeometry args={[1, 1, 1]} />;
    }
  }, [type]);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh 
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {geometry}
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.4 : 0.2}
          roughness={0.2}
          metalness={0.8}
          distort={0.1}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

// Scene with multiple pain points
function PainPointsScene({ mouseX, mouseY, isMobile }: { mouseX: number; mouseY: number; isMobile: boolean }) {
  const painPoints = [
    { type: 'box' as const, position: [-2, 1, 0] as [number, number, number], color: '#10b981' },
    { type: 'sphere' as const, position: [2, 1, 0] as [number, number, number], color: '#AE9370' },
    { type: 'octahedron' as const, position: [0, -1, 0] as [number, number, number], color: '#10b981' },
    { type: 'torus' as const, position: [0, 1, -2] as [number, number, number], color: '#AE9370' },
  ];

  return (
    <>
      {painPoints.map((point, i) => (
        <PainIcon3D
          key={i}
          type={point.type}
          position={point.position}
          color={point.color}
          mouseX={isMobile ? 0 : mouseX}
          mouseY={isMobile ? 0 : mouseY}
        />
      ))}
    </>
  );
}

// Floating particles
function FloatingParticles({ count = 30 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ],
        scale: Math.random() * 0.5 + 0.5
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      dummy.position.set(
        particle.position[0],
        particle.position[1] + Math.sin(state.clock.elapsedTime + i) * 0.1,
        particle.position[2]
      );
      dummy.scale.setScalar(particle.scale * (Math.sin(state.clock.elapsedTime + i) * 0.2 + 1));
      dummy.updateMatrix();
      
      if (mesh.current) {
        mesh.current.setMatrixAt(i, dummy.matrix);
      }
    });
    
    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#10b981" opacity={0.3} transparent />
    </instancedMesh>
  );
}

export default function PainPointSection3D() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition3D(canvasRef);
  const isMobile = useIsMobile();

  const painPoints = [
    {
      title: "AI Overwhelm",
      description: "Too many tools, not enough clarity on what actually works"
    },
    {
      title: "Implementation Gap",
      description: "Know the potential but stuck on execution"
    },
    {
      title: "No Clear ROI",
      description: "Spending time on AI but not seeing business results"
    },
    {
      title: "Workflow Chaos",
      description: "Piecing together solutions that don't scale"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-emerald-950/20 to-[#0C1816] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            The Real Problem
          </h2>
          <p className="text-xl text-emerald-200 max-w-3xl mx-auto">
            You're drowning in AI possibilities but starving for actual implementation
          </p>
        </motion.div>

        {/* 3D Scene */}
        <div ref={canvasRef} className="h-[300px] md:h-[400px] mb-12">
          <ClientOnly fallback={
            <div className="w-full h-full bg-gradient-to-br from-emerald-900/10 to-emerald-700/10 rounded-xl" />
          }>
            <Suspense fallback={null}>
              <Canvas
                camera={{ position: [0, 0, 6], fov: 50 }}
                dpr={[1, 2]}
                className="w-full h-full"
              >
                <ambientLight intensity={0.3} />
                <directionalLight position={[10, 10, 5]} intensity={0.5} />
                <directionalLight position={[-10, -10, -5]} intensity={0.3} />
                
                <FloatingParticles count={isMobile ? 15 : 30} />
                <PainPointsScene 
                  mouseX={mousePosition.normalized.x} 
                  mouseY={mousePosition.normalized.y}
                  isMobile={isMobile}
                />
                
                <Environment preset="city" />
              </Canvas>
            </Suspense>
          </ClientOnly>
        </div>

        {/* Pain Points Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-black/40 backdrop-blur-sm border border-emerald-900/30 rounded-xl p-6 hover:border-emerald-700/50 transition-all"
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-bold text-white mb-3">{point.title}</h3>
              <p className="text-gray-300">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
