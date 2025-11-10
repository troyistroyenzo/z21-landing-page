'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Search, 
  TrendingUp, 
  Star, 
  Clock, 
  Eye,
  MousePointerClick,
  ExternalLink,
  Filter,
  Sparkles,
  BookOpen,
  Code,
  Film,
  FileText,
  MessageSquare,
  GraduationCap
} from 'lucide-react';
import EmailGateModal from './components/EmailGateModal';

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'tool' | 'article' | 'video' | 'prompt-library' | 'course' | 'forum';
  category: string;
  tags: string[];
  featured: boolean;
  thumbnail?: string;
  created_at: string;
  updated_at: string;
  click_count: number;
  view_count: number;
  submitted_by: string;
  last_clicked_at: string | null;
  rich_content?: string | null;
}

const typeIcons = {
  'tool': Code,
  'article': FileText,
  'video': Film,
  'prompt-library': BookOpen,
  'course': GraduationCap,
  'forum': MessageSquare
};

const categories = [
  'All',
  'Getting Started',
  'Tools & Apps',
  'ML Frameworks',
  'Inference & Serving',
  'Benchmarks & Evals',
  'Prompts & Templates',
  'Learning Resources',
  'Research Papers',
  'Communities',
  'Advanced'
];

// Category color scheme
const categoryColors: Record<string, { border: string; bg: string; text: string; icon: string }> = {
  'Getting Started': { 
    border: 'border-l-blue-500', 
    bg: 'bg-blue-500/10', 
    text: 'text-blue-400',
    icon: 'bg-blue-500/20'
  },
  'Tools & Apps': { 
    border: 'border-l-purple-500', 
    bg: 'bg-purple-500/10', 
    text: 'text-purple-400',
    icon: 'bg-purple-500/20'
  },
  'ML Frameworks': { 
    border: 'border-l-green-500', 
    bg: 'bg-green-500/10', 
    text: 'text-green-400',
    icon: 'bg-green-500/20'
  },
  'Learning Resources': { 
    border: 'border-l-amber-500', 
    bg: 'bg-amber-500/10', 
    text: 'text-amber-400',
    icon: 'bg-amber-500/20'
  },
  'Advanced': { 
    border: 'border-l-red-500', 
    bg: 'bg-red-500/10', 
    text: 'text-red-400',
    icon: 'bg-red-500/20'
  },
  'Prompts & Templates': { 
    border: 'border-l-orange-500', 
    bg: 'bg-orange-500/10', 
    text: 'text-orange-400',
    icon: 'bg-orange-500/20'
  },
  'Research Papers': { 
    border: 'border-l-gray-500', 
    bg: 'bg-gray-500/10', 
    text: 'text-gray-400',
    icon: 'bg-gray-500/20'
  },
  'Communities': { 
    border: 'border-l-cyan-500', 
    bg: 'bg-cyan-500/10', 
    text: 'text-cyan-400',
    icon: 'bg-cyan-500/20'
  },
  'Inference & Serving': { 
    border: 'border-l-indigo-500', 
    bg: 'bg-indigo-500/10', 
    text: 'text-indigo-400',
    icon: 'bg-indigo-500/20'
  },
  'Benchmarks & Evals': { 
    border: 'border-l-pink-500', 
    bg: 'bg-pink-500/10', 
    text: 'text-pink-400',
    icon: 'bg-pink-500/20'
  },
};

export default function AIResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'trending' | 'popular' | 'new' | 'engagement'>('new');
  const [viewMode, setViewMode] = useState<'featured' | 'all'>('featured');
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  // Check access
  useEffect(() => {
    const hasSubmitted = localStorage.getItem('ai_resources_email_submitted');
    const referrer = document.referrer;
    const isExternal = !referrer || !referrer.includes(window.location.hostname);
    
    if (hasSubmitted) {
      setHasAccess(true);
    } else if (isExternal) {
      setShowEmailGate(true);
    } else {
      setHasAccess(true);
    }
  }, []);

  // Fetch resources from database
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          sortBy: sortBy === 'trending' ? 'trending' : 
                  sortBy === 'popular' ? 'click_count' : 
                  'created_at',
          order: 'desc',
          limit: '50'
        });

        if (selectedCategory !== 'All') {
          params.append('category', selectedCategory);
        }
        
        if (searchQuery) {
          params.append('search', searchQuery);
        }

        const response = await fetch(`/api/resources?${params}`);
        const data = await response.json();

        if (data.resources) {
          setResources(data.resources);
        }
      } catch (error) {
        console.error('Failed to fetch resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [selectedCategory, searchQuery, sortBy]);

  const handleResourceClick = async (resource: Resource) => {
    // Track click
    try {
      await fetch(`/api/resources/${resource.id}/click`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }
    // Open URL
    window.open(resource.url, '_blank');
  };

  const handleEmailSubmit = async (email: string) => {
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'ai-resources' })
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      localStorage.setItem('ai_resources_email_submitted', 'true');
      setHasAccess(true);
      setShowEmailGate(false);
    } catch (error) {
      console.error('Subscription error:', error);
      throw error;
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffInHours = (now.getTime() - then.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    if (diffInHours < 730) return `${Math.floor(diffInHours / 168)} weeks ago`;
    return `${Math.floor(diffInHours / 730)} months ago`;
  };

  return (
    <>
      {/* Email Gate Modal */}
      <EmailGateModal
        isOpen={showEmailGate && !hasAccess}
        onClose={() => setShowEmailGate(false)}
        onSubmit={handleEmailSubmit}
      />

      <main className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative py-12 bg-gradient-to-b from-zinc-900 to-black border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Resource Library
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Curated AI Tools & Resources
              </h1>
              <p className="text-lg text-zinc-400 max-w-2xl mb-6">
                Discover the best AI tools, frameworks, and learning materials.
                Track what&apos;s trending in the community.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resources..."
                  className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-zinc-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('featured')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                      viewMode === 'featured' 
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-500/20' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Star className="w-4 h-4" />
                    Featured
                  </button>
                  <button
                    onClick={() => setViewMode('all')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                      viewMode === 'all' 
                        ? 'bg-zinc-700 text-white' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    Library
                  </button>
                </div>
                
                <div className="text-sm text-zinc-400">
                  {viewMode === 'featured' ? 'Showing curated picks' : 'Showing all resources'}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                {/* Sort Tabs */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSortBy('trending')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      sortBy === 'trending' 
                        ? 'bg-accent text-white' 
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    Trending
                  </button>
                  <button
                    onClick={() => setSortBy('popular')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      sortBy === 'popular' 
                        ? 'bg-accent text-white' 
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Star className="w-4 h-4" />
                    Popular
                  </button>
                  <button
                    onClick={() => setSortBy('new')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      sortBy === 'new' 
                        ? 'bg-accent text-white' 
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    New
                  </button>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-zinc-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Feed */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 animate-pulse">
                    <div className="h-6 bg-zinc-800 rounded w-1/3 mb-3"></div>
                    <div className="h-4 bg-zinc-800 rounded w-2/3 mb-4"></div>
                    <div className="flex gap-4">
                      <div className="h-4 bg-zinc-800 rounded w-20"></div>
                      <div className="h-4 bg-zinc-800 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : resources.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-zinc-400 mb-4">No resources found</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="text-accent hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : viewMode === 'featured' ? (
              // Featured Mode - Vertical prominent cards
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {resources
                  .filter(r => r.featured)
                  .map((resource, index) => {
                  const Icon = typeIcons[resource.type] || Code;
                  const colors = categoryColors[resource.category] || categoryColors['Tools & Apps'];
                  
                  return (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-zinc-900 border-2 border-yellow-500/30 ${colors.border} border-l-4 rounded-xl p-8 hover:border-yellow-500/50 transition-all group relative ring-2 ring-yellow-500/20`}
                    >
                      {/* Gold shimmer */}
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent animate-shimmer pointer-events-none rounded-xl" />
                      
                      <div className="flex flex-col md:flex-row gap-6 relative">
                        {/* Icon */}
                        <div className={`w-16 h-16 ${colors.icon} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-8 h-8 ${colors.text}`} />
                        </div>
                        
                        {/* Main Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
                                {resource.title}
                                <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs rounded-full flex items-center gap-1.5">
                                  <Star className="w-4 h-4 fill-current" />
                                  Featured
                                </span>
                              </h3>
                              <p className="text-sm text-zinc-400">
                                by {resource.submitted_by || 'Z21 Bot'} · {formatTimeAgo(resource.created_at)}
                              </p>
                            </div>
                          </div>
                          
                          <p className="text-zinc-300 text-lg mb-4 leading-relaxed">
                            {resource.description}
                          </p>
                          
                          {/* Tags */}
                          {resource.tags && resource.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {resource.tags.map(tag => (
                                <span 
                                  key={tag} 
                                  className={`px-3 py-1.5 ${colors.bg} ${colors.text} text-sm rounded-lg font-medium`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {/* Clicks */}
                          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3">
                            <MousePointerClick className="w-4 h-4" />
                            <span className="font-semibold text-white">{resource.click_count || 0}</span>
                            <span>clicks</span>
                          </div>
                          
                          {/* Category Badge */}
                          <div className="mb-4">
                            <span className={`inline-block px-3 py-1.5 ${colors.bg} ${colors.text} rounded-lg text-sm font-medium`}>
                              {resource.category}
                            </span>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-3">
                            {resource.rich_content && (
                              <button
                                onClick={() => setSelectedResource(resource)}
                                className="w-full sm:w-auto px-6 py-3 bg-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-700 transition-all"
                              >
                                Details
                              </button>
                            )}
                            <button
                              onClick={() => handleResourceClick(resource)}
                              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-accent to-green-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-accent/50 transition-all flex items-center justify-center gap-2 group"
                            >
                              Explore
                              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              // Library Mode - Grid layout
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {resources.map((resource, index) => {
                  const Icon = typeIcons[resource.type] || Code;
                  const colors = categoryColors[resource.category] || categoryColors['Tools & Apps'];
                  
                  return (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`bg-zinc-900 border border-zinc-800 ${colors.border} border-l-4 rounded-xl p-5 hover:border-zinc-700 hover:shadow-xl transition-all group relative`}
                    >
                      <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-12 h-12 ${colors.icon} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-6 h-6 ${colors.text}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-white line-clamp-1 mb-1">
                              {resource.title}
                            </h3>
                            <span className={`inline-block px-2 py-0.5 ${colors.bg} ${colors.text} rounded text-xs font-medium`}>
                              {resource.category}
                            </span>
                          </div>
                        </div>
                        
                        {/* Description */}
                        <p className="text-zinc-400 text-sm mb-4 line-clamp-2 flex-grow">
                          {resource.description}
                        </p>
                        
                        {/* Footer */}
                        <div className="space-y-2">
                          {/* Clicks only */}
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                            <MousePointerClick className="w-3.5 h-3.5" />
                            <span className="font-semibold text-white">{resource.click_count || 0}</span>
                            <span>clicks</span>
                          </div>
                          
                          {/* CTA Button(s) */}
                          <div className="w-full flex flex-col gap-2">
                            {resource.rich_content && (
                              <button
                                onClick={() => setSelectedResource(resource)}
                                className="w-full px-4 py-2 bg-zinc-800 text-white text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors"
                              >
                                Details
                              </button>
                            )}
                            <button
                              onClick={() => handleResourceClick(resource)}
                              className="w-full px-4 py-2 bg-zinc-800 text-white text-sm font-medium rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2 group"
                            >
                              View Resource
                              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </section>

        {/* Resource Details Modal */}
        {selectedResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setSelectedResource(null)}
            />
            <div className="relative z-10 max-w-3xl w-full bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <h3 className="text-lg font-semibold">{selectedResource.title}</h3>
                <button
                  className="p-2 text-zinc-400 hover:text-white"
                  onClick={() => setSelectedResource(null)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <div className="prose prose-invert max-w-none">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: selectedResource.rich_content || ''
                    }}
                  />
                </div>
              </div>
              <div className="p-4 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                  onClick={() => setSelectedResource(null)}
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-accent rounded-lg text-white hover:bg-accent/90 transition-colors flex items-center gap-2"
                  onClick={() => {
                    handleResourceClick(selectedResource);
                    setSelectedResource(null);
                  }}
                >
                  Visit
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <section className="py-20 border-t border-zinc-800">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">Ready to implement AI?</h2>
              <p className="text-xl text-zinc-400 mb-8">
                Get personalized guidance and hands-on support in our AI sprint
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/vibe-check"
                  className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-all"
                >
                  Apply for Sprint
                </Link>
                <Link
                  href="/"
                  className="px-6 py-3 bg-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-700 transition-all"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
