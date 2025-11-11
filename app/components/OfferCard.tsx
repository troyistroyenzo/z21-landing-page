'use client';

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import type { OfferItem } from '@/app/content/offerStack';

// 3D Models for each offer type
function SprintRing() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [rotationSpeed, setRotationSpeed] = useState(0.01);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed;
      meshRef.current.rotation.y += rotationSpeed * 0.7;
    }
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setRotationSpeed(0);
    }
  }, []);

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[1, 0.4, 16, 32]} />
      <meshStandardMaterial 
        color="#10b981" 
        emissive="#10b981" 
        emissiveIntensity={0.2}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  );
}

function Lighthouse() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [rotationSpeed, setRotationSpeed] = useState(0.008);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
      // Subtle floating effect
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setRotationSpeed(0);
    }
  }, []);

  return (
    <group ref={meshRef}>
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.8, 2, 8]} />
        <meshStandardMaterial 
          color="#AE9370" 
          emissive="#AE9370" 
          emissiveIntensity={0.3}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
      {/* Light beam effect */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}

function NetworkMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const [rotationSpeed, setRotationSpeed] = useState(0.005);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setRotationSpeed(0);
    }
  }, []);

  const nodePositions: [number, number, number][] = [
    [0, 0, 0],
    [1.5, 0.5, 0],
    [-1.2, -0.3, 0.8],
    [0.5, -0.8, -1],
    [-0.8, 0.7, -0.5],
  ];

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      {nodePositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial 
            color="#10b981" 
            emissive="#10b981" 
            emissiveIntensity={0.3}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      ))}
      {/* Connections */}
      {nodePositions.map((start, i) => 
        nodePositions.slice(i + 1).map((end, j) => {
          const distance = Math.sqrt(
            Math.pow(end[0] - start[0], 2) +
            Math.pow(end[1] - start[1], 2) +
            Math.pow(end[2] - start[2], 2)
          );
          const midpoint = [
            (start[0] + end[0]) / 2,
            (start[1] + end[1]) / 2,
            (start[2] + end[2]) / 2,
          ];
          
          return (
            <mesh key={`${i}-${j}`} position={midpoint as [number, number, number]}>
              <cylinderGeometry args={[0.02, 0.02, distance, 8]} />
              <meshStandardMaterial 
                color="#AE9370" 
                emissive="#AE9370" 
                emissiveIntensity={0.2}
                opacity={0.6}
                transparent
              />
            </mesh>
          );
        })
      )}
    </group>
  );
}

// Scene component for each offer type
function OfferScene({ offerId }: { offerId: string }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} />
      
      {offerId === 'cohort' && <SprintRing />}
      {offerId === 'coaching' && <Lighthouse />}
      {offerId === 'workshop' && <NetworkMesh />}
    </>
  );
}

interface OfferCardProps {
  offer: OfferItem;
  onOpenModal: () => void;
  isPaused?: boolean;
}

export default function OfferCard({ offer, onOpenModal, isPaused = false }: OfferCardProps) {
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setIsWebGLSupported(false);
      }
    } catch {
      setIsWebGLSupported(false);
    }
  }, [offer.id]);

  useEffect(() => {
    // Intersection Observer for analytics
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
          // Custom event tracking could be added here if needed
        }
      },
      { threshold: 0.5 }
    );
    const el = cardRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [offer.id, isInView]);

  const handleLearnMore = () => {
    // Custom event tracking could be added here if needed
    onOpenModal();
  };
  

  const fallbackColors = {
    cohort: 'from-emerald-900 via-emerald-800 to-emerald-700',
    coaching: 'from-[#AE9370] via-[#8E7350] to-[#6E5330]',
    workshop: 'from-emerald-700 via-[#AE9370] to-emerald-800',
  };

  const isInactive = offer.seasonOpen === false || offer.isActive === false;
  const isCalendlyLink = offer.ctaRoute.startsWith('http');

  return (
    <motion.div
      ref={cardRef}
      className={`bg-black/40 backdrop-blur-sm rounded-xl border overflow-hidden group relative ${
        isInactive 
          ? 'border-gray-700/30 opacity-60' 
          : 'border-emerald-900/30'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={!isInactive ? { 
        y: -8,
        boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)',
        transition: { duration: 0.3 }
      } : {}}
    >
      {/* Active Badge */}
      {offer.isActive && (
        <div className="absolute top-4 right-4 z-10">
          <motion.div
            className="px-4 py-2 bg-emerald-500 text-emerald-900 text-sm font-bold rounded-full shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            ACTIVE OFFER
          </motion.div>
        </div>
      )}
      {/* 3D Scene Container */}
      <div className="relative h-64 overflow-hidden">
        {isWebGLSupported ? (
          <Suspense fallback={
            <div className={`w-full h-full bg-gradient-to-br ${fallbackColors[offer.id]} animate-pulse`} />
          }>
            <Canvas
              camera={{ position: [0, 0, 5], fov: 45 }}
              dpr={[1, 2]}
              frameloop={isPaused ? 'never' : 'always'}
              className="w-full h-full"
            >
              <OfferScene offerId={offer.id} />
            </Canvas>
          </Suspense>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${fallbackColors[offer.id]} flex items-center justify-center`}>
            <div className="text-6xl opacity-50">
              {offer.id === 'cohort' && '⭕'}
              {offer.id === 'coaching' && '🏛️'}
              {offer.id === 'workshop' && '🔗'}
            </div>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Card Content */}
      <div className="p-6">
        <h3 className={`text-2xl font-bold mb-2 ${isInactive ? 'text-gray-400' : 'text-white'}`}>
          {offer.title}
        </h3>
        <p className={`mb-6 ${isInactive ? 'text-gray-500' : 'text-emerald-200'}`}>
          {offer.cardSubtitle}
        </p>
        
        {isInactive ? (
          // For inactive offers (cohort), just show "Coming Soon" text at bottom
          <div className="text-center py-4">
            <span className="text-gray-500 text-sm uppercase tracking-wide">
              Coming Soon
            </span>
          </div>
        ) : (
          // For active offers, show buttons
          <div className="flex items-center justify-between">
            <motion.button
              onClick={handleLearnMore}
              className="px-6 py-2.5 bg-tan text-emerald-900 rounded-lg font-semibold hover:bg-tan/90 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn more
            </motion.button>
            
            {isCalendlyLink ? (
              <a
                href={offer.ctaRoute}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-300 hover:text-emerald-200 underline underline-offset-4 text-sm transition-colors"
              >
                {offer.ctaLabel} →
              </a>
            ) : (
              <span className="text-emerald-300 text-sm">
                {offer.ctaLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
