'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import ClientOnly from '../ClientOnly';

// 3D Icon for each promise card
function FloatingIcon({ type, position }: { type: 'box' | 'sphere', position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        {type === 'box' ? (
          <boxGeometry args={[0.8, 0.8, 0.8]} />
        ) : (
          <sphereGeometry args={[0.5, 16, 16]} />
        )}
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
          wireframe
        />
      </mesh>
    </Float>
  );
}

// Promise Card Component with glassmorphism
function PromiseCard({ 
  title, 
  description, 
  icon, 
  delay, 
  index 
}: { 
  title: string; 
  description: string; 
  icon: string; 
  delay: number; 
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [80 * (index % 2 === 0 ? 1 : -1), -80 * (index % 2 === 0 ? 1 : -1)]
  );

  // Different Z-axis positions for each card
  const baseZ = (index % 2 === 0 ? index * 20 : -index * 15);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      style={{ 
        y,
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative p-8 rounded-2xl overflow-hidden h-full"
        style={{
          background: 'rgba(16, 185, 129, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          transformStyle: "preserve-3d"
        }}
        animate={{
          z: isHovered ? 60 : baseZ,
          scale: isHovered ? 1.03 : 1,
          borderColor: isHovered ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.2)',
          boxShadow: isHovered ? '0 25px 50px rgba(16, 185, 129, 0.3)' : '0 0 0 rgba(16, 185, 129, 0)'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-500/10" />
        </div>

        {/* Icon */}
        <div className="text-4xl mb-4">{icon}</div>
        
        {/* Content */}
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-300 leading-relaxed">{description}</p>
        
        {/* Decorative element */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-3xl" />
      </motion.div>
    </motion.div>
  );
}

export default function B2BPromiseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const promises = [
    {
      icon: "🚀",
      title: "Repeatable SOPs",
      description: "Turn ad-hoc prompting into repeatable SOPs your team runs every week."
    },
    {
      icon: "🛡️",
      title: "Human-in-the-Loop Guardrails",
      description: "Install human-in-the-loop guardrails for accuracy, tone, and approvals."
    },
    {
      icon: "📊",
      title: "Measurable ROI in 30 Days",
      description: "Measure ROI in 30 days (hours saved, cost efficiency, error reduction, consistency, compliance)."
    },
    {
      icon: "⚡",
      title: "Production-Ready Capstone",
      description: "Ship one capstone your team can reuse: mini-GPT or n8n workflow."
    }
  ];

  return (
    <section ref={sectionRef} className="relative py-16 md:py-32 overflow-hidden">
      {/* 3D Background Elements */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        <ClientOnly fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              className="!absolute inset-0"
              dpr={[1, 1.5]}
              gl={{ 
                antialias: false,
                powerPreference: "high-performance"
              }}
            >
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 5]} intensity={0.3} />
            <FloatingIcon type="box" position={[-3, 2, -2]} />
            <FloatingIcon type="sphere" position={[3, -2, -2]} />
            <FloatingIcon type="box" position={[0, 0, -3]} />
          </Canvas>
        </ClientOnly>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6">
            The Promise
          </h2>
          <p className="text-2xl text-emerald-300 font-medium">
            Dream Outcome, Fast
          </p>
        </motion.div>

        {/* Promise Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {promises.map((promise, index) => (
            <PromiseCard
              key={index}
              title={promise.title}
              description={promise.description}
              icon={promise.icon}
              delay={index * 0.1}
              index={index}
            />
          ))}
        </div>

        {/* Bottom accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 text-center"
        >
          <div className="inline-block">
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto" />
          </div>
        </motion.div>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0C1816]/50 to-transparent pointer-events-none" />
    </section>
  );
}
