'use client';

import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Line, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import ClientOnly from './ClientOnly';
import { useMousePosition3D, useIsMobile } from './3d/MouseTracker3D';

// Timeline Node Component
function TimelineNode({ 
  position, 
  isActive,
  mouseX,
  mouseY 
}: { 
  position: [number, number, number];
  isActive: boolean;
  mouseX: number;
  mouseY: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Pulse animation for active node
    if (isActive) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
    
    // Mouse influence
    const targetX = position[0] + mouseX * 0.1;
    const targetY = position[1] + mouseY * 0.1;
    
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.1);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);
    
    // Hover scale
    const targetScale = hovered ? 1.3 : isActive ? 1.1 : 1;
    if (!isActive) {
      meshRef.current.scale.setScalar(
        THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1)
      );
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.1}>
      <Sphere
        ref={meshRef}
        args={[0.3, 16, 16]}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <MeshDistortMaterial
          color={isActive ? '#10b981' : '#AE9370'}
          emissive={isActive ? '#10b981' : '#AE9370'}
          emissiveIntensity={hovered ? 0.5 : isActive ? 0.3 : 0.1}
          roughness={0.2}
          metalness={0.8}
          distort={0.05}
          speed={2}
        />
      </Sphere>
    </Float>
  );
}

// Connecting Path
function TimelinePath({ points }: { points: [number, number, number][] }) {
  const curve = useMemo(() => {
    const curvePoints = points.map(p => new THREE.Vector3(...p));
    return new THREE.CatmullRomCurve3(curvePoints);
  }, [points]);

  const linePoints = useMemo(() => {
    return curve.getPoints(50);
  }, [curve]);

  return (
    <Line
      points={linePoints}
      color="#10b981"
      lineWidth={2}
      opacity={0.5}
      transparent
    />
  );
}

// Energy Pulse Animation
function EnergyPulse({ path }: { path: THREE.CatmullRomCurve3 }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    progressRef.current += 0.005;
    if (progressRef.current > 1) progressRef.current = 0;
    
    const point = path.getPointAt(progressRef.current);
    meshRef.current.position.copy(point);
    
    // Pulse size
    const scale = 0.1 + Math.sin(state.clock.elapsedTime * 5) * 0.05;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial 
        color="#10b981" 
        emissive="#10b981" 
        emissiveIntensity={2} 
        toneMapped={false}
      />
    </mesh>
  );
}

// Main 3D Timeline Scene
function Timeline3D({ mouseX, mouseY, isMobile }: { mouseX: number; mouseY: number; isMobile: boolean }) {
  const milestones = useMemo(() => [
    { position: [-3, 2, 0] as [number, number, number], title: "Week 1-2", active: true },
    { position: [-1, 0.5, 0] as [number, number, number], title: "Week 3-4", active: false },
    { position: [1, -0.5, 0] as [number, number, number], title: "Week 5", active: false },
    { position: [3, 1, 0] as [number, number, number], title: "Week 6", active: false },
  ], []);

  const pathCurve = useMemo(() => {
    const points = milestones.map(m => new THREE.Vector3(...m.position));
    return new THREE.CatmullRomCurve3(points);
  }, [milestones]);

  return (
    <>
      {/* Timeline Path */}
      <TimelinePath points={milestones.map(m => m.position)} />
      
      {/* Timeline Nodes */}
      {milestones.map((milestone, index) => (
        <TimelineNode
          key={index}
          position={milestone.position}
          isActive={milestone.active}
          mouseX={isMobile ? 0 : mouseX}
          mouseY={isMobile ? 0 : mouseY}
        />
      ))}
      
      {/* Energy Pulses */}
      <EnergyPulse path={pathCurve} />
    </>
  );
}

// Background Grid
function BackgroundGrid() {
  return (
    <gridHelper args={[20, 20, '#10b981', '#0C1816']} position={[0, -3, 0]} rotation={[0, 0, 0]} />
  );
}

export default function RoadmapSection3D() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition3D(canvasRef);
  const isMobile = useIsMobile();

  const roadmapSteps = [
    {
      week: "Week 1-2",
      title: "Foundation & Identity",
      tasks: [
        "Clarify your positioning",
        "Define your ideal customer",
        "Map your offer architecture"
      ]
    },
    {
      week: "Week 3-4",
      title: "Build & Launch",
      tasks: [
        "Create your offer page",
        "Record your 90-second VSL",
        "Set up checkout flow"
      ]
    },
    {
      week: "Week 5",
      title: "AI Workflow",
      tasks: [
        "Design your first workflow",
        "Implement with GPT/n8n",
        "Test with real data"
      ]
    },
    {
      week: "Week 6",
      title: "Scale & Optimize",
      tasks: [
        "Launch to your network",
        "Book discovery calls",
        "Iterate based on feedback"
      ]
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-emerald-950/20 to-[#0C1816] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Your 6-Week Journey
          </h2>
          <p className="text-xl text-emerald-200 max-w-3xl mx-auto">
            From zero to your first AI-powered revenue system
          </p>
        </motion.div>

        {/* 3D Timeline */}
        <div ref={canvasRef} className="h-[400px] mb-12">
          <ClientOnly fallback={
            <div className="w-full h-full bg-gradient-to-br from-emerald-900/10 to-emerald-700/10 rounded-xl" />
          }>
            <Suspense fallback={null}>
              <Canvas
                camera={{ position: [0, 0, 8], fov: 50 }}
                dpr={[1, 2]}
                className="w-full h-full"
              >
                <ambientLight intensity={0.3} />
                <directionalLight position={[10, 10, 5]} intensity={0.5} />
                <directionalLight position={[-10, -10, -5]} intensity={0.3} />
                
                <BackgroundGrid />
                <Timeline3D 
                  mouseX={mousePosition.normalized.x} 
                  mouseY={mousePosition.normalized.y}
                  isMobile={isMobile}
                />
                
              </Canvas>
            </Suspense>
          </ClientOnly>
        </div>

        {/* Roadmap Details */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roadmapSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-black/40 backdrop-blur-sm border border-emerald-900/30 rounded-xl p-6"
              whileHover={{ 
                y: -5,
                borderColor: 'rgb(16 185 129 / 0.5)',
                transition: { duration: 0.2 }
              }}
            >
              <div className="text-emerald-400 text-sm font-semibold mb-2">{step.week}</div>
              <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
              <ul className="space-y-2">
                {step.tasks.map((task, taskIndex) => (
                  <li key={taskIndex} className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{task}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <motion.button
            className="px-8 py-4 bg-tan text-emerald-900 rounded-lg font-semibold text-lg hover:bg-tan/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Journey
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
