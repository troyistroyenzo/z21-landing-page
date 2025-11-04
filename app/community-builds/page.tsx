'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  communityBuilds, 
  cohorts, 
  filterBuilds, 
  getFeaturedBuilds,
  getAllTags
} from '@/app/content/communityBuilds';
import BuildCard from './components/BuildCard';
import BuildGrid from './components/BuildGrid';

export default function CommunityBuildsPage() {
  const [selectedCohort, setSelectedCohort] = useState('All Cohorts');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredBuilds = filterBuilds(selectedCohort, searchQuery, selectedTag || undefined);
  const featuredBuilds = getFeaturedBuilds();
  const allTags = getAllTags();

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
              Student Showcas</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Community Builds
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
              Real projects built by Z21 students during their AI onboarding sprints
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search builds, tools, or students..."
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Builds */}
      {searchQuery === '' && selectedCohort === 'All Cohorts' && !selectedTag && (
        <section className="py-12 border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
                <span className="w-2 h-2 bg-accent rounded-full mr-3 animate-pulse" />
                Featured Builds
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredBuilds.map((build) => (
                  <BuildCard key={build.id} build={build} featured />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Cohort Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-zinc-400 mb-3">Filter by Cohort</h3>
            <div className="flex flex-wrap gap-2">
              {cohorts.map((cohort) => (
                <button
                  key={cohort}
                  onClick={() => setSelectedCohort(cohort)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedCohort === cohort
                      ? 'bg-accent text-white'
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  {cohort}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Filter */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-zinc-400 mb-3">Filter by Tag</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedTag === null
                    ? 'bg-zinc-700 text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                All Tags
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedTag === tag
                      ? 'bg-zinc-700 text-white'
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
          
          {/* Results Count */}
          <div className="mb-6 text-zinc-400">
            {filteredBuilds.length} {filteredBuilds.length === 1 ? 'build' : 'builds'} found
          </div>
          
          {/* Builds Grid */}
          {filteredBuilds.length > 0 ? (
            <BuildGrid>
              {filteredBuilds.map((build) => (
                <BuildCard key={build.id} build={build} />
              ))}
            </BuildGrid>
          ) : (
            <div className="text-center py-20">
              <p className="text-zinc-400 mb-4">No builds found</p>
              <button
                onClick={() => {
                  setSelectedCohort('All Cohorts');
                  setSelectedTag(null);
                  setSearchQuery('');
                }}
                className="text-accent hover:underline"
              >
                Clear filters
              </button>
            </div>
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
            <h2 className="text-3xl font-bold mb-4">Ready to build yours?</h2>
            <p className="text-xl text-zinc-400 mb-8">
              Join our AI onboarding sprint and create your own automation in 4-6 weeks
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="/vibe-check"
                className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-all"
              >
                Apply for Sprint
              </a>
              <a
                href="https://discord.gg/z21community"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#5865F2] text-white font-semibold rounded-lg hover:bg-[#4752C4] transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Join Discord
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
