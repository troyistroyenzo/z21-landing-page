'use client';

import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, Line } from '@react-three/drei';
import { motion } from 'framer-motion';
import { roadmapMilestones } from '@/app/content/roadmap';
import * as THREE from 'three';

// Milestone node component
function MilestoneNode({ milestone, onClick, isActive }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <group position={[milestone.position?.x || 0, milestone.position?.y || 0, milestone.position?.z || 0]}>
      <mesh
        ref={meshRef}
        onClick={() => onClick(milestone)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[isActive ? 0.3 : 0.2, 32, 32]} />
        <meshStandardMaterial 
          color={milestone.color} 
          emissive={milestone.color} 
          emissiveIntensity={hovered ? 0.8 : 0.3}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {milestone.title}
      </Text>
      
      {/* Phase label */}
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.1}
        color="#64748b"
        anchorX="center"
        anchorY="middle"
      >
        {milestone.phase}
      </Text>
    </group>
  );
}

// Connection line between milestones
function ConnectionLine({ start, end, color }: any) {
  const points = [
    new THREE.Vector3(start.x, start.y, start.z),
    new THREE.Vector3(end.x, end.y, end.z)
  ];

  return (
    <Line
      points={points}
      color={color || "#4b5563"}
      lineWidth={2}
      dashed={false}
    />
  );
}

// Three.js Scene
function RoadmapScene({ selectedMilestone, setSelectedMilestone }: any) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Milestones */}
      {roadmapMilestones.map((milestone) => (
        <MilestoneNode
          key={milestone.id}
          milestone={milestone}
          onClick={setSelectedMilestone}
          isActive={milestone.status === 'active'}
        />
      ))}
      
      {/* Connection lines */}
      {roadmapMilestones.slice(0, -1).map((milestone, index) => {
        const nextMilestone = roadmapMilestones[index + 1];
        if (milestone.position && nextMilestone.position) {
          return (
            <ConnectionLine
              key={`line-${milestone.id}`}
              start={milestone.position}
              end={nextMilestone.position}
              color={milestone.status === 'active' ? milestone.color : '#4b5563'}
            />
          );
        }
        return null;
      })}
      
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minDistance={5}
        maxDistance={15}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function RoadmapInteractive3D() {
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The Z21 Roadmap
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Our vision for transforming how founders and teams integrate AI
          </p>
        </motion.div>

        {/* 3D Canvas */}
        <div className="h-[600px] w-full bg-zinc-900/50 rounded-2xl border border-zinc-800 relative">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <Suspense fallback={null}>
              <RoadmapScene 
                selectedMilestone={selectedMilestone}
                setSelectedMilestone={setSelectedMilestone}
              />
            </Suspense>
          </Canvas>
          
          {/* Instructions */}
          <div className="absolute bottom-4 left-4 text-zinc-400 text-sm">
            <p>Drag to rotate • Scroll to zoom • Click milestones for details</p>
          </div>
        </div>

        {/* Selected Milestone Details */}
        {selectedMilestone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-8 bg-zinc-900 rounded-xl border border-zinc-800"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {selectedMilestone.title}
                </h3>
                <p className="text-zinc-400">{selectedMilestone.description}</p>
              </div>
              <button
                onClick={() => setSelectedMilestone(null)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            {selectedMilestone.details && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-zinc-400 mb-2">Key Features</h4>
                <ul className="space-y-2">
                  {selectedMilestone.details.map((detail: string, index: number) => (
                    <li key={index} className="flex items-center text-zinc-300">
                      <span className="w-2 h-2 bg-accent rounded-full mr-3" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-6 flex items-center gap-4">
              <span 
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedMilestone.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  selectedMilestone.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                  selectedMilestone.status === 'planned' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-zinc-700 text-zinc-400'
                }`}
              >
                {selectedMilestone.status.toUpperCase()}
              </span>
              <span className="text-zinc-500">{selectedMilestone.phase}</span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
