'use client';

import React, { Suspense, useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import ClientOnly from './ClientOnly';
import { 
  useDeviceDetection, 
  getThreePerformanceSettings,
  useInViewport,
  useVisibilityControl,
  useOptimizedMousePosition,
  throttle
} from '@/lib/performanceUtils';

// 3D Particle Field Background - Optimized
function ParticleField({ count = 2000, isMobile = false }: { count?: number; isMobile?: boolean }) {
  const points = useRef<THREE.Points>(null);
  const particleCount = isMobile ? Math.min(count, 500) : count; // Reduce for mobile
  
  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      arr[i] = (Math.random() - 0.5) * 50;
      arr[i + 1] = (Math.random() - 0.5) * 50;
      arr[i + 2] = (Math.random() - 0.5) * 50;
    }
    return arr;
  }, [particleCount]);
  
  const colors = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Mix of emerald and tan colors
      if (Math.random() > 0.5) {
        arr[i] = 0.063; // R for emerald
        arr[i + 1] = 0.725; // G for emerald
        arr[i + 2] = 0.506; // B for emerald
      } else {
        arr[i] = 0.682; // R for tan
        arr[i + 1] = 0.576; // G for tan
        arr[i + 2] = 0.439; // B for tan
      }
    }
    return arr;
  }, []);
  
  useFrame((state) => {
    if (!points.current || isMobile) return; // Skip animations on mobile
    
    points.current.rotation.x = state.mouse.y * 0.05;
    points.current.rotation.y = state.mouse.x * 0.05;
    
    // Floating animation - slower for better performance
    points.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
  });
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// Floating 3D Shapes
function FloatingShapes() {
  return (
    <>
      <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
        <mesh position={[-3, 0, 0]}>
          <torusGeometry args={[1, 0.3, 16, 32]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.7}
          />
        </mesh>
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.3}>
        <mesh position={[3, 0, 0]}>
          <octahedronGeometry args={[1.2]} />
          <meshStandardMaterial
            color="#AE9370"
            emissive="#AE9370"
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.7}
          />
        </mesh>
      </Float>
      
      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.2}>
        <mesh position={[0, -2, -2]}>
          <icosahedronGeometry args={[0.8]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={0.2}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.6}
          />
        </mesh>
      </Float>
    </>
  );
}

// Mouse tracking camera
function CameraController() {
  const { camera } = useThree();
  
  useFrame((state) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, state.mouse.x * 0.5, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, state.mouse.y * 0.5 + 1, 0.05);
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

export default function Hero3D() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Performance hooks
  const deviceInfo = useDeviceDetection();
  const { isInView, hasBeenInView } = useInViewport(sectionRef as React.RefObject<HTMLElement>);
  const isPageVisible = useVisibilityControl();
  const mousePosition = useOptimizedMousePosition();
  const threeSettings = getThreePerformanceSettings(deviceInfo);
  
  // Control rendering based on visibility
  const shouldRender = hasBeenInView && isInView && isPageVisible;
  
  // Smooth scroll function with ease-in-out
  const smoothScrollTo = throttle((targetId: string) => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1500; // 1.5 seconds
    let start: number | null = null;

    // Ease-in-out cubic function
    const easeInOutCubic = (t: number): number => {
      return t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animation = (currentTime: number) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);
      
      window.scrollTo(0, startPosition + distance * ease);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }, 100); // Throttle scroll calls

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0C1816] gpu-accelerated"
    >
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('https://kldpzpnipovkkwzvstrm.supabase.co/storage/v1/object/sign/photos/_R655433.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OGMwZGRhNC1iYWNkLTQzMGYtOWVkOC1iNzY3YzU1NDM5YzMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaG90b3MvX1I2NTU0MzMuanBnIiwiaWF0IjoxNzU4NzY1Mzc1LCJleHAiOjE3OTAzMDEzNzV9.hhiKdRf-H2t5XPjSS3Qn3wqJ183rfUqkvbbtDW5Kpsw')",
          backgroundPosition: 'left -15rem center',
        }}
      />
      <style jsx>{`
        @media (min-width: 768px) {
          div {
            background-position: -10rem center !important;
          }
        }
      `}</style>

      {/* 3D Canvas Background - Performance Optimized */}
      <div 
        ref={canvasRef}
        className="absolute inset-0 mix-blend-screen gpu-canvas"
      >
        <ClientOnly fallback={<div className="w-full h-full bg-gradient-to-b from-emerald-950 to-[#0C1816]" />}>
          {shouldRender && (
            <Suspense fallback={<div className="w-full h-full bg-gradient-to-b from-emerald-950 to-[#0C1816]" />}>
              <Canvas
                camera={{ position: [0, 1, 8], fov: 60 }}
                dpr={threeSettings.dpr as [number, number]}
                frameloop={shouldRender ? threeSettings.frameloop : 'never'}
                className="w-full h-full"
                gl={{ 
                  antialias: threeSettings.antialias,
                  powerPreference: "high-performance",
                  alpha: false,
                  stencil: false,
                  depth: true
                }}
              >
              <fog attach="fog" args={['#0C1816', 5, 30]} />
              
                <ambientLight intensity={0.2} />
                <directionalLight position={[10, 10, 5]} intensity={0.5} castShadow={threeSettings.shadows} />
                <directionalLight position={[-10, -10, -5]} intensity={0.2} />
                
                <ParticleField count={threeSettings.particles * 20} isMobile={deviceInfo.isMobile} />
                {!deviceInfo.isMobile && <FloatingShapes />}
              
              <CameraController />
              <Environment preset="city" />
              </Canvas>
            </Suspense>
          )}
        </ClientOnly>
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <div className="w-full flex justify-center md:justify-end">
          <motion.div
            className="w-full md:w-[65%] lg:w-[60%] text-center md:text-right"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-white">Build Your Startup from </span>
            <motion.span
              className="inline-block relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <motion.span
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600"
                initial={{ y: '100%', opacity: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: 1,
                }}
                transition={{ 
                  duration: 1.2, 
                  delay: 1.3, 
                  ease: "easeIn",
                }}
              >
                Zero to One
              </motion.span>
            </motion.span>
          </h1>
          
          <p className="text-xl md:text-2xl text-emerald-200 mb-8 max-w-3xl mx-auto">
            Leverage AI to 10× your workflows, ship a full-stack AI product, and monetize your personal brand to attract brand deals and clients — in 6 weeks.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
            <motion.button
              onClick={() => smoothScrollTo('offers')}
              className="px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
              style={{ backgroundColor: '#AE9370' }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(174, 147, 112, 0.5)' }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-emerald-900">View Offers</span>
            </motion.button>
            
            <motion.button
              onClick={() => smoothScrollTo('vsl')}
              className="px-8 py-4 bg-transparent text-emerald-300 border-2 border-emerald-600 rounded-lg font-semibold text-lg hover:bg-emerald-900/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Watch Video
            </motion.button>
          </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-emerald-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-emerald-400 rounded-full mt-2" />
          </div>
        </motion.div>
      </div>
      
      {/* Gradient Overlays */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0C1816] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0C1816] via-transparent to-transparent pointer-events-none" />
    </section>
  );
}
