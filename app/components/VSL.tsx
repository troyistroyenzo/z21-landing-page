'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play, Pause, Volume2 } from 'lucide-react';
import Button from './ui/Button';

const VSL = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
            90 Second Overview
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            See the transformation in action
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-balance">
            Watch how founders like you build profitable AI businesses from zero to one.
          </p>
        </motion.div>

        {/* Video Player */}
        <motion.div
          className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            {/* Video Element */}
            <video
              ref={videoRef}
              className="w-full aspect-video object-cover"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleTimeUpdate}
              poster="/api/placeholder/800/450"
            >
              <source src="https://www.youtube.com/watch?v=zZibCk4ZqHE" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Video Overlay */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <motion.button
                onClick={handlePlayPause}
                className="flex items-center justify-center w-16 h-16 bg-white/90 rounded-full text-gray-900 hover:bg-white transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </motion.button>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={handlePlayPause}
                  className="flex items-center justify-center w-8 h-8 text-white hover:text-accent transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </motion.button>

                {/* Progress Bar */}
                <div className="flex-1 relative">
                  <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${progress}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </div>

                {/* Time Display */}
                <div className="text-xs text-white font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>

                <Volume2 className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Video Stats */}
          <motion.div
            className="flex items-center justify-center mt-6 space-x-8 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
              Live Demo
            </div>
            <div>90 seconds</div>
            <div>Real Results</div>
          </motion.div>
        </motion.div>

        {/* CTA Below Video */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button variant="primary" size="lg">
            Start Your Transformation
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default VSL;
