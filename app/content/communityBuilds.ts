export interface CommunityBuild {
  id: string;
  title: string;
  description: string;
  studentName: string;
  studentRole: string;
  cohort: string;
  thumbnail?: string;
  demoUrl?: string;
  githubUrl?: string;
  tags: string[];
  impactMetrics?: string;
  toolsUsed: string[];
  featured?: boolean;
  createdAt: string;
}

export const cohorts = [
  'All Cohorts',
  'AI Onboarding Sprint #1',
  'Feb 2026 Cohort',
  'Pilot Program'
];

export const communityBuilds: CommunityBuild[] = [
  {
    id: 'example-1',
    title: 'Automated Lead Follow-Up System',
    description: 'Built a complete automation that responds to leads within 60 seconds, qualifies them, and books calendar slots automatically.',
    studentName: 'Maria Santos',
    studentRole: 'Real Estate Agent',
    cohort: 'Pilot Program',
    tags: ['automation', 'crm', 'lead-gen'],
    impactMetrics: 'Saved 15 hours/week, 3x faster response time',
    toolsUsed: ['Make.com', 'ChatGPT', 'Google Sheets', 'Calendly'],
    featured: true,
    createdAt: '2025-10-15'
  },
  {
    id: 'example-2',
    title: 'Content Repurposing Engine',
    description: 'Turned long-form videos into 10+ social media posts automatically. AI extracts key points, generates captions, and schedules posts.',
    studentName: 'John Reyes',
    studentRole: 'Content Creator',
    cohort: 'Pilot Program',
    tags: ['content', 'automation', 'social-media'],
    impactMetrics: '10x content output, 20 hours saved monthly',
    toolsUsed: ['ChatGPT', 'n8n', 'Notion', 'Buffer'],
    featured: true,
    createdAt: '2025-10-20'
  },
  {
    id: 'example-3',
    title: 'Client Dashboard Generator',
    description: 'One-click dashboard that pulls data from multiple sources and generates beautiful client reports with AI-written insights.',
    studentName: 'Sarah Chen',
    studentRole: 'Marketing Consultant',
    cohort: 'Pilot Program',
    tags: ['reporting', 'dashboard', 'analytics'],
    impactMetrics: 'Reports in 5 mins instead of 2 hours',
    toolsUsed: ['Google Data Studio', 'ChatGPT', 'Zapier'],
    featured: false,
    createdAt: '2025-10-25'
  }
];

// Helper functions
export function filterBuilds(
  cohort?: string,
  searchQuery?: string,
  tag?: string
): CommunityBuild[] {
  let filtered = [...communityBuilds];

  if (cohort && cohort !== 'All Cohorts') {
    filtered = filtered.filter(b => b.cohort === cohort);
  }

  if (tag) {
    filtered = filtered.filter(b => b.tags.includes(tag));
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(b =>
      b.title.toLowerCase().includes(query) ||
      b.description.toLowerCase().includes(query) ||
      b.tags.some(t => t.toLowerCase().includes(query)) ||
      b.studentName.toLowerCase().includes(query)
    );
  }

  return filtered;
}

export function getFeaturedBuilds(): CommunityBuild[] {
  return communityBuilds.filter(b => b.featured);
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  communityBuilds.forEach(build => {
    build.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}
