'use client';

import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { gsap } from 'gsap';
import type { OfferItem } from '@/app/content/offerStack';
import ClientOnly from './ClientOnly';

// Particle System Component
function ParticleField({ count = 100, color = '#10b981' }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp: Array<{ t: number; factor: number; speed: number; xFactor: number; yFactor: number; zFactor: number; mx: number; my: number }> = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -20 + Math.random() * 40;
      const yFactor = -20 + Math.random() * 40;
      const zFactor = -20 + Math.random() * 40;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    particles.forEach((particle, i) => {
      const { factor, speed, xFactor, yFactor, zFactor } = particle;
  const t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);

      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s * 0.3, s * 0.3, s * 0.3);
      dummy.rotation.set(s * 5, s * 5, s * 5);
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
      <sphereGeometry args={[0.05, 6, 6]} />
      <meshPhongMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </instancedMesh>
  );
}

// Enhanced 3D Models with mouse tracking
function EnhancedSprintRing({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (meshRef.current) {
      // Base rotation
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.007;
      
      // Mouse influence with smooth lerping
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        mouseY * 0.5,
        0.1
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        mouseX * 0.5,
        0.1
      );
      
      // Scale on hover
      const targetScale = hovered ? 1.2 : 1;
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1);
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.1);
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.1);
    }
  });
  
  

  return (
    <>
      <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
        <mesh 
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <torusGeometry args={[1, 0.4, 16, 32]} />
          <MeshDistortMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={hovered ? 0.5 : 0.2}
            roughness={0.1}
            metalness={0.9}
            distort={0.1}
            speed={2}
          />
        </mesh>
      </Float>
      <ParticleField count={30} color="#10b981" />
    </>
  );
}

function EnhancedLighthouse({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.008;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
      
      // Mouse influence
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouseY * 0.3,
        0.1
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        -mouseX * 0.3,
        0.1
      );
      
      // Scale on hover
      const targetScale = hovered ? 1.15 : 1;
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1)
      );
    }
    
    // Pulsing light
    if (lightRef.current) {
      lightRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.3}>
        <group 
          ref={groupRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <mesh position={[0, 0, 0]}>
            <coneGeometry args={[0.8, 2, 8]} />
            <MeshDistortMaterial
              color="#AE9370"
              emissive="#AE9370"
              emissiveIntensity={hovered ? 0.6 : 0.3}
              roughness={0.2}
              metalness={0.8}
              distort={0.05}
              speed={1}
            />
          </mesh>
          {/* Light beacon */}
          <mesh position={[0, 1.5, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial 
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
          <pointLight 
            ref={lightRef}
            position={[0, 1.5, 0]} 
            color="#AE9370" 
            intensity={2} 
            distance={5}
          />
        </group>
      </Float>
      <ParticleField count={25} color="#AE9370" />
    </>
  );
}

function EnhancedNetworkMesh({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const connectionRefs = useRef<THREE.Mesh[]>([]);

  const nodePositions: [number, number, number][] = useMemo(() => [
    [0, 0, 0],
    [1.5, 0.5, 0],
    [-1.2, -0.3, 0.8],
    [0.5, -0.8, -1],
    [-0.8, 0.7, -0.5],
  ], []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Mouse influence
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouseY * 0.4,
        0.1
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouseX * 0.4,
        0.1
      );
      
      // Scale on hover
      const targetScale = hovered ? 1.1 : 1;
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1)
      );
    }
    
    // Animate connections
    connectionRefs.current.forEach((mesh, i) => {
      if (mesh && mesh.material && 'opacity' in mesh.material) {
        (mesh.material as THREE.MeshStandardMaterial).opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.3;
      }
    });
  });

  return (
    <>
      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.2}>
        <group 
          ref={groupRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {/* Nodes */}
          {nodePositions.map((pos, i) => (
            <mesh key={`node-${i}`} position={pos}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <MeshDistortMaterial
                color="#10b981"
                emissive="#10b981"
                emissiveIntensity={hovered ? 0.6 : 0.3}
                roughness={0.1}
                metalness={0.9}
                distort={0.05}
                speed={2}
              />
            </mesh>
          ))}
          
          {/* Connections */}
          {nodePositions.map((start, i) =>
            nodePositions.slice(i + 1).map((end, j) => {
              const midpoint = [
                (start[0] + end[0]) / 2,
                (start[1] + end[1]) / 2,
                (start[2] + end[2]) / 2,
              ];
              
              return (
                <mesh
                  key={`connection-${i}-${j}`}
                  position={midpoint as [number, number, number]}
                  ref={(el) => {
                    if (el) connectionRefs.current[i * nodePositions.length + j] = el;
                  }}
                >
                  <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
                  <meshStandardMaterial
                    color="#AE9370"
                    emissive="#AE9370"
                    emissiveIntensity={0.3}
                    opacity={0.6}
                    transparent
                  />
                </mesh>
              );
            })
          )}
        </group>
      </Float>
      <ParticleField count={40} color="#059669" />
    </>
  );
}

// Mouse tracking hook
function useMousePosition(elementRef: React.RefObject<HTMLDivElement | null>) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        setMousePosition({ x, y });
      }
    };

    const element = elementRef.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
      return () => element.removeEventListener('mousemove', handleMouseMove);
    }
  }, [elementRef]);

  return mousePosition;
}

// Camera Controller with zoom
function CameraController({ zoom }: { zoom: boolean }) {
  const { camera } = useThree();
  
  useEffect(() => {
    if (zoom) {
      gsap.to(camera.position, {
        z: 2,
        duration: 0.5,
        ease: 'power2.inOut'
      });
    } else {
      gsap.to(camera.position, {
        z: 5,
        duration: 0.5,
        ease: 'power2.inOut'
      });
    }
  }, [zoom, camera]);

  return null;
}

interface OfferCard3DProps {
  offer: OfferItem;
  onOpenModal: () => void;
  isPaused?: boolean;
}

export default function OfferCard3D(props: OfferCard3DProps) {
  const { offer, isPaused = false } = props;
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition(canvasRef);

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setIsWebGLSupported(false);
      }
    } catch {
      setIsWebGLSupported(false);
    }
  }, [offer.id]);
  const fallbackColors = {
    cohort: 'from-emerald-900 via-emerald-800 to-emerald-700',
    coaching: 'from-[#AE9370] via-[#8E7350] to-[#6E5330]',
    workshop: 'from-emerald-700 via-[#AE9370] to-emerald-800',
  };

  const isInactive = offer.seasonOpen === false || offer.isActive === false;

  return (
    <motion.div
      className={`bg-black/40 backdrop-blur-sm rounded-xl border overflow-hidden group relative ${
        isInactive 
          ? 'border-gray-700/30 opacity-60 cursor-default' 
          : 'border-emerald-900/30 cursor-pointer'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={!isInactive ? {
        y: -8,
        boxShadow: '0 25px 50px rgba(16, 185, 129, 0.3)',
        transition: { duration: 0.3 }
      } : {}}
      onMouseEnter={() => !isInactive && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Active Badge */}
      {offer.isActive && (
        <div className="absolute top-4 right-4 z-10">
          <motion.div
            className="px-4 py-2 bg-emerald-500 text-emerald-900 text-sm font-bold rounded-full shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            ACTIVE OFFER
          </motion.div>
        </div>
      )}
      {/* 3D Scene Container */}
      <div ref={canvasRef} className="relative h-64 overflow-hidden">
        <ClientOnly fallback={
          <div className={`w-full h-full bg-gradient-to-br ${fallbackColors[offer.id]} animate-pulse`} />
        }>
          {isWebGLSupported ? (
            <Suspense fallback={
              <div className={`w-full h-full bg-gradient-to-br ${fallbackColors[offer.id]} animate-pulse`} />
            }>
              <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                dpr={[1, 2]}
                frameloop={isPaused ? 'never' : 'always'}
                className="w-full h-full"
              >
                <ambientLight intensity={0.3} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
                <directionalLight position={[-5, -5, -5]} intensity={0.3} />
                
                <CameraController zoom={isHovered} />
                
                {offer.id === 'cohort' && (
                  <EnhancedSprintRing mouseX={mousePosition.x} mouseY={mousePosition.y} />
                )}
                {offer.id === 'coaching' && (
                  <EnhancedLighthouse mouseX={mousePosition.x} mouseY={mousePosition.y} />
                )}
                {offer.id === 'workshop' && (
                  <EnhancedNetworkMesh mouseX={mousePosition.x} mouseY={mousePosition.y} />
                )}
                
              </Canvas>
            </Suspense>
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${fallbackColors[offer.id]} flex items-center justify-center`}>
              <div className="text-6xl opacity-50">
                {offer.id === 'cohort' && '⭕'}
                {offer.id === 'coaching' && '🏛️'}
                {offer.id === 'workshop' && '🔗'}
              </div>
            </div>
          )}
        </ClientOnly>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Card Content */}
      <div className="p-6">
        <h3 className={`text-2xl font-bold mb-2 ${isInactive ? 'text-gray-400' : 'text-white'}`}>
          {offer.title}
        </h3>
        <p className={`mb-6 ${isInactive ? 'text-gray-500' : 'text-emerald-200'}`}>
          {offer.cardSubtitle}
        </p>

        {isInactive ? (
          // For inactive offers (cohort), just show "Coming Soon" centered text
          <div className="text-center py-4">
            <span className="text-gray-500 text-sm uppercase tracking-wide font-semibold">
              Coming Soon
            </span>
          </div>
        ) : offer.id === 'coaching' ? (
          // For coaching, only show CTA link (no Learn more button)
          <div className="flex items-center justify-end">
            <a
              href={offer.ctaRoute}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-300 hover:text-emerald-200 underline underline-offset-4 text-sm transition-colors"
            >
              {offer.ctaLabel} →
            </a>
          </div>
        ) : offer.id === 'workshop' ? (
          // For B2B workshop, Learn more goes to /b2b
          <div className="flex items-center justify-between">
            <motion.a
              href="/b2b"
              className="px-6 py-2.5 bg-tan text-emerald-900 rounded-lg font-semibold hover:bg-tan/90 transition-colors inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.a>

            <a
              href={offer.ctaRoute}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-300 hover:text-emerald-200 underline underline-offset-4 text-sm transition-colors"
            >
              {offer.ctaLabel} →
            </a>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
