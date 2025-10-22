'use client';

import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox, MeshDistortMaterial, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import ClientOnly from './ClientOnly';
import { useMousePosition3D, useIsMobile } from './3d/MouseTracker3D';

// Interactive 3D Product Card
function ProductCard3D({ mouseX, mouseY, isMobile }: { mouseX: number; mouseY: number; isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    if (isMobile) {
      // Auto-rotate on mobile
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
    } else {
      // Follow mouse on desktop
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouseX * 0.3,
        0.1
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mouseY * 0.3,
        0.1
      );
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.2}>
      <group ref={groupRef}>
        {/* Main Card */}
        <RoundedBox 
          ref={meshRef}
          args={[3.5, 2.2, 0.2]} 
          radius={0.1} 
          smoothness={4}
        >
          <MeshDistortMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={0.1}
            metalness={0.8}
            roughness={0.2}
            distort={0.02}
            speed={2}
            transparent
            opacity={0.9}
          />
        </RoundedBox>
        
        {/* Floating UI Elements */}
        <mesh position={[1.2, 0.8, 0.3]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#AE9370"
            emissive="#AE9370"
            emissiveIntensity={0.5}
          />
        </mesh>
        
        <mesh position={[-1.2, -0.8, 0.3]}>
          <octahedronGeometry args={[0.12]} />
          <meshStandardMaterial
            color="#AE9370"
            emissive="#AE9370"
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* Glass panel effect */}
        <mesh position={[0, 0, 0.15]}>
          <planeGeometry args={[3, 1.8]} />
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0.1}
            roughness={0.1}
            transparent
            opacity={0.1}
            transmission={0.9}
            thickness={0.5}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Particle System for background
function BackgroundParticles({ count = 50 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 50;
      const speed = 0.005 + Math.random() / 500;
      const xFactor = -10 + Math.random() * 20;
      const yFactor = -10 + Math.random() * 20;
      const zFactor = -10 + Math.random() * 20;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed;
      
      dummy.position.set(
        Math.cos(t) * factor + xFactor,
        Math.sin(t) * factor + yFactor,
        Math.cos(t * 2) * factor + zFactor
      );
      dummy.scale.setScalar(Math.sin(t) * 0.5 + 1);
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
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshPhongMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.2} />
    </instancedMesh>
  );
}

export default function SolutionSection3D() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition3D(canvasRef);
  const isMobile = useIsMobile();

  return (
    <section className="py-24 bg-gradient-to-b from-[#0C1816] to-emerald-950/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            The Solution
          </h2>
          <p className="text-xl text-emerald-200 max-w-3xl mx-auto">
            AI-powered workflows that actually ship. Real results, not promises.
          </p>
        </motion.div>

        {/* 3D Product Card Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* 3D Canvas */}
          <div ref={canvasRef} className="h-[400px] relative">
            <ClientOnly fallback={
              <div className="w-full h-full bg-gradient-to-br from-emerald-900/20 to-emerald-700/20 rounded-xl flex items-center justify-center">
                <div className="text-emerald-400 text-xl">Loading 3D View...</div>
              </div>
            }>
              <Suspense fallback={null}>
                <Canvas
                  camera={{ position: [0, 0, 5], fov: 45 }}
                  dpr={[1, 2]}
                  className="w-full h-full"
                >
                  <ambientLight intensity={0.3} />
                  <directionalLight position={[5, 5, 5]} intensity={0.8} />
                  <directionalLight position={[-5, -5, -5]} intensity={0.3} />
                  
                  <BackgroundParticles count={isMobile ? 25 : 50} />
                  <ProductCard3D 
                    mouseX={mousePosition.normalized.x} 
                    mouseY={mousePosition.normalized.y}
                    isMobile={isMobile}
                  />
                  
                  <Environment preset="city" />
                </Canvas>
              </Suspense>
            </ClientOnly>
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold text-white">
              Ship Your First Workflow
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Proven Templates</h4>
                  <p className="text-gray-300">Start with battle-tested workflows that work.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Human-in-the-Loop</h4>
                  <p className="text-gray-300">You stay in control, AI amplifies your output.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Weekly Ship Rooms</h4>
                  <p className="text-gray-300">Get unstuck with live support and accountability.</p>
                </div>
              </div>
            </div>

            <motion.button
              className="px-8 py-3 bg-tan text-emerald-900 rounded-lg font-semibold text-lg hover:bg-tan/90 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Today
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
