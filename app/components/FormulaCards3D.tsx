'use client';

import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Sphere, Torus, Cone, Environment, Text, Cylinder, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import ClientOnly from './ClientOnly';
import { useMousePosition3D, useIsMobile } from './3d/MouseTracker3D';
import content from '@/app/content/z21.json';

// Redesigned 3D Icons with better visibility
function CubeIcon({ isHovered }: { isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
  });
  
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <RoundedBox ref={meshRef} args={[1, 1, 1]} radius={0.1} smoothness={4}>
        <meshStandardMaterial
          color="#AE9370"
          emissive="#AE9370"
          emissiveIntensity={isHovered ? 0.8 : 0.3}
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={1}
        />
      </RoundedBox>
    </Float>
  );
}

function EnergyOrb({ isHovered }: { isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.15 + 1;
    meshRef.current.scale.setScalar(pulse);
  });
  
  return (
    <>
      <pointLight color="#10b981" intensity={isHovered ? 3 : 1.5} distance={5} />
      <Float speed={3} rotationIntensity={0.2} floatIntensity={0.8}>
        <Sphere ref={meshRef} args={[0.6, 32, 32]}>
          <MeshDistortMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={isHovered ? 1.5 : 0.8}
            metalness={0.2}
            roughness={0.1}
            distort={0.3}
            speed={2}
            transparent
            opacity={0.95}
          />
        </Sphere>
      </Float>
    </>
  );
}

function TargetRings({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
  });
  
  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <group ref={groupRef}>
        <Torus args={[0.7, 0.08, 12, 48]} rotation={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#AE9370" 
            emissive="#AE9370" 
            emissiveIntensity={isHovered ? 0.8 : 0.3}
            metalness={0.9}
            roughness={0.1}
          />
        </Torus>
        <Torus args={[0.5, 0.06, 12, 48]} rotation={[Math.PI / 3, 0, 0]}>
          <meshStandardMaterial 
            color="#10b981" 
            emissive="#10b981" 
            emissiveIntensity={isHovered ? 0.8 : 0.3}
            metalness={0.9}
            roughness={0.1}
          />
        </Torus>
        <Torus args={[0.3, 0.04, 12, 48]} rotation={[-Math.PI / 3, 0, 0]}>
          <meshStandardMaterial 
            color="#AE9370" 
            emissive="#AE9370" 
            emissiveIntensity={isHovered ? 0.8 : 0.3}
            metalness={0.9}
            roughness={0.1}
          />
        </Torus>
      </group>
    </Float>
  );
}

function RocketIcon({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
  });
  
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
      <group ref={groupRef}>
        <Cone args={[0.3, 0.8, 8]} position={[0, 0.2, 0]}>
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={isHovered ? 1 : 0.4}
            metalness={0.7}
            roughness={0.2}
          />
        </Cone>
        <Cylinder args={[0.3, 0.35, 0.6, 8]} position={[0, -0.3, 0]}>
          <meshStandardMaterial
            color="#AE9370"
            emissive="#AE9370"
            emissiveIntensity={isHovered ? 0.5 : 0.2}
            metalness={0.8}
            roughness={0.2}
          />
        </Cylinder>
      </group>
    </Float>
  );
}

// Simplified and cleaner 3D Card
function FormulaCard3D({ 
  card, 
  index, 
  position, 
  mouseX, 
  mouseY,
  isMobile 
}: { 
  card: any; 
  index: number; 
  position: [number, number, number];
  mouseX: number;
  mouseY: number;
  isMobile: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (!meshRef.current || isMobile) return;
    
    // Subtle mouse-based rotation
    const targetRotationY = mouseX * 0.05 + (index - 1.5) * 0.1;
    const targetRotationX = -mouseY * 0.05;
    
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotationY, 0.1);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotationX, 0.1);
  });
  
  return (
    <group 
      ref={meshRef} 
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Card Background with better visibility */}
      <RoundedBox 
        args={[2.8, 3.5, 0.15]} 
        radius={0.15} 
        smoothness={4}
      >
        <meshStandardMaterial
          color="#0A1F1C"
          emissive={hovered ? '#10b981' : '#0A1F1C'}
          emissiveIntensity={hovered ? 0.1 : 0.02}
          metalness={0.2}
          roughness={0.8}
          envMapIntensity={0.5}
        />
      </RoundedBox>
      
      {/* Border glow */}
      <RoundedBox 
        args={[2.85, 3.55, 0.1]} 
        radius={0.15} 
        smoothness={4}
        position={[0, 0, -0.05]}
      >
        <meshBasicMaterial
          color={hovered ? '#10b981' : '#AE9370'}
          transparent
          opacity={hovered ? 0.3 : 0.1}
        />
      </RoundedBox>
      
      {/* Large background number */}
      <Text
        position={[0, 0.8, 0.08]}
        fontSize={2}
        color="#AE9370"
        anchorX="center"
        anchorY="middle"
        material-transparent
        material-opacity={0.1}
      >
        {card.number}
      </Text>
      
      {/* 3D Icon */}
      <group position={[0, 0.5, 0.5]}>
        {index === 0 && <CubeIcon isHovered={hovered} />}
        {index === 1 && <EnergyOrb isHovered={hovered} />}
        {index === 2 && <TargetRings isHovered={hovered} />}
        {index === 3 && <RocketIcon isHovered={hovered} />}
      </group>
      
      {/* Title */}
      <Text
        position={[0, -1, 0.08]}
        fontSize={0.25}
        color={hovered ? '#10b981' : '#AE9370'}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.3}
        textAlign="center"
      >
        {card.title.toUpperCase()}
      </Text>
    </group>
  );
}

// Background floating particles
function BackgroundParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    pointsRef.current.rotation.x = state.clock.elapsedTime * 0.03;
  });
  
  const particlesPosition = new Float32Array(300);
  for (let i = 0; i < 100; i++) {
    particlesPosition[i * 3] = (Math.random() - 0.5) * 20;
    particlesPosition[i * 3 + 1] = (Math.random() - 0.5) * 20;
    particlesPosition[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlesPosition, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#10b981"
        transparent
        opacity={0.2}
        sizeAttenuation
      />
    </points>
  );
}

export default function FormulaCards3D() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition3D(canvasRef);
  const isMobile = useIsMobile();

  const cards = [
    {
      number: '01',
      title: 'Install the Stack',
      description: content.whatYouGet.grid[0].desc,
    },
    {
      number: '02',
      title: 'Learn by Building',
      description: content.whatYouGet.grid[1].desc,
    },
    {
      number: '03',
      title: 'Ship Weekly',
      description: content.whatYouGet.grid[2].desc,
    },
    {
      number: '04',
      title: 'Scale Forever',
      description: content.whatYouGet.grid[3].desc,
    },
  ];

  const cardPositions: [number, number, number][] = [
    [-5, 0, 0],
    [-1.7, 0, 0],
    [1.7, 0, 0],
    [5, 0, 0]
  ];

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
            The Z21 Formula
          </h2>
          <p className="text-xl text-emerald-200 max-w-3xl mx-auto">
            Four phases to transform from AI-curious to AI-powered
          </p>
        </motion.div>

        {/* 3D Scene */}
        <div ref={canvasRef} className="h-[400px] md:h-[500px] mb-16 rounded-2xl overflow-hidden bg-gradient-to-b from-emerald-950/10 to-[#0C1816]">
          <ClientOnly fallback={
            <div className="w-full h-full bg-gradient-to-br from-emerald-900/10 to-emerald-700/10 rounded-xl flex items-center justify-center">
              <div className="text-emerald-400">Loading formula...</div>
            </div>
          }>
            <Suspense fallback={null}>
              <Canvas
                camera={{ position: [0, 0, 12], fov: 50 }}
                dpr={[1, 2]}
                className="w-full h-full"
              >
                <fog attach="fog" args={['#0C1816', 10, 25]} />
                
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={0.8} color="#ffffff" />
                <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#10b981" />
                <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.5} penumbra={1} color="#AE9370" />
                
                {/* Formula Cards */}
                {cards.map((card, index) => (
                  <FormulaCard3D
                    key={index}
                    card={card}
                    index={index}
                    position={cardPositions[index]}
                    mouseX={mousePosition.normalized.x}
                    mouseY={mousePosition.normalized.y}
                    isMobile={isMobile}
                  />
                ))}
                
                <BackgroundParticles />
                
                <Environment preset="apartment" />
              </Canvas>
            </Suspense>
          </ClientOnly>
        </div>

        {/* Text Descriptions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-black/40 backdrop-blur-sm border border-emerald-900/30 rounded-xl p-6"
              whileHover={{ 
                y: -5,
                borderColor: 'rgb(16 185 129 / 0.5)',
                transition: { duration: 0.2 }
              }}
            >
              <div className="text-emerald-400 text-3xl font-bold mb-2">{card.number}</div>
              <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
