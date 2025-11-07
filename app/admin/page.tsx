'use client';

import { useState, useEffect } from 'react';
import AdminAuth from './components/AdminAuth';
import ApplicantsChart from './components/ApplicantsChart';
import { 
  BarChart3, 
  Users, 
  Upload, 
  Mail,
  BookOpen,
  Sparkles,
  AlertCircle,
  Download,
  Trash2,
  Search,
  Filter,
  X,
  TrendingUp,
  Database
} from 'lucide-react';
import { 
  useAdminStats, 
  useRecentActivity, 
  useApplicants, 
  useSubscribers,
  getQualificationStatus,
  formatTimeAgo
} from './hooks/useAdminData';
import { exportToCSV, formatApplicantsForCSV, formatSubscribersForCSV } from '@/lib/csvExport';

type TabType = 'overview' | 'uploads' | 'applicants' | 'subscribers' | 'resources';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, shortLabel: 'Home' },
    { id: 'applicants', label: 'Applicants', icon: Users, shortLabel: 'Apply' },
    { id: 'subscribers', label: 'Subscribers', icon: Mail, shortLabel: 'Subs' },
    { id: 'resources', label: 'Resources', icon: BookOpen, shortLabel: 'Docs' },
    { id: 'uploads', label: 'Upload', icon: Upload, shortLabel: 'Add' }
  ];

  return (
    <AdminAuth>
      <div className="min-h-screen bg-zinc-950 text-white pb-20 lg:pb-0">
        {/* Mobile Header */}
        <header className="lg:hidden border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-sm sticky top-0 z-40">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <h1 className="text-lg font-bold">Z21 Admin</h1>
            </div>
          </div>
        </header>

        <div className="lg:flex">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 border-r border-zinc-800 bg-zinc-900/30 min-h-screen sticky top-0">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <h1 className="text-xl font-bold">Z21 Admin</h1>
              </div>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-accent/10 text-accent border border-accent/20'
                          : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full">
            {activeTab === 'overview' && <OverviewSection />}
            {activeTab === 'uploads' && <UploadsSection />}
            {activeTab === 'applicants' && <ApplicantsSection />}
            {activeTab === 'subscribers' && <SubscribersSection />}
            {activeTab === 'resources' && <ResourcesSection />}
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800 z-50 safe-area-bottom">
          <div className="flex items-center justify-around px-2 py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[60px] ${
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-zinc-400'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                  <span className="text-[10px] font-medium">{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </AdminAuth>
  );
}

// Overview Section
function OverviewSection() {
  const { stats, loading: statsLoading, error: statsError } = useAdminStats();
  const { activities, loading: activityLoading, error: activityError } = useRecentActivity();

  if (statsError || activityError) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-800 rounded-xl">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        <div>
          <p className="text-red-500 font-semibold text-sm">Error loading data</p>
          <p className="text-red-400 text-xs">{statsError || activityError}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Applicants', value: stats.totalApplicants.toString(), icon: Users, color: 'accent' },
    { label: 'Qualified Leads', value: stats.qualifiedLeads.toString(), icon: TrendingUp, color: 'green-500' },
    { label: 'Newsletter', value: stats.newsletterSubscribers.toString(), icon: Mail, color: 'blue-500' },
    { label: 'AI Resources', value: stats.resourcesCount.toString(), icon: Database, color: 'purple-500' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl lg:text-3xl font-bold">Dashboard</h2>
      
      {/* Stats Grid - Mobile: 2 cols, Desktop: 4 cols */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-${stat.color}/10 rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 lg:w-6 lg:h-6 text-${stat.color}`} />
                </div>
              </div>
              {statsLoading ? (
                <div className="animate-pulse">
                  <div className="h-6 lg:h-8 bg-zinc-800 rounded mb-2"></div>
                  <div className="h-3 lg:h-4 bg-zinc-800 rounded w-3/4"></div>
                </div>
              ) : (
                <>
                  <p className="text-2xl lg:text-3xl font-bold text-white mb-1 lg:mb-2">{stat.value}</p>
                  <p className="text-zinc-400 text-xs lg:text-sm leading-tight">{stat.label}</p>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Chart - Hidden on mobile */}
      <div className="hidden lg:block">
        <ApplicantsChart />
      </div>

      {/* Recent Activity */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 lg:p-6">
        <h3 className="text-lg lg:text-xl font-bold mb-4">Recent Activity</h3>
        {activityLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse py-3 border-b border-zinc-800 last:border-0">
                <div className="h-4 bg-zinc-800 rounded mb-2"></div>
                <div className="h-3 bg-zinc-800 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div 
                key={activity.id} 
                className={`py-3 ${index < activities.length - 1 ? 'border-b border-zinc-800' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm lg:text-base font-medium">{activity.title}</p>
                    <p className="text-xs lg:text-sm text-zinc-400 truncate">{activity.description}</p>
                  </div>
                  <span className="text-[10px] lg:text-xs text-zinc-500 flex-shrink-0">{formatTimeAgo(activity.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-400 text-sm">No recent activity</p>
        )}
      </div>
    </div>
  );
}

// Uploads Section
function UploadsSection() {
  const [uploadType, setUploadType] = useState<'build' | 'resource'>('build');
  
  // Resource form state
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Getting Started');
  const [type, setType] = useState<'tool' | 'article' | 'video' | 'prompt-library' | 'course' | 'forum'>('tool');
  const [tags, setTags] = useState('');
  const [featured, setFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !url || !description) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      // Generate ID from title (lowercase, replace spaces with hyphens)
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      
      // Parse tags
      const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t);

      const response = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          title,
          description,
          url,
          type,
          category,
          tags: tagsArray,
          featured
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create resource');
      }

      setMessage({ type: 'success', text: 'Resource created successfully!' });
      
      // Clear form
      setTitle('');
      setUrl('');
      setDescription('');
      setCategory('Getting Started');
      setType('tool');
      setTags('');
      setFeatured(false);
      
      // Reload page after 2 seconds to show new resource
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      setMessage({ type: 'error', text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <h2 className="text-2xl lg:text-3xl font-bold">Upload Content</h2>
      
      <div className="flex gap-2">
        <button
          onClick={() => setUploadType('build')}
          className={`flex-1 lg:flex-none px-4 py-2.5 rounded-lg font-medium transition-all text-sm lg:text-base ${
            uploadType === 'build' ? 'bg-accent text-white' : 'bg-zinc-800 text-zinc-400'
          }`}
        >
          Student Build
        </button>
        <button
          onClick={() => setUploadType('resource')}
          className={`flex-1 lg:flex-none px-4 py-2.5 rounded-lg font-medium transition-all text-sm lg:text-base ${
            uploadType === 'resource' ? 'bg-accent text-white' : 'bg-zinc-800 text-zinc-400'
          }`}
        >
          AI Resource
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 lg:p-6 space-y-4">
        <h3 className="text-lg lg:text-xl font-bold">
          {uploadType === 'build' ? 'Add Student Build' : 'Add AI Resource'}
        </h3>
        
        {message && (
          <div className={`p-3 rounded-lg flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-900/20 border border-green-800 text-green-500' 
              : 'bg-red-900/20 border border-red-800 text-red-500'
          }`}>
            {message.type === 'success' ? '✓' : '✗'} {message.text}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm lg:text-base"
            placeholder={uploadType === 'build' ? 'AI-Powered Dashboard' : 'Claude API Guide'}
          />
        </div>
        
        {uploadType === 'build' && (
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Student Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm lg:text-base"
              placeholder="John Doe"
            />
          </div>
        )}
        
        {uploadType === 'resource' && (
          <>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm lg:text-base"
                placeholder="https://..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value as 'tool' | 'article' | 'video' | 'prompt-library' | 'course' | 'forum')}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm lg:text-base"
              >
                <option value="tool">Tool</option>
                <option value="article">Article</option>
                <option value="video">Video</option>
                <option value="prompt-library">Prompt Library</option>
                <option value="course">Course</option>
                <option value="forum">Forum</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm lg:text-base"
              >
                <option>Getting Started</option>
                <option>Tools & Apps</option>
                <option>ML Frameworks</option>
                <option>Inference & Serving</option>
                <option>Benchmarks & Evals</option>
                <option>Learning Resources</option>
                <option>Prompts & Templates</option>
                <option>Research Papers</option>
                <option>Communities</option>
                <option>Advanced</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm lg:text-base"
                placeholder="free, tutorial, beginner"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="featured" className="text-sm text-zinc-400">
                Featured resource
              </label>
            </div>
          </>
        )}
        
        {uploadType === 'build' && (
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Tools Used</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm lg:text-base"
              placeholder="Next.js, Supabase, OpenAI"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm lg:text-base"
            rows={4}
            placeholder={uploadType === 'build' ? 'Built an automated dashboard that...' : 'Comprehensive guide for...'}
          />
        </div>
        
        <button
          type="submit"
          disabled={submitting}
          className="w-full lg:w-auto px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Adding...' : (uploadType === 'build' ? 'Add Build' : 'Add Resource')}
        </button>
      </form>
    </div>
  );
}

// Applicants Section
function ApplicantsSection() {
  const { applicants, loading, error } = useApplicants();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleting, setDeleting] = useState(false);

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl lg:text-3xl font-bold">Applicants</h2>
        <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-800 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-red-500 font-semibold text-sm">Error loading applicants</p>
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const filtered = applicants.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    
    if (statusFilter === 'all') return true;
    const status = getQualificationStatus(app.qualification_status);
    return status === statusFilter;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    } else {
      return sortOrder === 'desc' ? b.score - a.score : a.score - b.score;
    }
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} applicant(s)?`)) return;

    setDeleting(true);
    try {
      const res = await fetch('/api/admin/applicants/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      alert(json.message);
      setSelectedIds([]);
      window.location.reload();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      alert('Delete failed: ' + msg);
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    const formatted = formatApplicantsForCSV(filtered);
    exportToCSV(formatted, `applicants-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl lg:text-3xl font-bold">Applicants</h2>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            disabled={filtered.length === 0}
            className="p-2 lg:px-4 lg:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span className="hidden lg:inline text-sm">Export</span>
          </button>
          {selectedIds.length > 0 && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 lg:px-4 lg:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden lg:inline text-sm">({selectedIds.length})</span>
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex-1 lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 text-sm"
        >
          <Filter className="w-4 h-4" />
          Filters
          {(statusFilter !== 'all' || sortBy !== 'date') && (
            <span className="w-2 h-2 bg-accent rounded-full"></span>
          )}
        </button>

        <div className="hidden lg:flex gap-2 flex-1">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm"
          >
            <option value="all">All Status</option>
            <option value="qualified">Qualified</option>
            <option value="review">Review</option>
            <option value="rejected">Not Qualified</option>
          </select>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split('-');
              setSortBy(by as 'date' | 'score');
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="score-desc">Highest Score</option>
            <option value="score-asc">Lowest Score</option>
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="lg:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Filters</h3>
            <button onClick={() => setShowFilters(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="qualified">Qualified</option>
              <option value="review">Review</option>
              <option value="rejected">Not Qualified</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Sort By</label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-');
                setSortBy(by as 'date' | 'score');
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="score-desc">Highest Score</option>
              <option value="score-asc">Lowest Score</option>
            </select>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden lg:block bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Business</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Score</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-3"><div className="h-4 bg-zinc-800 rounded w-24"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-zinc-800 rounded w-32"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-zinc-800 rounded w-28"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-zinc-800 rounded w-12"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-zinc-800 rounded w-20"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-zinc-800 rounded w-24"></div></td>
                </tr>
              ))
            ) : filtered.length > 0 ? (
              filtered.map((applicant) => {
                const status = getQualificationStatus(applicant.qualification_status);
                const statusConfig = {
                  qualified: { text: 'Qualified', color: 'green-500' },
                  review: { text: 'Review', color: 'yellow-500' },
                  rejected: { text: 'Not Qualified', color: 'red-500' }
                };
                const config = statusConfig[status];

                return (
                  <tr key={applicant.id} className="hover:bg-zinc-800/30">
                    <td className="px-4 py-3 text-white">{applicant.name}</td>
                    <td className="px-4 py-3 text-zinc-400">{applicant.email}</td>
                    <td className="px-4 py-3 text-zinc-400">
                      {applicant.business_description?.substring(0, 30)}...
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-${config.color} font-semibold`}>
                        {applicant.score}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 bg-${config.color}/10 text-${config.color} text-xs font-medium rounded`}>
                        {config.text}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {new Date(applicant.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-400 text-sm">
                  {searchTerm || statusFilter !== 'all' ? 'No matching applicants' : 'No applicants yet'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-zinc-800 rounded w-32 mb-2"></div>
              <div className="h-3 bg-zinc-800 rounded w-48 mb-3"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-zinc-800 rounded w-20"></div>
                <div className="h-6 bg-zinc-800 rounded w-16"></div>
              </div>
            </div>
          ))
        ) : filtered.length > 0 ? (
          filtered.map((applicant) => {
            const status = getQualificationStatus(applicant.qualification_status);
            const statusConfig = {
              qualified: { text: 'Qualified', color: 'green-500', emoji: '🎯' },
              review: { text: 'Review', color: 'yellow-500', emoji: '⚠️' },
              rejected: { text: 'Not Qualified', color: 'red-500', emoji: '❌' }
            };
            const config = statusConfig[status];

            return (
              <div key={applicant.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(applicant.id)}
                    onChange={() => toggleSelect(applicant.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{applicant.name}</h3>
                    <p className="text-sm text-zinc-400 truncate">{applicant.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 bg-${config.color}/10 text-${config.color} text-xs rounded flex items-center gap-1`}>
                        <span>{config.emoji}</span>
                        <span>{config.text}</span>
                      </span>
                      <span className="text-xs text-zinc-500">Score: {applicant.score}</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                      {new Date(applicant.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-400 text-sm">
            {searchTerm || statusFilter !== 'all' ? 'No matching applicants' : 'No applicants yet'}
          </div>
        )}
      </div>
    </div>
  );
}

// Subscribers Section
function SubscribersSection() {
  const { subscribers, loading, error } = useSubscribers();
  const [searchTerm, setSearchTerm] = useState('');

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl lg:text-3xl font-bold">Subscribers</h2>
        <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-800 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-red-500 font-semibold text-sm">Error loading subscribers</p>
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const filtered = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const formatted = formatSubscribersForCSV(filtered);
    exportToCSV(formatted, `subscribers-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl lg:text-3xl font-bold">Subscribers</h2>
        <button
          onClick={handleExport}
          disabled={filtered.length === 0}
          className="p-2 lg:px-4 lg:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span className="hidden lg:inline text-sm">Export</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-zinc-800 rounded w-48 mb-2"></div>
              <div className="h-3 bg-zinc-800 rounded w-24"></div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((subscriber) => (
            <div key={subscriber.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{subscriber.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded">
                      {subscriber.source}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {new Date(subscriber.subscribed_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-400 text-sm">
          {searchTerm ? 'No matching subscribers' : 'No subscribers yet'}
        </div>
      )}
    </div>
  );
}

// Resources Section
interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: string;
  category: string;
  tags?: string[];
  featured?: boolean;
  thumbnail?: string | null;
  created_at?: string;
}

function ResourcesSection() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch('/api/admin/resources')
      .then(res => res.json())
      .then(data => {
        setResources(data.resources || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl lg:text-3xl font-bold">Resources</h2>
        <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-800 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-red-500 font-semibold text-sm">Error loading resources</p>
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const filtered = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedResources = showAll ? filtered : filtered.slice(0, 12);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl lg:text-3xl font-bold">Resources</h2>
        <span className="text-sm text-zinc-400">
          {resources.length} total
        </span>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm"
        />
      </div>
      
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-zinc-800 rounded w-48 mb-2"></div>
              <div className="h-3 bg-zinc-800 rounded w-64"></div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {displayedResources.map((resource) => (
              <div key={resource.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-white">{resource.title}</h3>
                  {resource.featured && (
                    <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded flex-shrink-0">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 mb-2 line-clamp-2">{resource.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">{resource.category}</span>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent text-xs hover:underline"
                  >
                    View →
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          {filtered.length > 12 && (
            <div className="text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors text-sm"
              >
                {showAll ? `Show Less` : `Show All (${filtered.length - 12} more)`}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-400 text-sm">
          {searchTerm ? 'No matching resources' : 'No resources yet'}
        </div>
      )}
    </div>
  );
}
