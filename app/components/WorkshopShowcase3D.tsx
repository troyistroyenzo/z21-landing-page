'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';

const WorkshopShowcase3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const photos = [
    {
      id: 1,
      url: 'https://kldpzpnipovkkwzvstrm.supabase.co/storage/v1/object/sign/photos/FZ5_9103.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OGMwZGRhNC1iYWNkLTQzMGYtOWVkOC1iNzY3YzU1NDM5YzMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaG90b3MvRlo1XzkxMDMuanBnIiwiaWF0IjoxNzY3ODcyMDM4LCJleHAiOjE3OTk0MDgwMzh9.6pBAZOBNCAeIfFji2k1DLe7iyJBG_bFpAzFHy9iyp_o',
      alt: 'AI Workshop - Team Training Session',
      size: 'large'
    },
    {
      id: 2,
      url: 'https://kldpzpnipovkkwzvstrm.supabase.co/storage/v1/object/sign/photos/FZ5_7683.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OGMwZGRhNC1iYWNkLTQzMGYtOWVkOC1iNzY3YzU1NDM5YzMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaG90b3MvRlo1Xzc2ODMuanBnIiwiaWF0IjoxNzY3ODcyMDE5LCJleHAiOjE3OTk0MDgwMTl9.wycYMo5oYP33wMMKk1KdJXCKu7Jynk-G5JuOrK8F0ns',
      alt: 'Workshop Collaboration Moment',
      size: 'small'
    },
    {
      id: 3,
      url: 'https://kldpzpnipovkkwzvstrm.supabase.co/storage/v1/object/sign/photos/FZ5_9283.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OGMwZGRhNC1iYWNkLTQzMGYtOWVkOC1iNzY3YzU1NDM5YzMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaG90b3MvRlo1XzkyODMuanBnIiwiaWF0IjoxNzY3ODcyMDQ4LCJleHAiOjE3OTk0MDgwNDh9.ErQxysttXyER8bicUnijJysG4P8PMXqZkT9gCkVE1t4',
      alt: 'Building AI Workflows Together',
      size: 'small'
    }
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-[#0C1816] via-[#0C1816] to-emerald-950/20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-tan/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            AI Training <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">In Action</span>
          </h2>
          <p className="text-xl text-emerald-200 max-w-3xl mx-auto">
            Real workshops. Real results. See teams transform from AI-confused to AI operators.
          </p>
        </motion.div>

        {/* Bento Grid with 3D Tilt */}
        <div 
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {/* Large Photo (spans 2 columns) */}
          <PhotoCard3D
            photo={photos[0]}
            index={0}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            className="md:col-span-2 md:row-span-2 h-[400px] md:h-[600px]"
          />

          {/* Small Photo 1 */}
          <PhotoCard3D
            photo={photos[1]}
            index={1}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            className="h-[300px] md:h-[290px]"
          />

          {/* Small Photo 2 */}
          <PhotoCard3D
            photo={photos[2]}
            index={2}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            className="h-[300px] md:h-[290px]"
          />
        </div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-emerald-300 text-lg">
            From overwhelm to 10× output in just 1–2 days
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// Individual Photo Card with 3D Tilt
interface PhotoCard3DProps {
  photo: { id: number; url: string; alt: string; size: string };
  index: number;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
  className?: string;
}

const PhotoCard3D: React.FC<PhotoCard3DProps> = ({
  photo,
  index,
  hoveredIndex,
  setHoveredIndex,
  className
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Mouse position tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for rotation
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 150,
    damping: 20
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 150,
    damping: 20
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    const xPct = (mouseXPos / width - 0.5);
    const yPct = (mouseYPos / height - 0.5);

    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHoveredIndex(null);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-2xl overflow-hidden group cursor-pointer ${className}`}
      style={{
        perspective: 1000,
      }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image */}
        <div className="relative w-full h-full">
          <Image
            src={photo.url}
            alt={photo.alt}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index === 0}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300" />
        </div>

        {/* Emerald Glow Border (on hover) */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{
            opacity: hoveredIndex === index ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          style={{
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.6), inset 0 0 30px rgba(16, 185, 129, 0.1)',
            border: '2px solid rgba(16, 185, 129, 0.3)',
          }}
        />

        {/* Optional Caption Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-sm font-medium">{photo.alt}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WorkshopShowcase3D;
