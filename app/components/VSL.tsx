'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Container from './Container';
import content from '@/app/content/z21.json';
import { trackEvent } from '@/lib/analytics';

export default function VSL() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasTracked50, setHasTracked50] = useState(false);
  const [hasTracked90, setHasTracked90] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    trackEvent('vsl_play');
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const percentage = (video.currentTime / video.duration) * 100;
      
      if (percentage >= 50 && !hasTracked50) {
        trackEvent('vsl_50');
        setHasTracked50(true);
      }
      
      if (percentage >= 90 && !hasTracked90) {
        trackEvent('vsl_90');
        setHasTracked90(true);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [hasTracked50, hasTracked90]);

  return (
    <section id={content.vsl.id} className="py-20 lg:py-32 bg-emerald-950">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-5xl mx-auto"
        >
          {/* Section title */}
          <p className="text-center text-white text-sm uppercase tracking-wider mb-8">
            {content.vsl.headline}
          </p>

          {/* Video container - 16:9 aspect ratio */}
          <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl">
            {/* Aspect ratio wrapper */}
            <div className="relative pb-[56.25%]">
              {!isPlaying ? (
                <>
                  {/* Video poster */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-emerald-950 to-emerald-950/80 flex items-center justify-center"
                    style={{
                      backgroundImage: content.vsl.poster ? `url(${content.vsl.poster})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Play button overlay */}
                    <button
                      onClick={handlePlay}
                      className="group relative"
                      aria-label="Play video"
                    >
                      <div className="absolute inset-0 bg-paper/20 rounded-full blur-xl group-hover:bg-paper/30 transition-all" />
                      <div className="relative bg-paper rounded-full p-6 lg:p-8 shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 lg:w-12 lg:h-12 text-emerald-950 fill-emerald-950 ml-1" />
                      </div>
                    </button>
                  </div>
                  
                  {/* Caption fallback if video doesn't load */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white/80 text-sm">
                      Click to watch: The complete Z21 mechanism explained
                    </p>
                  </div>
                </>
              ) : (
                /* Video player */
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full"
                  src={content.vsl.src}
                  poster={content.vsl.poster}
                  controls
                  autoPlay
                  preload="metadata"
                  onEnded={() => setIsPlaying(false)}
                >
                  {content.vsl.captions && (
                    <track 
                      kind="captions"
                      src={content.vsl.captions}
                      srcLang="en"
                      label="English"
                      default
                    />
                  )}
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>

          {/* Chapter markers */}
          {content.vsl.chapters && content.vsl.chapters.length > 0 && (
            <div className="mt-8">
              <h3 className="sr-only">Video Chapters</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {content.vsl.chapters.map((chapter, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (videoRef.current && isPlaying) {
                        videoRef.current.currentTime = chapter.t;
                      }
                    }}
                    className="group flex items-center gap-2 px-3 py-1 rounded-full bg-paper/10 hover:bg-paper/20 transition-colors text-white/80 hover:text-white text-sm"
                    aria-label={`Jump to ${chapter.label}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rust group-hover:scale-125 transition-transform" />
                    <span className="text-rust font-medium">
                      {Math.floor(chapter.t / 60)}:{String(chapter.t % 60).padStart(2, '0')}
                    </span>
                    <span>{chapter.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
