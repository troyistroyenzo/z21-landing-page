'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Float } from '@react-three/drei';
import * as THREE from 'three';
import ClientOnly from '../ClientOnly';

// 3D Code Block Visualization
function CodeBlockVisualization() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
      <group ref={groupRef}>
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[0, i * 0.3 - 0.6, 0]}>
            <boxGeometry args={[2, 0.1, 0.01]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#10b981" : "#AE9370"}
              emissive={i % 2 === 0 ? "#10b981" : "#AE9370"}
              emissiveIntensity={0.2}
              metalness={0.9}
              roughness={0.1}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// Case Study Card
function CaseStudyCard({ 
  study, 
  isActive 
}: { 
  study: {
    title: string;
    subtitle: string;
    description: string;
    workflow: string;
    results: string[];
    codeSnippet?: string;
  };
  isActive: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isActive ? 1 : 0.3, 
        scale: isActive ? 1 : 0.9 
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left: Case Study Details */}
        <div className="space-y-6">
          <div>
            <h3 className="text-3xl font-bold text-white mb-2">{study.title}</h3>
            <p className="text-emerald-400 text-lg">{study.subtitle}</p>
          </div>
          
          <p className="text-gray-300 text-lg leading-relaxed">{study.description}</p>
          
          <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-lg p-6">
            <h4 className="text-xl font-semibold text-emerald-400 mb-3">Workflow Built</h4>
            <p className="text-gray-300">{study.workflow}</p>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold text-emerald-400 mb-3">Results</h4>
            <ul className="space-y-2">
              {study.results.map((result, i) => (
                <li key={i} className="flex items-start text-gray-300">
                  <span className="text-emerald-500 mr-2 mt-1">✓</span>
                  <span>{result}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Right: Code Snippet or Visualization */}
        <div className="relative">
          {study.codeSnippet ? (
            <motion.div 
              className="bg-black/50 border border-emerald-700/30 rounded-lg p-6 font-mono text-sm overflow-x-auto"
              whileHover={{ borderColor: 'rgba(16, 185, 129, 0.5)' }}
            >
              <pre className="text-emerald-300">
                <code>{study.codeSnippet}</code>
              </pre>
            </motion.div>
          ) : (
            <div className="h-[400px] bg-gradient-to-br from-emerald-900/10 to-emerald-800/5 border border-emerald-700/20 rounded-lg overflow-hidden">
              <ClientOnly fallback={null}>
                <Canvas
                  camera={{ position: [0, 0, 5], fov: 50 }}
                  className="w-full h-full"
                >
                  <ambientLight intensity={0.3} />
                  <directionalLight position={[5, 5, 5]} intensity={0.5} />
                  <CodeBlockVisualization />
                </Canvas>
              </ClientOnly>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function B2BCaseStudiesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundRotation = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const caseStudies = [
    {
      title: "MVP in Lovable/Cline",
      subtitle: "Product Team - SaaS Startup",
      description: "Built a functional MVP for a project management tool in 2 hours using vibe-coding techniques. The team learned to leverage AI for rapid prototyping and feature iteration.",
      workflow: "Idea → Lovable prototype → Cline refinement → Production-ready code",
      results: [
        "2-hour MVP turnaround (vs 2 weeks traditional)",
        "70% reduction in development time",
        "Immediate user testing capability"
      ],
      codeSnippet: `// AI-Generated Component Structure
const TaskBoard = () => {
  const [tasks, setTasks] = useState([])
  const { draggedItem, handleDrop } = useDragDrop()
  
  return (
    <DragDropContext onDragEnd={handleDrop}>
      <Board tasks={tasks} />
    </DragDropContext>
  )
}`
    },
    {
      title: "n8n Email Automation",
      subtitle: "Sales Team - B2B Company",
      description: "Deployed an intelligent lead follow-up system that triages incoming emails, categorizes leads, and triggers personalized sequences based on engagement.",
      workflow: "Email intake → AI categorization → Personalized routing → Automated follow-up",
      results: [
        "85% reduction in response time",
        "3x increase in qualified leads",
        "40 hours/month saved on manual triage"
      ]
    },
    {
      title: "Custom GPT for Marketing",
      subtitle: "Marketing Team - E-commerce",
      description: "Created a custom GPT for generating on-brand content briefs, social media posts, and email campaigns with built-in compliance checks.",
      workflow: "Brand guidelines → Custom GPT → Content generation → Compliance review",
      results: [
        "10x faster content ideation",
        "100% brand compliance rate",
        "50% reduction in revision cycles"
      ],
      codeSnippet: `// Custom GPT Instructions
You are BrandVoice AI. Generate content that:
1. Follows our tone guide (friendly, professional)
2. Includes required disclaimers
3. Optimizes for our target KPIs
4. Passes compliance checks

Output format: JSON with content + metadata`
    },
    {
      title: "Ops Reporting Dashboard",
      subtitle: "Leadership Team - Tech Company",
      description: "Built an automated reporting system that aggregates data from multiple sources and generates executive dashboards with AI-powered insights.",
      workflow: "Data sources → n8n aggregation → AI analysis → Dashboard generation",
      results: [
        "Real-time KPI visibility",
        "8 hours/week saved on reporting",
        "Predictive trend analysis enabled"
      ]
    }
  ];

  const nextCase = () => {
    setActiveIndex((prev) => (prev + 1) % caseStudies.length);
  };

  const prevCase = () => {
    setActiveIndex((prev) => (prev - 1 + caseStudies.length) % caseStudies.length);
  };

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background Pattern */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        style={{ 
          rotate: backgroundRotation,
          backgroundImage: 'radial-gradient(circle at 2px 2px, #10b981 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Live Case Studies
          </h2>
          <p className="text-2xl text-emerald-300 font-medium">
            Real workflows we've shipped with teams
          </p>
        </motion.div>

        {/* Case Study Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <CaseStudyCard
              key={activeIndex}
              study={caseStudies[activeIndex]}
              isActive={true}
            />
          </AnimatePresence>
          
          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-12">
            <motion.button
              onClick={prevCase}
              className="p-3 rounded-lg bg-emerald-900/20 border border-emerald-700/30 text-emerald-400 hover:bg-emerald-900/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            
            <div className="flex gap-2">
              {caseStudies.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === activeIndex 
                      ? 'w-8 bg-emerald-400' 
                      : 'bg-emerald-700/50 hover:bg-emerald-700'
                  }`}
                />
              ))}
            </div>
            
            <motion.button
              onClick={nextCase}
              className="p-3 rounded-lg bg-emerald-900/20 border border-emerald-700/30 text-emerald-400 hover:bg-emerald-900/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
