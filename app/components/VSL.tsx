'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Container from './Container';
import content from '@/app/content/z21.json';

export default function VSL() {
  const [isPlaying, setIsPlaying] = useState(false);

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
          <p className="text-center text-paper/60 text-sm uppercase tracking-wider mb-8">
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
                      onClick={() => setIsPlaying(true)}
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
                    <p className="text-paper/80 text-sm">
                      Click to watch: The complete Z21 mechanism explained
                    </p>
                  </div>
                </>
              ) : (
                /* Video player */
                <video
                  className="absolute inset-0 w-full h-full"
                  src={content.vsl.src}
                  controls
                  autoPlay
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
              <div className="flex flex-wrap justify-center gap-4">
                {content.vsl.chapters.map((chapter, index) => (
                  <div
                    key={index}
                    className="text-paper/60 text-sm"
                  >
                    <span className="text-rust font-medium">
                      {Math.floor(chapter.t / 60)}:{String(chapter.t % 60).padStart(2, '0')}
                    </span>
                    {' - '}
                    <span>{chapter.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
