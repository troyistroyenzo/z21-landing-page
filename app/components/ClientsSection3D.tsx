'use client';

import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Image as DreiImage } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import ClientOnly from './ClientOnly';
import { useIsMobile } from './3d/MouseTracker3D';

// 3D Logo Card with actual images - ENHANCED VERSION
function LogoCard3D({ 
  client, 
  index, 
  position, 
  isMobile 
}: { 
  client: { name: string; logoUrl: string; alt: string };
  index: number;
  position: [number, number, number];
  isMobile: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const orbitAngleRef = useRef(0);
  const hoverTimeRef = useRef(0);
  
  useFrame((state, delta) => {
    if (!groupRef.current || isMobile) return;
    
    // Gentle floating animation
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index) * 0.15;
    
    // Orbiting animation on hover with easing
    if (hovered) {
  hoverTimeRef.current = Math.min(hoverTimeRef.current + delta, 1);
      // Full 360° orbit in 2 seconds
      orbitAngleRef.current = (state.clock.elapsedTime * Math.PI) % (Math.PI * 2);
      groupRef.current.rotation.y = orbitAngleRef.current * 0.5;
      
      // Lift forward on Z-axis
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 0.8, 0.1);
      
      // Scale up slightly
      const targetScale = 1.08;
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1)
      );
    } else {
      hoverTimeRef.current = Math.max(hoverTimeRef.current - delta, 0);
      
      // Return to original position smoothly
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.1);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 0, 0.1);
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.scale.x, 1, 0.1)
      );
    }
  });
  
  return (
    <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.3}>
      <group 
        ref={groupRef} 
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Card Background - BIGGER */}
        <RoundedBox args={[5, 3, 0.15]} radius={0.15} smoothness={4}>
          <meshStandardMaterial
            color="#ffffff"
            emissive={hovered ? '#10b981' : '#ffffff'}
            emissiveIntensity={hovered ? 0.3 : 0.02}
            metalness={0.15}
            roughness={0.85}
            transparent
            opacity={1}
          />
        </RoundedBox>
        
        {/* Border glow effect - ENHANCED */}
        <RoundedBox 
          args={[5.1, 3.1, 0.12]} 
          radius={0.15} 
          smoothness={4}
          position={[0, 0, -0.08]}
        >
          <meshBasicMaterial
            color={hovered ? '#10b981' : '#AE9370'}
            transparent
            opacity={hovered ? 0.5 : 0.15}
          />
        </RoundedBox>
        
        {/* Outer glow ring when hovered */}
        {hovered && (
          <RoundedBox 
            args={[5.3, 3.3, 0.08]} 
            radius={0.18} 
            smoothness={4}
            position={[0, 0, -0.12]}
          >
            <meshBasicMaterial
              color="#10b981"
              transparent
              opacity={0.2}
            />
          </RoundedBox>
        )}
        
        {/* Logo Image - BIGGER with padding to prevent cutting */}
        <DreiImage
          url={client.logoUrl}
          position={[0, 0, 0.08]}
          scale={[4.2, 2.4]}
          transparent
        />
      </group>
    </Float>
  );
}

// Grid of Logo Cards - BETTER SPACING
function LogoGrid({ clients, isMobile }: { 
  clients: { name: string; logoUrl: string; alt: string }[];
  isMobile: boolean;
}) {
  // Increased spacing for bigger cards
  const positions: [number, number, number][] = isMobile 
    ? [[0, 3, 0], [0, 0, 0], [0, -3, 0], [0, -6, 0]]
    : [[-5.5, 1.5, 0], [5.5, 1.5, 0], [-5.5, -2, 0], [5.5, -2, 0]];
  
  return (
    <>
      {clients.slice(0, 4).map((client, index) => (
        <LogoCard3D
          key={index}
          client={client}
          index={index}
          position={positions[index] || [0, 0, 0]}
          isMobile={isMobile}
        />
      ))}
    </>
  );
}

// Enhanced background elements
function BackgroundElements() {
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.03;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
    
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });
  
  // Create particle positions
  const particleCount = 50;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
  }
  
  return (
    <>
      {/* Rotating ring */}
      <mesh ref={meshRef} position={[0, 0, -6]}>
        <torusGeometry args={[10, 0.08, 16, 100]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.08} />
      </mesh>
      
      {/* Floating particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#10b981"
          transparent
          opacity={0.15}
          sizeAttenuation
        />
      </points>
    </>
  );
}

export default function ClientsSection3D() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Using actual client logos
  const clients = [
    {
      name: "Client Logo 1",
      logoUrl: "https://cdn.prod.website-files.com/682e5f308475223abbd39258/682e5f308475223abbd392b1_logo%2520(8)-p-500.png",
      alt: "Client 1 Logo"
    },
    {
      name: "GetFound",
      logoUrl: "https://media.licdn.com/dms/image/v2/D560BAQHAE9Z9LT8KHA/company-logo_200_200/B56ZgdOuQPIAAM-/0/1752837056018/getfound_id_logo?e=1762992000&v=beta&t=0JhJa-sV--6_UQPNdxi1vbXLuV_Ngw1vScqZuTkxMXk",
      alt: "GetFound Logo"
    },
    // Add more placeholder clients
  ];

  const testimonials = [
    {
      quote: "Z21 helped us go from AI pilots to production workflows in weeks, not months.",
      author: "Sarah Chen",
      role: "VP Product, TechCorp"
    },
    {
      quote: "The human-in-the-loop approach made AI adoption actually stick with our team.",
      author: "Marcus Johnson", 
      role: "Founder, StartupX"
    },
    {
      quote: "Finally, AI implementation that delivers real ROI, not just promises.",
      author: "Elena Rodriguez",
      role: "COO, ScaleUp Inc"
    }
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
            Trusted By Leaders
          </h2>
          <p className="text-xl text-emerald-200 max-w-3xl mx-auto">
            Join companies that have transformed their workflows with Z21
          </p>
        </motion.div>

        {/* 3D Logo Grid - ENHANCED */}
        <div ref={canvasRef} className="h-[500px] md:h-[550px] mb-16 rounded-2xl overflow-hidden bg-white shadow-2xl">
          <ClientOnly fallback={
            <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
              <div className="text-emerald-400">Loading clients...</div>
            </div>
          }>
            <Suspense fallback={null}>
              <Canvas
                camera={{ position: [0, 0, 14], fov: 50 }}
                dpr={[1, 2]}
                className="w-full h-full"
                gl={{ alpha: true, antialias: true }}
              >
                {/* Better lighting for clarity */}
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 5]} intensity={0.6} color="#ffffff" castShadow />
                <directionalLight position={[-10, -10, -5]} intensity={0.4} color="#10b981" />
                <spotLight position={[0, 10, 0]} intensity={0.3} angle={0.6} penumbra={1} color="#ffffff" />
                
                <BackgroundElements />
                <LogoGrid
                  clients={clients}
                  isMobile={isMobile}
                />
                
              </Canvas>
            </Suspense>
          </ClientOnly>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-black/40 backdrop-blur-sm border border-emerald-900/30 rounded-xl p-6"
              whileHover={{ y: -5, borderColor: 'rgb(16 185 129 / 0.5)' }}
            >
              <div className="text-emerald-400 text-3xl mb-4">&quot;</div>
              <p className="text-gray-300 mb-6 italic">{testimonial.quote}</p>
              <div>
                <p className="text-white font-semibold">{testimonial.author}</p>
                <p className="text-emerald-200 text-sm">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
