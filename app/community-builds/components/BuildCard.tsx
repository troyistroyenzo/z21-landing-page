'use client';

import { motion } from 'framer-motion';
import { CommunityBuild } from '@/app/content/communityBuilds';
import { ExternalLink, Github, Zap } from 'lucide-react';

interface BuildCardProps {
  build: CommunityBuild;
  featured?: boolean;
}

export default function BuildCard({ build, featured = false }: BuildCardProps) {
  return (
    <motion.div
      className={`block p-6 rounded-xl border transition-all ${
        featured 
          ? 'bg-gradient-to-br from-zinc-900 to-zinc-950 border-accent/30 hover:border-accent/60' 
          : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
      }`}
      whileHover={{ y: -4, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${featured ? 'bg-accent/10' : 'bg-zinc-800'}`}>
          <Zap className={`w-5 h-5 ${featured ? 'text-accent' : 'text-zinc-400'}`} />
        </div>
        {featured && (
          <span className="px-2 py-1 text-xs font-semibold bg-accent/10 text-accent rounded-full">
            Featured
          </span>
        )}
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">
        {build.title}
      </h3>
      
      <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
        {build.description}
      </p>

      {/* Student Info */}
      <div className="mb-4 pb-4 border-b border-zinc-800">
        <p className="text-sm text-zinc-500">
          Built by <span className="text-white font-medium">{build.studentName}</span>
        </p>
        <p className="text-xs text-zinc-600">{build.studentRole} • {build.cohort}</p>
      </div>

      {/* Impact Metrics */}
      {build.impactMetrics && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-sm text-green-400 font-medium">
            📊 {build.impactMetrics}
          </p>
        </div>
      )}

      {/* Tools Used */}
      {build.toolsUsed.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-zinc-500 mb-2">Tools:</p>
          <div className="flex flex-wrap gap-1">
            {build.toolsUsed.map((tool) => (
              <span
                key={tool}
                className="px-2 py-0.5 text-xs bg-zinc-800 text-zinc-400 rounded"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {build.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {build.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs bg-accent/10 text-accent rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      <div className="flex gap-2">
        {build.demoUrl && (
          <a
            href={build.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-3 py-2 bg-zinc-800 text-white text-sm font-medium rounded-lg hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            View Demo
          </a>
        )}
        {build.githubUrl && (
          <a
            href={build.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all flex items-center justify-center"
          >
            <Github className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
