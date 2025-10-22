'use client';

import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Box, Environment, MeshTransmissionMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import ClientOnly from './ClientOnly';
import { useMousePosition3D, useIsMobile } from './3d/MouseTracker3D';

// Individual Logo Card in 3D
function LogoCard3D({ 
  position, 
  rotation, 
  name, 
  index, 
  total,
  mouseX
}: { 
  position: [number, number, number];
  rotation: number;
  name: string;
  index: number;
  total: number;
  mouseX: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Carousel rotation
    const time = state.clock.elapsedTime;
    const radius = 3;
    const angle = (index / total) * Math.PI * 2 + time * 0.2 + mouseX * 0.5;
    
    meshRef.current.position.x = Math.sin(angle) * radius;
    meshRef.current.position.z = Math.cos(angle) * radius;
    meshRef.current.rotation.y = -angle + Math.PI / 2;
    
    // Scale on hover
    const targetScale = hovered ? 1.2 : 1;
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1);
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.1);
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.1);
    
    // Opacity based on position (fade out when behind)
    if (meshRef.current.material && 'opacity' in meshRef.current.material) {
      const opacity = meshRef.current.position.z > -1 ? 1 : Math.max(0.3, (meshRef.current.position.z + 3) / 2);
      (meshRef.current.material as THREE.MeshStandardMaterial).opacity = opacity;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
      <Box
        ref={meshRef}
        args={[1.8, 1, 0.1]}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <MeshTransmissionMaterial
          color={hovered ? '#10b981' : '#0C1816'}
          transmission={0.9}
          thickness={0.2}
          roughness={0.1}
          chromaticAberration={0.1}
          anisotropy={0.3}
          transparent
          opacity={1}
        />
      </Box>
      
      {/* Logo Text */}
      <Text
        position={[position[0], position[1], position[2] + 0.1]}
        fontSize={0.3}
        color={hovered ? '#10b981' : '#AE9370'}
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </Float>
  );
}

// 3D Logo Carousel
function LogoCarousel({ clients, mouseX, isMobile }: { 
  clients: string[]; 
  mouseX: number;
  isMobile: boolean;
}) {
  return (
    <group>
      {clients.map((client, index) => (
        <LogoCard3D
          key={client}
          position={[0, 0, 0]}
          rotation={0}
          name={client}
          index={index}
          total={clients.length}
          mouseX={isMobile ? 0 : mouseX}
        />
      ))}
    </group>
  );
}

// Ambient Particles
function AmbientParticles() {
  const count = 100;
  const mesh = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ),
        scale: Math.random() * 0.5 + 0.5,
        speed: Math.random() * 0.02 + 0.01
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    
    particles.forEach((particle, i) => {
      particle.position.y += particle.speed;
      if (particle.position.y > 5) particle.position.y = -5;
      
      const dummy = new THREE.Object3D();
      dummy.position.copy(particle.position);
      dummy.scale.setScalar(particle.scale * (Math.sin(state.clock.elapsedTime + i) * 0.2 + 1));
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 6, 6]} />
      <meshBasicMaterial color="#10b981" opacity={0.2} transparent />
    </instancedMesh>
  );
}

export default function ClientsSection3D() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition3D(canvasRef);
  const isMobile = useIsMobile();

  const clients = [
    "Meta",
    "OpenAI", 
    "Google",
    "Microsoft",
    "Amazon",
    "Apple",
    "Tesla",
    "Netflix"
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

        {/* 3D Logo Carousel */}
        <div ref={canvasRef} className="h-[300px] md:h-[400px] mb-16">
          <ClientOnly fallback={
            <div className="w-full h-full bg-gradient-to-br from-emerald-900/10 to-emerald-700/10 rounded-xl flex items-center justify-center">
              <div className="text-emerald-400">Loading clients...</div>
            </div>
          }>
            <Suspense fallback={null}>
              <Canvas
                camera={{ position: [0, 0, 8], fov: 45 }}
                dpr={[1, 2]}
                className="w-full h-full"
              >
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={0.5} />
                <directionalLight position={[-5, -5, -5]} intensity={0.2} />
                
                <AmbientParticles />
                <LogoCarousel 
                  clients={clients} 
                  mouseX={mousePosition.normalized.x}
                  isMobile={isMobile}
                />
                
                <Environment preset="city" />
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
              <div className="text-emerald-400 text-3xl mb-4">"</div>
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
