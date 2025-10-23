'use client';

import React, { useRef, Suspense } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import ClientOnly from '../ClientOnly';

// 3D Timeline Node
function TimelineNode({ 
  position, 
  index,
  isActive 
}: { 
  position: [number, number, number];
  index: number;
  isActive: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    const scale = isActive ? 1.5 : 1;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[0.3]} />
        <meshStandardMaterial
          color={isActive ? "#10b981" : "#AE9370"}
          emissive={isActive ? "#10b981" : "#AE9370"}
          emissiveIntensity={isActive ? 0.5 : 0.2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
}

// Timeline Connection Line
function TimelinePath({ progress }: { progress: number }) {
  const points = [
    new THREE.Vector3(-4, 2, 0),
    new THREE.Vector3(-2, 1.5, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(2, 0.5, 0),
    new THREE.Vector3(4, 0, 0),
    new THREE.Vector3(6, -0.5, 0),
  ];

  return (
    <Line
      points={points}
      color="#10b981"
      lineWidth={2}
      dashed={false}
      opacity={0.5}
    />
  );
}

// Curriculum Step Card
function CurriculumStep({ 
  step, 
  index, 
  scrollProgress,
  onInView 
}: { 
  step: {
    title: string;
    subtitle: string;
    items: string[];
    duration: string;
  };
  index: number;
  scrollProgress: MotionValue<number>;
  onInView: (index: number) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  
  const opacity = useTransform(
    scrollProgress,
    [index * 0.15, (index + 1) * 0.15],
    [0.3, 1]
  );
  
  const scale = useTransform(
    scrollProgress,
    [index * 0.15, (index + 1) * 0.15],
    [0.9, 1]
  );

  const x = useTransform(
    scrollProgress,
    [index * 0.15, (index + 1) * 0.15],
    [index % 2 === 0 ? -50 : 50, 0]
  );
  
  // Track when this card is in center viewport
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            onInView(index);
          }
        });
      },
      {
        threshold: [0.3, 0.5, 0.7],
        rootMargin: '-40% 0px -40% 0px' // Center 20% of viewport
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index, onInView]);

  return (
    <motion.div
      ref={cardRef}
      style={{ 
        opacity, 
        scale, 
        x,
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 backdrop-blur-sm border border-emerald-700/30 rounded-2xl p-6 md:p-8 h-full"
        style={{
          transformStyle: "preserve-3d"
        }}
        animate={{
          z: isHovered ? 50 : index * 10,
          borderColor: isHovered ? 'rgba(16, 185, 129, 0.6)' : 'rgba(16, 185, 129, 0.2)',
          boxShadow: isHovered ? '0 20px 40px rgba(16, 185, 129, 0.3)' : '0 0 0 rgba(16, 185, 129, 0)'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Step Number */}
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {index + 1}
        </div>

        {/* Duration Badge */}
        <div className="inline-block px-3 py-1 bg-emerald-800/30 border border-emerald-600/30 rounded-full text-xs text-emerald-300 mb-4">
          {step.duration}
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
        <p className="text-emerald-300 mb-4">{step.subtitle}</p>
        
        <ul className="space-y-2">
          {step.items.map((item, i) => (
            <li key={i} className="flex items-start text-gray-300">
              <span className="text-emerald-500 mr-2 mt-1">•</span>
              <span className="flex-1">{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

export default function B2BCurriculumSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const [activeNode, setActiveNode] = React.useState(0);

  const handleCardInView = React.useCallback((index: number) => {
    setActiveNode(index);
  }, []);

  const curriculum = [
    {
      title: "Mindset Reset",
      subtitle: "AI as leverage; limits; safety; human-in-the-loop",
      duration: "90 minutes",
      items: [
        "Understanding AI as a force multiplier",
        "Recognizing limitations and safety considerations",
        "Human-in-the-loop decision frameworks"
      ]
    },
    {
      title: "Prompt Engineering That Works",
      subtitle: "TCREI, RSTI, chain-of-thought, eval loops",
      duration: "2 hours",
      items: [
        "TCREI framework for structured prompts",
        "RSTI methodology for consistent outputs",
        "Chain-of-thought reasoning techniques",
        "Building evaluation loops"
      ]
    },
    {
      title: "Quick Wins (Hands-on)",
      subtitle: "2–3 role-specific wins per department",
      duration: "3 hours",
      items: [
        "Department-specific use cases",
        "Immediate productivity gains",
        "Template creation and customization"
      ]
    },
    {
      title: "Prompts → Workflows",
      subtitle: "Convert prompts to SOPs",
      duration: "2 hours",
      items: [
        "Inputs → Steps → Checks → Outputs → Owner",
        "Building repeatable processes",
        "Quality assurance checkpoints"
      ]
    },
    {
      title: "Capstone Build (Pods)",
      subtitle: "Ship a mini-GPT or n8n automation",
      duration: "3 hours",
      items: [
        "Team pods for collaborative building",
        "Guardrails and testing protocols",
        "Ownership and adoption planning"
      ]
    },
    {
      title: "Impact & Adoption",
      subtitle: "Stand up the 30-day scoreboard",
      duration: "1 hour",
      items: [
        "Metrics dashboard setup",
        "Owner assignment",
        "Weekly wins cadence establishment"
      ]
    }
  ];

  return (
    <section ref={sectionRef} className="relative py-16 md:py-32 overflow-hidden min-h-screen">
      {/* 3D Timeline Background */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        <ClientOnly fallback={null}>
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 8], fov: 50 }}
              className="!absolute inset-0"
              dpr={[1, 1.5]}
              gl={{ 
                antialias: false,
                powerPreference: "high-performance"
              }}
            >
              <ambientLight intensity={0.3} />
              <directionalLight position={[10, 10, 5]} intensity={0.5} />
              
              <TimelinePath progress={0} />
              {[...Array(6)].map((_, i) => (
                <TimelineNode
                  key={i}
                  position={[
                    -4 + (i * 2),
                    2 - (i * 0.5),
                    0
                  ]}
                  index={i}
                  isActive={i === activeNode}
                />
              ))}
            </Canvas>
          </Suspense>
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
            What You Get
          </h2>
          <p className="text-2xl text-emerald-300 font-medium">
            Curriculum (1–2 days, IRL or Zoom, PH time)
          </p>
        </motion.div>

        {/* Curriculum Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {curriculum.map((step, index) => (
            <CurriculumStep
              key={index}
              step={step}
              index={index}
              scrollProgress={scrollYProgress}
              onInView={handleCardInView}
            />
          ))}
        </div>

        {/* Takeaways Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 md:mt-24 p-6 md:p-8 bg-gradient-to-br from-emerald-900/20 to-transparent backdrop-blur-sm border border-emerald-700/30 rounded-2xl"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">Same-Day Takeaways</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xl font-semibold text-emerald-400 mb-3">Deliverables</h4>
              <ul className="space-y-2 text-gray-300">
                <li>📚 Prompt Playbook (TCREI / RSTI / CoT) tailored to each dept</li>
                <li>📋 Workflow SOPs for your 2–3 shipped loops</li>
                <li>🎯 Capstone blueprint (mini-GPT or n8n)</li>
                <li>📊 Impact Scoreboard template</li>
                <li>🎥 Recording (if virtual) + 30-day office hour</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-emerald-400 mb-3">Tool Stack</h4>
              <p className="text-gray-300 mb-3">We work with your existing tools:</p>
              <div className="flex flex-wrap gap-2">
                {['GPT', 'Claude', 'n8n', 'Cline', 'Lovable', 'Notion', 'Google Suite', 'MS Suite', 'Slack', 'HubSpot'].map((tool) => (
                  <span key={tool} className="px-3 py-1 bg-emerald-800/20 border border-emerald-600/30 rounded-full text-sm text-emerald-300">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0C1816]/30 to-transparent pointer-events-none" />
    </section>
  );
}
