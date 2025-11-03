'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  resources, 
  resourceCategories, 
  filterResources, 
  getFeaturedResources 
} from '@/app/content/aiResources';
import ResourceCard from './components/ResourceCard';
import ResourceGrid from './components/ResourceGrid';
import FilterBar from './components/FilterBar';
import SearchBar from './components/SearchBar';

export default function AIResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredResources = filterResources(selectedCategory, selectedType || undefined, searchQuery);
  const featuredResources = getFeaturedResources();

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent mb-4">
              Free Resources
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              AI Resources Library
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
              Start your AI journey with our curated collection of free tools, 
              tutorials, and communities.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search tools, articles, courses..."
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Resources */}
      {searchQuery === '' && selectedCategory === 'All' && (
        <section className="py-12 border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
                <span className="w-2 h-2 bg-accent rounded-full mr-3 animate-pulse" />
                Featured Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredResources.slice(0, 3).map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} featured />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Filters and Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <FilterBar
            categories={resourceCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
          />
          
          {/* Results Count */}
          <div className="mb-6 text-zinc-400">
            {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'} found
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </div>
          
          {/* Resources Grid */}
          {filteredResources.length > 0 ? (
            <ResourceGrid>
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </ResourceGrid>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-zinc-400 mb-4">No resources found</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedType(null);
                  setSearchQuery('');
                }}
                className="text-accent hover:underline"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to level up?</h2>
            <p className="text-xl text-zinc-400 mb-8">
              Join our AI onboarding sprint for hands-on implementation and personalized guidance
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/vibe-check"
                className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-all"
              >
                Apply for 1:1 Sprint
              </a>
              <a
                href="/"
                className="px-6 py-3 bg-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-700 transition-all"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
