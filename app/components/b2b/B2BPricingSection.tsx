'use client';

import React, { useRef, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import ClientOnly from '../ClientOnly';

// 3D Pricing Card
function PricingCard3D({ 
  position, 
  rotation,
  color,
  scrollProgress
}: { 
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  scrollProgress: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    meshRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    meshRef.current.position.z = position[2] + scrollProgress * 2;
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position} rotation={rotation}>
        <RoundedBox args={[2, 3, 0.2]} radius={0.1} smoothness={4}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.2}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.3}
          />
        </RoundedBox>
      </mesh>
    </Float>
  );
}

// Pricing Tier Component
function PricingTier({ 
  tier,
  featured = false,
  delay
}: {
  tier: {
    name: string;
    size: string;
    duration: string;
    deliverables: string[];
    price: string;
    location: string;
    badge?: string;
  };
  featured?: boolean;
  delay: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 100, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      className="relative h-full"
    >
      <motion.div
        className={`relative h-full p-8 rounded-2xl ${
          featured 
            ? 'bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border-2 border-emerald-400' 
            : 'bg-gradient-to-br from-emerald-900/20 to-transparent border border-emerald-700/30'
        } backdrop-blur-sm`}
        whileHover={{ 
          scale: 1.05,
          borderColor: featured ? 'rgba(16, 185, 129, 0.8)' : 'rgba(16, 185, 129, 0.5)',
          boxShadow: '0 0 40px rgba(16, 185, 129, 0.3)'
        }}
        style={{
          transformStyle: "preserve-3d"
        }}
      >
        {/* Badge */}
        {tier.badge && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="px-4 py-1 bg-emerald-500 text-emerald-900 text-sm font-bold rounded-full">
              {tier.badge}
            </span>
          </div>
        )}
        
        {/* Tier Name */}
        <div className="mb-6">
          <h3 className="text-3xl font-bold text-white mb-2">{tier.name}</h3>
          <p className="text-emerald-300">{tier.size}</p>
        </div>
        
        {/* Duration */}
        <div className="mb-6">
          <p className="text-gray-400 text-sm">Duration</p>
          <p className="text-xl text-white font-semibold">{tier.duration}</p>
        </div>
        
        {/* Deliverables */}
        <div className="mb-8">
          <p className="text-gray-400 text-sm mb-3">What's Included</p>
          <ul className="space-y-3">
            {tier.deliverables.map((item, i) => (
              <li key={i} className="flex items-start text-gray-300">
                <span className="text-emerald-500 mr-2">✓</span>
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Pricing */}
        <div className="mt-auto pt-6 border-t border-emerald-700/30">
          <div className="mb-3">
            <p className="text-gray-400 text-sm">{tier.location}</p>
            <p className="text-3xl font-bold text-white">
              {tier.price}
            </p>
          </div>
          
          <motion.button
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
              featured
                ? 'bg-emerald-500 text-emerald-900 hover:bg-emerald-400'
                : 'bg-emerald-900/30 text-emerald-300 border border-emerald-600/30 hover:bg-emerald-900/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function B2BPricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const [scrollProgress, setScrollProgress] = React.useState(0);
  
  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      setScrollProgress(value);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  const pricingTiers = [
    {
      name: "Starter",
      size: "up to 12 people",
      duration: "1 day",
      deliverables: [
        "2 quick-win workflows",
        "Impact scoreboard setup",
        "30-day office hour follow-up",
        "Prompt engineering basics",
        "Team activation plan"
      ],
      price: "₱65,000+",
      location: "Virtual starting at"
    },
    {
      name: "Growth",
      size: "13-30 people",
      duration: "2 days",
      deliverables: [
        "3 workflows + mini-GPT",
        "Department pods & capstone",
        "Leadership adoption plan",
        "30-day office hour follow-up",
        "Complete frameworks & resources",
        "Custom tool integration"
      ],
      price: "₱150,000+",
      location: "Virtual starting at",
      badge: "MOST POPULAR"
    },
    {
      name: "Enterprise",
      size: "31-80+ people",
      duration: "2 days + alignment",
      deliverables: [
        "3-5 workflows + mini-GPT",
        "Leadership alignment session",
        "Department-specific tracks",
        "Governance & compliance brief",
        "Multi-site support available",
        "Executive dashboard setup"
      ],
      price: "₱300,000+",
      location: "Custom quote starts at"
    }
  ];

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* 3D Background */}
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
              
              <PricingCard3D
                position={[-5, 2, -2]}
                rotation={[0, 0.3, 0.1]}
                color="#10b981"
                scrollProgress={scrollProgress}
              />
              <PricingCard3D
                position={[5, -1, -3]}
                rotation={[0, -0.3, -0.1]}
                color="#AE9370"
                scrollProgress={scrollProgress}
              />
              <PricingCard3D
                position={[0, 0, -5]}
                rotation={[0.1, 0, 0]}
                color="#10b981"
                scrollProgress={scrollProgress}
              />
            </Canvas>
          </Suspense>
        </ClientOnly>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Pricing
          </h2>
          <p className="text-2xl text-emerald-300 font-medium mb-4">
            By headcount — content is invaluable
          </p>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Final quote depends on headcount, on-site vs virtual, and travel coverage. 
            On-site outside Metro Manila requires covered travel (flights, hotel, ground).
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier, index) => (
            <PricingTier
              key={index}
              tier={tier}
              featured={index === 1}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid md:grid-cols-2 gap-8"
        >
          <div className="bg-emerald-900/20 backdrop-blur-sm border border-emerald-700/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">KPIs & Outcomes</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">📊</span>
                <span><strong>Operational:</strong> Hours saved, cost efficiency</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✅</span>
                <span><strong>Quality:</strong> Error reduction, consistency, compliance</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">🚀</span>
                <span><strong>Strategic:</strong> Employee satisfaction, customer experience, new capabilities</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-emerald-900/20 backdrop-blur-sm border border-emerald-700/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Billing & Terms</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">💳</span>
                <span><strong>Deposit:</strong> 100% to book dates (invoice upon scope sign-off)</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">🤝</span>
                <span><strong>DWY only:</strong> We co-build with your team (no DFY builds)</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">🔒</span>
                <span><strong>Data Policy:</strong> Masked examples, no PII, enterprise settings</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0C1816]/20 to-transparent pointer-events-none" />
    </section>
  );
}
