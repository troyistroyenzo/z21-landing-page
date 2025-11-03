'use client';

import { motion } from 'framer-motion';
import { Resource } from '@/app/content/aiResources';
import { 
  ExternalLink, 
  FileText, 
  Video, 
  Code, 
  BookOpen,
  Users,
  Wrench
} from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
  featured?: boolean;
}

// Map resource types to icons
const typeIcons = {
  'tool': Wrench,
  'article': FileText,
  'video': Video,
  'prompt-library': Code,
  'course': BookOpen,
  'forum': Users
};

export default function ResourceCard({ resource, featured = false }: ResourceCardProps) {
  const Icon = typeIcons[resource.type] || FileText;

  return (
    <motion.a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block p-6 rounded-xl border transition-all hover:scale-[1.02] ${
        featured 
          ? 'bg-gradient-to-br from-zinc-900 to-zinc-950 border-accent/30 hover:border-accent/60' 
          : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
      }`}
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${featured ? 'bg-accent/10' : 'bg-zinc-800'}`}>
          <Icon className={`w-5 h-5 ${featured ? 'text-accent' : 'text-zinc-400'}`} />
        </div>
        <ExternalLink className="w-4 h-4 text-zinc-500" />
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">
        {resource.title}
      </h3>
      
      <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
        {resource.description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500">
          {resource.category}
        </span>
        
        {featured && (
          <span className="px-2 py-1 text-xs font-semibold bg-accent/10 text-accent rounded-full">
            Featured
          </span>
        )}
      </div>

      {resource.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {resource.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-zinc-800 text-zinc-400 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.a>
  );
}
