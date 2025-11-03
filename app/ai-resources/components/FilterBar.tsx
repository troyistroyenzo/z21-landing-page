'use client';

import { motion } from 'framer-motion';

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedType: string | null;
  onTypeChange: (type: string | null) => void;
}

const resourceTypes = [
  { value: 'tool', label: '🔧 Tools' },
  { value: 'article', label: '📄 Articles' },
  { value: 'video', label: '🎥 Videos' },
  { value: 'course', label: '📚 Courses' },
  { value: 'prompt-library', label: '💻 Prompts' },
  { value: 'forum', label: '👥 Communities' }
];

export default function FilterBar({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange
}: FilterBarProps) {
  return (
    <div className="mb-8 space-y-4">
      {/* Category Filter */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-400 mb-3">Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                selectedCategory === category
                  ? 'bg-accent text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-400 mb-3">Type</h3>
        <div className="flex flex-wrap gap-2">
          <motion.button
            onClick={() => onTypeChange(null)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              selectedType === null
                ? 'bg-zinc-700 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            All Types
          </motion.button>
          {resourceTypes.map((type) => (
            <motion.button
              key={type.value}
              onClick={() => onTypeChange(type.value)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                selectedType === type.value
                  ? 'bg-zinc-700 text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {type.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
