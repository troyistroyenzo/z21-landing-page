'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

interface Card3DProps {
  icon: string;
  isActive: boolean;
  status: 'active' | 'upcoming' | 'planned' | 'future';
}

function IconSphere({ icon, isActive, status }: Card3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Gentle rotation
    meshRef.current.rotation.y += 0.01;
    
    // Floating animation
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    
    // Scale on hover
    const targetScale = hovered ? 1.2 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  const getColor = () => {
    switch (status) {
      case 'active': return '#10b981';
      case 'upcoming': return '#3b82f6';
      case 'planned': return '#8b5cf6';
      case 'future': return '#71717a';
      default: return '#3f3f46';
    }
  };

  return (
    <group>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color={getColor()}
          emissive={getColor()}
          emissiveIntensity={isActive ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh scale={1.2}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial
          color={getColor()}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Emoji as HTML overlay */}
      <Center position={[0, 0, 0.9]}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.5}
          height={0.1}
        >
          {icon}
          <meshStandardMaterial color="white" />
        </Text3D>
      </Center>
      
      {isActive && (
        <pointLight
          position={[0, 0, 0]}
          intensity={1}
          distance={5}
          color={getColor()}
        />
      )}
    </group>
  );
}

function Card3DMesh({ mouseX, mouseY, status }: { mouseX: number; mouseY: number; status: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Mouse-based tilt
    const targetRotationY = (mouseX - 0.5) * 0.3;
    const targetRotationX = (mouseY - 0.5) * -0.3;
    
    meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.1;
    meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.1;
    
    // Gentle floating
    meshRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  const getGradientColor = () => {
    switch (status) {
      case 'active': return new THREE.Color('#10b981');
      case 'upcoming': return new THREE.Color('#3b82f6');
      case 'planned': return new THREE.Color('#8b5cf6');
      default: return new THREE.Color('#27272a');
    }
  };

  return (
    <mesh ref={meshRef} castShadow>
      <RoundedBox args={[8, 6, 0.3]} radius={0.2} smoothness={4}>
        <meshStandardMaterial
          color={getGradientColor()}
          metalness={0.3}
          roughness={0.4}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </RoundedBox>
    </mesh>
  );
}

export function IconCanvas3D({ icon, isActive, status }: Card3DProps) {
  return (
    <div className="w-20 h-20">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <IconSphere icon={icon} isActive={isActive} status={status} />
      </Canvas>
    </div>
  );
}

export function CardCanvas3D({ 
  status, 
  mouseX, 
  mouseY 
}: { 
  status: string;
  mouseX: number;
  mouseY: number;
}) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
        <Card3DMesh mouseX={mouseX} mouseY={mouseY} status={status} />
      </Canvas>
    </div>
  );
}
