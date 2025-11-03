'use client';

import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { roadmapMilestones } from '@/app/content/roadmap';
import * as THREE from 'three';

// Simplified 3D Rocket Component
function Rocket3D({ scrollProgress }: { scrollProgress: number }) {
  const rocketRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!rocketRef.current) return;
    
    rocketRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1;
    rocketRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    
    const yPos = THREE.MathUtils.lerp(2, -2, scrollProgress);
    rocketRef.current.position.y = yPos;
  });

  return (
    <group ref={rocketRef} position={[0, 0, 0]}>
      <mesh>
        <coneGeometry args={[0.3, 1, 8]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, -0.6, 0]}>
        <coneGeometry args={[0.15, 0.4, 8]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1} />
      </mesh>
      <mesh position={[0.2, -0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.3, 0.05, 0.05]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
      <mesh position={[-0.2, -0.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.3, 0.05, 0.05]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
      <pointLight position={[0, -0.6, 0]} intensity={1} distance={3} color="#f59e0b" />
    </group>
  );
}

export default function RoadmapTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setScrollProgress(latest);
    });
  }, [scrollYProgress]);

  return (
    <section ref={sectionRef} className="relative py-24 bg-black overflow-hidden">
      {/* Single Three.js Canvas for Rocket */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-96 pointer-events-none hidden lg:block">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Rocket3D scrollProgress={scrollProgress} />
          </Suspense>
        </Canvas>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            The Z21 Roadmap
          </motion.h2>
          <motion.p 
            className="text-xl text-zinc-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Our vision for transforming how founders and teams integrate AI
          </motion.p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Line with Progress */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-green-500 via-blue-500 to-purple-500"
              style={{ 
                height: useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
              }}
            />
          </div>

          {/* Milestones */}
          <div className="relative space-y-32">
            {roadmapMilestones.map((milestone, index) => (
              <MilestoneCard3D
                key={milestone.id}
                milestone={milestone}
                index={index}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MilestoneCard3D({ milestone, index, isLeft }: { milestone: any; index: number; isLeft: boolean }) {
  const ref = useRef(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setRotateY((x - 0.5) * 20);
    setRotateX((y - 0.5) * -20);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return { bg: 'from-green-500 to-emerald-600', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.6)]' };
      case 'upcoming': return { bg: 'from-blue-500 to-blue-600', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.5)]' };
      case 'planned': return { bg: 'from-purple-500 to-purple-600', glow: 'shadow-[0_0_30px_rgba(139,92,246,0.4)]' };
      case 'future': return { bg: 'from-zinc-600 to-zinc-700', glow: '' };
      default: return { bg: 'from-zinc-700 to-zinc-800', glow: '' };
    }
  };

  const colors = getStatusColor(milestone.status);

  return (
    <motion.div
      ref={ref}
      className="relative flex items-center"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.15,
        type: "spring",
        bounce: 0.3
      }}
    >
      {/* CSS 3D Icon (No Canvas) */}
      <motion.div 
        className="absolute left-1/2 transform -translate-x-1/2 z-20"
        initial={{ scale: 0, rotate: -180 }}
        animate={isInView ? { scale: 1, rotate: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.15 + 0.3, type: "spring" }}
      >
        <motion.div
          className={`w-20 h-20 rounded-full bg-gradient-to-br ${colors.bg} 
            flex items-center justify-center shadow-2xl ${colors.glow}
            border-4 border-black
            ${milestone.status === 'active' ? 'animate-pulse' : ''}`}
          whileHover={{ scale: 1.2, rotate: 360 }}
          animate={{ 
            rotateY: [0, 360],
            rotateZ: milestone.status === 'active' ? [0, 5, -5, 0] : 0
          }}
          transition={{ 
            rotateY: { duration: 6, repeat: Infinity, ease: "linear" },
            rotateZ: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            scale: { type: "spring", stiffness: 300 }
          }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <span className="text-4xl">{milestone.icon}</span>
        </motion.div>
      </motion.div>

      {/* CSS 3D Card (No Canvas) */}
      <motion.div
        ref={cardRef}
        className={`w-full md:w-[35%] ${isLeft ? 'md:mr-auto md:text-right' : 'md:ml-auto md:text-left'}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: 1000 }}
      >
        <motion.div 
          className="relative p-8 rounded-2xl overflow-hidden"
          style={{
            transformStyle: 'preserve-3d',
            rotateX,
            rotateY,
          }}
          animate={{
            rotateX,
            rotateY,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Card Background with CSS Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl rounded-2xl
            border border-zinc-800/50 transition-all`}
            style={{
              boxShadow: `0 20px 60px rgba(0,0,0,0.3), inset 0 0 30px ${
                milestone.status === 'active' ? 'rgba(16,185,129,0.1)' :
                milestone.status === 'upcoming' ? 'rgba(59,130,246,0.1)' :
                milestone.status === 'planned' ? 'rgba(139,92,246,0.1)' : 'rgba(0,0,0,0.1)'
              }`
            }}
          />

          {/* Content */}
          <div className="relative z-10 p-8">
            {/* Connection Line */}
            <motion.div 
              className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r
                ${isLeft ? 'right-0 translate-x-full from-zinc-700 to-transparent' : 'left-0 -translate-x-full from-transparent to-zinc-700'}`}
              style={{ width: '5rem' }}
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ delay: index * 0.15 + 0.5, duration: 0.5 }}
            />

            {/* Phase Badge */}
            <motion.div 
              className={`inline-flex items-center gap-2 mb-4 ${isLeft ? 'md:flex-row-reverse' : ''}`}
              initial={{ opacity: 0, x: isLeft ? 20 : -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.15 + 0.4 }}
            >
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm
                ${milestone.status === 'active' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                  milestone.status === 'upcoming' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                  milestone.status === 'planned' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                  'bg-zinc-700/50 text-zinc-400 border border-zinc-700/30'}`}>
                {milestone.phase}
              </span>
              <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
                {milestone.status}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h3 
              className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15 + 0.5 }}
            >
              {milestone.title}
            </motion.h3>

            {/* Description */}
            <motion.p 
              className="text-zinc-400 mb-6 text-base leading-relaxed"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: index * 0.15 + 0.6 }}
            >
              {milestone.description}
            </motion.p>

            {/* Details */}
            {milestone.details && (
              <ul className={`space-y-2 ${isLeft ? 'md:text-right' : ''}`}>
                {milestone.details.map((detail: string, idx: number) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: isLeft ? 20 : -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: index * 0.15 + 0.7 + idx * 0.1 }}
                    className={`flex items-center gap-3 text-sm text-zinc-500 ${isLeft ? 'md:flex-row-reverse' : ''}`}
                  >
                    <motion.span 
                      className="w-2 h-2 bg-accent rounded-full flex-shrink-0"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 2, delay: idx * 0.3 }}
                    />
                    {detail}
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
