'use client';

import { useState, useEffect } from 'react';
import AdminAuth from './components/AdminAuth';
import ApplicantsChart from './components/ApplicantsChart';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Upload, 
  Database,
  TrendingUp,
  Mail,
  BookOpen,
  Sparkles,
  AlertCircle
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
import { Trash2, Download, Search, Filter } from 'lucide-react';

type TabType = 'overview' | 'uploads' | 'applicants' | 'subscribers' | 'resources';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'uploads', label: 'Upload Content', icon: Upload },
    { id: 'applicants', label: 'Applicants', icon: Users },
    { id: 'subscribers', label: 'Subscribers', icon: Mail },
    { id: 'resources', label: 'Resources', icon: BookOpen }
  ];

  return (
    <AdminAuth>
      <div className="min-h-screen bg-zinc-950 text-white">
        {/* Header */}
        <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <h1 className="text-2xl font-bold">Z21 Admin Dashboard</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 border-r border-zinc-800 bg-zinc-900/30 min-h-[calc(100vh-73px)]">
            <nav className="p-4 space-y-2">
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
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {activeTab === 'overview' && <OverviewSection />}
            {activeTab === 'uploads' && <UploadsSection />}
            {activeTab === 'applicants' && <ApplicantsSection />}
            {activeTab === 'subscribers' && <SubscribersSection />}
            {activeTab === 'resources' && <ResourcesSection />}
          </main>
        </div>
      </div>
    </AdminAuth>
  );
}

// Overview Section with stats
function OverviewSection() {
  const { stats, loading: statsLoading, error: statsError } = useAdminStats();
  const { activities, loading: activityLoading, error: activityError } = useRecentActivity();

  if (statsError || activityError) {
    return (
      <div className="flex items-center gap-3 p-6 bg-red-900/20 border border-red-800 rounded-xl">
        <AlertCircle className="w-6 h-6 text-red-500" />
        <div>
          <p className="text-red-500 font-semibold">Error loading dashboard data</p>
          <p className="text-red-400 text-sm">{statsError || activityError}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Applicants', value: stats.totalApplicants.toString(), icon: Users },
    { label: 'Qualified Leads', value: stats.qualifiedLeads.toString(), icon: TrendingUp },
    { label: 'Newsletter Subscribers', value: stats.newsletterSubscribers.toString(), icon: Mail },
    { label: 'AI Resources', value: stats.resourcesCount.toString(), icon: Database }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
              </div>
              {statsLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-zinc-800 rounded mb-2"></div>
                  <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                </div>
              ) : (
                <>
                  <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                  <p className="text-zinc-400 text-sm">{stat.label}</p>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Applicants Chart */}
      <div className="mb-8">
        <ApplicantsChart />
      </div>

      {/* Recent Activity */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
        {activityLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse py-3 border-b border-zinc-800">
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
                className={`flex items-center justify-between py-3 ${
                  index < activities.length - 1 ? 'border-b border-zinc-800' : ''
                }`}
              >
                <div>
                  <p className="text-white">{activity.title}</p>
                  <p className="text-sm text-zinc-400">{activity.description}</p>
                </div>
                <span className="text-xs text-zinc-500">{formatTimeAgo(activity.timestamp)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-400">No recent activity</p>
        )}
      </div>
    </div>
  );
}

// Upload Section
function UploadsSection() {
  const [uploadType, setUploadType] = useState<'build' | 'resource'>('build');

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Upload Content</h2>
      
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setUploadType('build')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            uploadType === 'build' 
              ? 'bg-accent text-white' 
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          Student Build
        </button>
        <button
          onClick={() => setUploadType('resource')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            uploadType === 'resource' 
              ? 'bg-accent text-white' 
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          AI Resource
        </button>
      </div>

      {uploadType === 'build' ? (
        <form className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h3 className="text-xl font-bold mb-4">Add Student Build</h3>
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Title</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
              placeholder="AI-Powered Dashboard"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Student Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
            <textarea
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white h-32"
              placeholder="Built an automated dashboard that..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Tools Used</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
              placeholder="Next.js, Supabase, OpenAI"
            />
          </div>
          
          <button
            type="submit"
            className="px-6 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90"
          >
            Add Build
          </button>
        </form>
      ) : (
        <form className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h3 className="text-xl font-bold mb-4">Add AI Resource</h3>
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Title</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
              placeholder="Claude API Guide"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">URL</label>
            <input
              type="url"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
              placeholder="https://..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Category</label>
            <select className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white">
              <option>Getting Started</option>
              <option>Tools & Apps</option>
              <option>ML Frameworks</option>
              <option>Learning Resources</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
            <textarea
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white h-24"
              placeholder="Comprehensive guide for..."
            />
          </div>
          
          <button
            type="submit"
            className="px-6 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90"
          >
            Add Resource
          </button>
        </form>
      )}
    </div>
  );
}

// Applicants Section with bulk delete, CSV export, search/filter
function ApplicantsSection() {
  const { applicants, loading, error } = useApplicants();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleting, setDeleting] = useState(false);

  if (error) {
    return (
      <div>
        <h2 className="text-3xl font-bold mb-6">Vibe-Check Applicants</h2>
        <div className="flex items-center gap-3 p-6 bg-red-900/20 border border-red-800 rounded-xl">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <div>
            <p className="text-red-500 font-semibold">Error loading applicants</p>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Filter and sort
  let filtered = applicants.filter(app => {
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

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(a => a.id));
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} applicant(s)? This cannot be undone.`)) return;

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
      window.location.reload(); // Simple refresh, or use state update
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    const formatted = formatApplicantsForCSV(filtered);
    exportToCSV(formatted, `applicants-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Vibe-Check Applicants</h2>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          {selectedIds.length > 0 && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
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
          className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="score-desc">Highest Score</option>
          <option value="score-asc">Lowest Score</option>
        </select>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-800/50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filtered.length && filtered.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4"
                />
              </th>
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
                  <td className="px-4 py-3"><div className="h-4 bg-zinc-800 rounded w-4"></div></td>
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
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(applicant.id)}
                        onChange={() => toggleSelect(applicant.id)}
                        className="w-4 h-4"
                      />
                    </td>
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
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-400">
                  {searchTerm || statusFilter !== 'all' ? 'No matching applicants' : 'No applicants yet'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Subscribers Section with bulk delete, CSV export, search
function SubscribersSection() {
  const { subscribers, loading, error } = useSubscribers();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleting, setDeleting] = useState(false);

  if (error) {
    return (
      <div>
        <h2 className="text-3xl font-bold mb-6">Newsletter Subscribers</h2>
        <div className="flex items-center gap-3 p-6 bg-red-900/20 border border-red-800 rounded-xl">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <div>
            <p className="text-red-500 font-semibold">Error loading subscribers</p>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'ai-resources': return 'accent';
      case 'homepage': return 'blue-500';
      case 'footer': return 'purple-500';
      default: return 'zinc-500';
    }
  };

  // Filter and sort
  let filtered = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  filtered.sort((a, b) => {
    const dateA = new Date(a.subscribed_at).getTime();
    const dateB = new Date(b.subscribed_at).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(s => s.id));
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} subscriber(s)? This cannot be undone.`)) return;

    setDeleting(true);
    try {
      const res = await fetch('/api/admin/subscribers/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      alert(json.message);
      setSelectedIds([]);
      window.location.reload();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    const formatted = formatSubscribersForCSV(filtered);
    exportToCSV(formatted, `subscribers-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Newsletter Subscribers</h2>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          {selectedIds.length > 0 && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      {/* Search and Sort */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500"
          />
        </div>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>
      
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-800/50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filtered.length && filtered.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Source</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-3"><div className="h-4 bg-zinc-800 rounded w-4"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-zinc-800 rounded w-48"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-zinc-800 rounded w-24"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-zinc-800 rounded w-32"></div></td>
                </tr>
              ))
            ) : filtered.length > 0 ? (
              filtered.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-zinc-800/30">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(subscriber.id)}
                      onChange={() => toggleSelect(subscriber.id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="px-4 py-3 text-white">{subscriber.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 bg-${getSourceColor(subscriber.source)}/10 text-${getSourceColor(subscriber.source)} text-xs font-medium rounded`}>
                      {subscriber.source}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {new Date(subscriber.subscribed_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-400">
                  {searchTerm ? 'No matching subscribers' : 'No subscribers yet'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Resources Section with full CRUD, pagination, search
function ResourcesSection() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);

  const categories = [
    'All', 'Getting Started', 'Tools & Apps', 'ML Frameworks',
    'Inference & Serving', 'Benchmarks & Evals', 'Prompts & Templates',
    'Learning Resources', 'Research Papers', 'Communities', 'Advanced'
  ];

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });
      if (category !== 'All') params.set('category', category);
      if (searchTerm) params.set('search', searchTerm);

      const res = await fetch(`/api/admin/resources?${params}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setResources(json.resources || []);
      setTotal(json.total || 0);
      setTotalPages(json.totalPages || 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [page, category, searchTerm]);

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const res = await fetch(`/api/admin/resources/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      fetchResources();
    } catch (err: any) {
      alert('Failed to toggle featured: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this resource? This cannot be undone.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/resources/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      alert(json.message);
      fetchResources();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (error) {
    return (
      <div>
        <h2 className="text-3xl font-bold mb-6">AI Resources Management</h2>
        <div className="flex items-center gap-3 p-6 bg-red-900/20 border border-red-800 rounded-xl">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <div>
            <p className="text-red-500 font-semibold">Error loading resources</p>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">AI Resources Management</h2>
        <div className="text-sm text-zinc-400">
          Total: <span className="text-white font-bold">{total}</span> resources
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500"
          />
        </div>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Featured</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-3"><div className="h-4 bg-zinc-800 rounded w-48"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-zinc-800 rounded w-24"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-zinc-800 rounded w-16"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-zinc-800 rounded w-16"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-zinc-800 rounded w-20"></div></td>
                </tr>
              ))
            ) : resources.length > 0 ? (
              resources.map((resource) => (
                <tr key={resource.id} className="hover:bg-zinc-800/30">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-white font-medium">{resource.title}</p>
                      <p className="text-xs text-zinc-400 truncate max-w-md">{resource.description}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{resource.category}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs font-medium rounded">
                      {resource.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleFeatured(resource.id, resource.featured)}
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        resource.featured
                          ? 'bg-accent/10 text-accent'
                          : 'bg-zinc-700 text-zinc-400'
                      }`}
                    >
                      {resource.featured ? '⭐ Featured' : 'Not Featured'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleDelete(resource.id)}
                        disabled={deleting}
                        className="text-red-400 hover:text-red-300 text-sm disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-400">
                  {searchTerm || category !== 'All' ? 'No matching resources' : 'No resources yet'}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800">
            <div className="text-sm text-zinc-400">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-zinc-800 text-white rounded hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 bg-zinc-800 text-white rounded hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
