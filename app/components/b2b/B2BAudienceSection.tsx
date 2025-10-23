'use client';

import React, { useRef, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';
import ClientOnly from '../ClientOnly';

// 3D Department Icon
function DepartmentIcon3D({ 
  type, 
  position, 
  color 
}: { 
  type: 'product' | 'marketing' | 'sales' | 'leadership' | 'startup';
  position: [number, number, number];
  color: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3;
  });

  const getGeometry = () => {
    switch(type) {
      case 'product':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'marketing':
        return <octahedronGeometry args={[0.8]} />;
      case 'sales':
        return <coneGeometry args={[0.7, 1.2, 8]} />;
      case 'leadership':
        return <dodecahedronGeometry args={[0.8]} />;
      case 'startup':
        return <tetrahedronGeometry args={[1]} />;
      default:
        return <sphereGeometry args={[0.7, 16, 16]} />;
    }
  };

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef} position={position}>
        <mesh>
          {getGeometry()}
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Department Card
function DepartmentCard({ 
  title, 
  subtitle, 
  items, 
  delay, 
  index 
}: { 
  title: string;
  subtitle: string;
  items: string[];
  delay: number;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [20, 0, -20]);

  // Staggered Z-axis positioning
  const baseZ = (index % 3) * 25;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      style={{ 
        scale,
        perspective: 1000,
        transformStyle: "preserve-3d"
      }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative p-6 md:p-8 rounded-2xl h-full"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, rgba(174, 147, 112, 0.03) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(16, 185, 129, 0.15)',
          rotateX,
          transformStyle: "preserve-3d"
        }}
        animate={{
          z: isHovered ? 50 : baseZ,
          borderColor: isHovered ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.15)',
          boxShadow: isHovered ? '0 20px 40px rgba(16, 185, 129, 0.3)' : '0 0 0 rgba(16, 185, 129, 0)'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Department Title */}
        <h3 className="text-2xl font-bold text-emerald-400 mb-2">{title}</h3>
        <p className="text-gray-400 mb-4">{subtitle}</p>
        
        {/* Feature List */}
        <ul className="space-y-2">
          {items.map((item, i) => (
            <motion.li 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + i * 0.1 }}
              className="flex items-center text-gray-300"
            >
              <span className="text-emerald-500 mr-2">→</span>
              {item}
            </motion.li>
          ))}
        </ul>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>
    </motion.div>
  );
}

export default function B2BAudienceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const sceneRotation = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 2]);

  const departments = [
    {
      title: "Product",
      subtitle: "vibe-coding MVPs & feature deployment",
      items: [
        "Vibe-coding MVPs in Lovable/Cline",
        "Feature deployment assistance",
        "PRD/release-notes automation"
      ]
    },
    {
      title: "Marketing",
      subtitle: "internal tools & content systems",
      items: [
        "Copyright-safe ideation workflows",
        "Custom GPTs for briefs/repurposing",
        "Internal content tools"
      ]
    },
    {
      title: "Sales",
      subtitle: "inbox co-authoring & lead automation",
      items: [
        "Inbox co-authoring systems",
        "Lead triage automation",
        "Follow-up sequence builders"
      ]
    },
    {
      title: "Leadership / Community",
      subtitle: "cadence, comms & reporting",
      items: [
        "Communication leverage systems",
        "Reporting & scoreboards",
        "Cadence management"
      ]
    },
    {
      title: "Lean Startup 101",
      subtitle: "zero→one culture & quick tests",
      items: [
        "Zero→one culture building",
        "Quick test frameworks",
        "Useful constraints implementation"
      ]
    }
  ];

  return (
    <section ref={sectionRef} className="relative py-16 md:py-32 overflow-hidden">
      {/* 3D Background Scene */}
      <div className="absolute inset-0 pointer-events-none">
        <ClientOnly fallback={null}>
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 10], fov: 50 }}
              className="!absolute inset-0"
              dpr={[1, 1.5]}
              gl={{ 
                antialias: false,
                powerPreference: "high-performance"
              }}
            >
              <ambientLight intensity={0.2} />
              <directionalLight position={[10, 10, 5]} intensity={0.3} />
              
              <group rotation-y={sceneRotation}>
                <DepartmentIcon3D type="product" position={[-4, 2, -3]} color="#10b981" />
                <DepartmentIcon3D type="marketing" position={[4, 1, -3]} color="#AE9370" />
                <DepartmentIcon3D type="sales" position={[-3, -2, -3]} color="#10b981" />
                <DepartmentIcon3D type="leadership" position={[3, -1, -3]} color="#AE9370" />
                <DepartmentIcon3D type="startup" position={[0, 3, -4]} color="#10b981" />
              </group>
            </Canvas>
          </Suspense>
        </ClientOnly>
      </div>

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
            Who It's For
          </h2>
          <p className="text-2xl text-emerald-300 font-medium max-w-3xl mx-auto">
            Tailored enablement for every department
          </p>
        </motion.div>

        {/* Department Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {departments.map((dept, index) => (
            <DepartmentCard
              key={index}
              title={dept.title}
              subtitle={dept.subtitle}
              items={dept.items}
              delay={index * 0.1}
              index={index}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 text-center"
        >
          <p className="text-xl text-gray-300 mb-2">
            No matter your department, we'll build workflows that work
          </p>
          <p className="text-lg text-emerald-400">
            Customized for your team's specific needs and tools
          </p>
        </motion.div>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0C1816]/20 via-transparent to-[#0C1816]/20 pointer-events-none" />
    </section>
  );
}
