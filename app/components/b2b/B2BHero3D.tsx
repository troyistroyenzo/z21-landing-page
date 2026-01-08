'use client';

import React, { Suspense, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { motion, useScroll as useFramerScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';
import ClientOnly from '../ClientOnly';

// Particle field background - OPTIMIZED
function ParticleField({ scrollProgress }: { scrollProgress: number }) {
  const points = useRef<THREE.Points>(null);
  
  // Mobile detection for performance optimization
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);
  
  const particleCount = isMobile ? 300 : 600; // Heavily reduced from 1500
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30;
      positions[i + 1] = (Math.random() - 0.5) * 30;
      positions[i + 2] = (Math.random() - 0.5) * 30;
      
      // Mix of emerald and gold colors
      if (Math.random() > 0.5) {
        colors[i] = 0.063;
        colors[i + 1] = 0.725;
        colors[i + 2] = 0.506;
      } else {
        colors[i] = 0.682;
        colors[i + 1] = 0.576;
        colors[i + 2] = 0.439;
      }
    }
    
    return [positions, colors];
  }, [particleCount]);
  
  useFrame((state) => {
    if (!points.current) return;
    
    // Rotate based on mouse position (lighter calculation)
    points.current.rotation.x = state.mouse.y * 0.1;
    points.current.rotation.y = state.mouse.x * 0.1;
    
    // Zoom effect based on scroll
    points.current.position.z = scrollProgress * 15;
  });
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.06 : 0.08}
        vertexColors
        transparent
        opacity={0.8 - scrollProgress * 0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// Abstract floating geometry - OPTIMIZED
function AbstractMesh({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Rotate based on time
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    
    // Scale and position based on scroll
    const scale = 1 + scrollProgress * 2;
    meshRef.current.scale.setScalar(scale);
    meshRef.current.position.z = -scrollProgress * 10;
    
    // Fade out on scroll
    if (meshRef.current.material && 'opacity' in meshRef.current.material) {
      (meshRef.current.material as any).opacity = Math.max(0, 0.7 - scrollProgress);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, -5]}>
        <torusKnotGeometry args={[1.5, 0.5, 32, 8]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
          wireframe
          transparent
        />
      </mesh>
    </Float>
  );
}

// Camera controller with scroll zoom - OPTIMIZED
function CameraController({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();
  
  useFrame((state) => {
    // Mouse influence with lighter lerping
    const targetX = state.mouse.x * 0.5;
    const targetY = state.mouse.y * 0.5;
    
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    
    // Zoom in on scroll
    const targetZ = 8 - scrollProgress * 5;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);
    
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// 3D Scene wrapper
function Scene3D({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 5, 30]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      
      <ParticleField scrollProgress={scrollProgress} />
      <AbstractMesh scrollProgress={scrollProgress} />
      <CameraController scrollProgress={scrollProgress} />
    </>
  );
}

export default function B2BHero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useFramerScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1.2]);
  
  const [scrollProgress, setScrollProgress] = React.useState(0);
  
  useEffect(() => {
    // Throttle scroll updates for better performance
    let ticking = false;
    
    const unsubscribe = scrollYProgress.on("change", (value) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollProgress(value);
          ticking = false;
        });
        ticking = true;
      }
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0">
        <ClientOnly fallback={<div className="w-full h-full bg-gradient-to-b from-emerald-950/20 to-black" />}>
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 8], fov: 60 }}
              dpr={[1, 1.5]}
              className="w-full h-full"
              gl={{ 
                antialias: false,
                powerPreference: "high-performance",
                alpha: false
              }}
            >
              <Scene3D scrollProgress={scrollProgress} />
            </Canvas>
          </Suspense>
        </ClientOnly>
      </div>
      
      {/* Content Overlay */}
      <motion.div 
        className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center"
        style={{ y, opacity, scale }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Subtitle */}
          <motion.div
            className="inline-block mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span className="text-emerald-400 text-lg font-medium tracking-wide uppercase">
              Z21HQ — B2B Team AI Onboarding (DWY)
            </span>
          </motion.div>
          
          {/* Main Headline with Shader Effect Simulation */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <span className="text-white">Take your team from</span>
            </motion.span>
            <motion.span
              className="block mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 animate-pulse">
                  "AI-confused"
                </span>
              </span>
              <span className="text-white mx-4">→</span>
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                  AI operators
                </span>
              </span>
            </motion.span>
            <motion.span
              className="block mt-2 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.4 }}
            >
              in 1–2 days.
            </motion.span>
          </h1>
          
          {/* Subheadline */}
          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-4 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
          >
            My goal for you: turn overwhelm into <span className="text-emerald-400 font-semibold">10× output</span> with safe, 
            repeatable AI workflows your team actually uses next week.
          </motion.p>
          
          {/* Promise */}
          <motion.p
            className="text-lg md:text-xl text-emerald-200 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
          >
            <strong>Promise:</strong> Walk away with 2–3 working workflows, a prompt + workflow playbook, 
            and a 30-day scoreboard that proves time saved, quality gains, and new capabilities.
          </motion.p>
          
          {/* Deal */}
          <motion.div
            className="bg-emerald-900/20 backdrop-blur-sm border border-emerald-700/30 rounded-lg p-4 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 2 }}
          >
            <p className="text-gray-200">
              <span className="text-emerald-400 font-bold">Deal?</span> If we don't ship the agreed workflows by workshop end, 
              you get a <span className="text-emerald-400 font-semibold">free 60-min follow-up build</span> for your team.
            </p>
          </motion.div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ opacity }}
        >
          <div className="w-6 h-10 border-2 border-emerald-400/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-emerald-400 rounded-full mt-2" />
          </div>
        </motion.div>
      </motion.div>
      
      {/* Gradient Overlays */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
}
