'use client';

import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = 'Search resources...' 
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div 
      className={`relative w-full transition-all ${
        isFocused ? 'scale-[1.02]' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full pl-12 pr-12 py-4 bg-zinc-900 border rounded-xl text-white placeholder-zinc-500 
            focus:outline-none transition-all ${
            isFocused ? 'border-accent bg-zinc-900/80' : 'border-zinc-800'
          }`}
        />
        
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Search suggestions/hints */}
      {isFocused && !value && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 z-10"
        >
          <p className="text-xs text-zinc-500 mb-2">Try searching for:</p>
          <div className="flex flex-wrap gap-2">
            {['ChatGPT', 'prompts', 'free tools', 'AI art'].map((term) => (
              <button
                key={term}
                onClick={() => onChange(term)}
                onMouseDown={(e) => e.preventDefault()} // Prevent blur
                className="px-2 py-1 text-xs bg-zinc-800 text-zinc-400 rounded hover:bg-zinc-700 hover:text-white transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
