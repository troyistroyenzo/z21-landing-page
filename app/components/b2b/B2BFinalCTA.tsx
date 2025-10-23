'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import ClientOnly from '../ClientOnly';

// Animated CTA Button
function AnimatedButton() {
  return (
    <Float speed={3} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh>
        <boxGeometry args={[3, 1, 0.1]} />
        <meshStandardMaterial
          color="#AE9370"
          emissive="#AE9370"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.3}
        />
      </mesh>
    </Float>
  );
}

export default function B2BFinalCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={sectionRef} className="relative py-32 min-h-screen flex items-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 pointer-events-none">
        <ClientOnly fallback={null}>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            className="!absolute inset-0"
            dpr={[1, 1.5]}
            gl={{ 
              antialias: false,
              powerPreference: "high-performance"
            }}
          >
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 5]} intensity={0.3} />
            
            <Sparkles
              count={100}
              scale={10}
              size={2}
              speed={0.5}
              color="#10b981"
            />
            
            <AnimatedButton />
          </Canvas>
        </ClientOnly>
      </div>

      <motion.div 
        className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center"
        style={{ scale, opacity }}
      >
        {/* Main CTA Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 backdrop-blur-md border border-emerald-600/30 rounded-3xl p-12 md:p-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Transform Your Team?
          </h2>
          
          <p className="text-xl md:text-2xl text-emerald-200 mb-8 max-w-3xl mx-auto">
            Join forward-thinking companies who've already 10x'd their AI capabilities
          </p>

          {/* How to Get Started */}
          <div className="mb-12 space-y-6">
            <h3 className="text-2xl font-semibold text-white">How to Get It</h3>
            <div className="grid md:grid-cols-5 gap-4 max-w-4xl mx-auto">
              {[
                { step: "1", title: "Apply", desc: "10-min fit check" },
                { step: "2", title: "Scope", desc: "Pick use-cases" },
                { step: "3", title: "Pre-work", desc: "Survey + examples" },
                { step: "4", title: "Run day", desc: "Ship wins & SOPs" },
                { step: "5", title: "30-day", desc: "Measure & iterate" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-emerald-900 font-bold text-lg mx-auto mb-2">
                    {item.step}
                  </div>
                  <p className="text-white font-semibold">{item.title}</p>
                  <p className="text-emerald-300 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <motion.a
            href="https://calendly.com/your-handle/ai-onboarding-fit-check-10min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-12 py-6 rounded-xl font-bold text-xl transition-all shadow-2xl hover:shadow-3xl transform"
            style={{ backgroundColor: '#AE9370' }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: '0 0 50px rgba(174, 147, 112, 0.5)' 
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-emerald-900">Apply Now → Schedule Your Fit Check</span>
          </motion.a>

          <p className="mt-6 text-emerald-300">
            Limited slots available • Booking 2-3 weeks out
          </p>
        </motion.div>

        {/* Testimonial or Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-16"
        >
          <p className="text-gray-400 mb-6">Trusted by teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <img 
              src="https://cdn.prod.website-files.com/682e5f308475223abbd39258/682e5f308475223abbd392b1_logo%2520(8)-p-500.png"
              alt="Client Logo"
              className="h-8 md:h-10 opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
            />
            <img 
              src="https://www.getfound.id/wp-content/uploads/2024/07/getfound-logo1-1-1.webp"
              alt="GetFound Logo"
              className="h-8 md:h-10 opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
            />
          </div>
        </motion.div>

        {/* Compliance Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-12 p-6 bg-emerald-900/10 border border-emerald-700/20 rounded-lg max-w-2xl mx-auto"
        >
          <h4 className="text-lg font-semibold text-emerald-400 mb-2">
            🔒 Compliance & Data Policy
          </h4>
          <p className="text-sm text-gray-300">
            We work with masked/redacted examples and cleaned datasets you provide. 
            No PII pushed into models. Optional governance/policy brief included for Growth & Enterprise packages.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
