export interface RoadmapMilestone {
  id: number;
  phase: string;
  title: string;
  status: 'active' | 'upcoming' | 'planned' | 'future';
  description: string;
  icon: string;
  details?: string[];
}

export const roadmapMilestones: RoadmapMilestone[] = [
  {
    id: 1,
    phase: "Now",
    title: "Launch Cohort Community + Offers",
    status: "active",
    description: "Building the foundation with our initial community platform and core offerings",
    icon: "🚀",
    details: [
      "Community platform live",
      "Initial sprint programs available",
      "Foundation building phase"
    ]
  },
  {
    id: 2,
    phase: "Feb 2026",
    title: "Cohort Launch",
    status: "upcoming",
    description: "First official cohort program with structured group-based learning",
    icon: "👥",
    details: [
      "6-week intensive program",
      "Group-based learning dynamics",
      "Peer accountability system"
    ]
  },
  {
    id: 3,
    phase: "Q2 2026",
    title: "Open Workshops",
    status: "planned",
    description: "Public workshop series for broader AI education and adoption",
    icon: "🎯",
    details: [
      "Topic-specific sessions",
      "Industry partnerships",
      "Accessible AI education"
    ]
  },
  {
    id: 4,
    phase: "Q3 2026",
    title: "Z21 Head Hunting",
    status: "planned",
    description: "Matchmaking service connecting AI developers with opportunities",
    icon: "🤝",
    details: [
      "Talent marketplace launch",
      "AI dev matchmaking",
      "Corporate connections"
    ]
  },
  {
    id: 5,
    phase: "Q4 2026",
    title: "IRL Events for AI",
    status: "future",
    description: "In-person gatherings to strengthen the AI community",
    icon: "🌐",
    details: [
      "Networking events",
      "Community meetups",
      "Live demonstrations"
    ]
  },
  {
    id: 6,
    phase: "2027",
    title: "Prompt Engineering for Everyone",
    status: "future",
    description: "Democratizing AI education for all ages, including kids and teenagers",
    icon: "🎓",
    details: [
      "Youth programs",
      "School partnerships",
      "Educational curriculum"
    ]
  },
  {
    id: 7,
    phase: "2027",
    title: "Z21 Accelerator Program",
    status: "future",
    description: "Full-scale startup support ecosystem for AI-driven ventures",
    icon: "🏆",
    details: [
      "Startup incubation",
      "Funding connections",
      "Demo days"
    ]
  }
];
