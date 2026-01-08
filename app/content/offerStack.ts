export interface OfferItem {
  id: 'cohort' | 'coaching' | 'workshop';
  title: string;
  subtitle: string;
  cardSubtitle: string; // Short subtitle for the card
  targets: string[];
  format: string;
  deliverables: string[];
  extras: string[];
  pricing: string;
  ctaLabel: string;
  ctaRoute: string;
  dmKeywords: string[];
  modelAsset?: string; // Path to GLB model (future use)
  fallbackImage?: string; // Path to fallback image
  seasonOpen?: boolean; // For cohort availability
  acceptingClients?: boolean; // For coaching availability
  workshopTopics?: string[]; // For B2B workshop topics
  isActive?: boolean; // For showing "Accepting Now" badge
}

export const offerStack: OfferItem[] = [
  {
    id: 'coaching',
    title: 'Solo',
    subtitle: 'For solo operators & founders',
    cardSubtitle: 'For operators & founders.',
    targets: [
      'Founders and creators who want private guidance or sensitive context'
    ],
    format: '4–6 weeks, 2 calls per week; focused advisory and hands-on reviews around one main objective',
    deliverables: [
      'Offer clarity + funnel map',
      'Workflow design or Brand OS',
      'Assets review and upgrade'
    ],
    extras: [
      'Frameworks, resources, metric trackers, systems',
      'Fixed cost package'
    ],
    pricing: 'Fixed package price.',
    ctaLabel: 'Apply now ',
    ctaRoute: '/vibe-check',
    dmKeywords: ['COACH', '1ON1'],
    acceptingClients: true,
    isActive: true
  },
  {
    id: 'workshop',
    title: 'Teams',
    subtitle: 'For startup smb and lean teams',
    cardSubtitle: 'For startup SMB and lean teams.',
    targets: [
      'Internal teams (Finance, Ops, Sales, Marketing, Product/IT)'
    ],
    format: 'One-day or multi-session workshop that installs 1–2 production workflows',
    deliverables: [
      'TCREI + RSTI prompting',
      'Human-in-the-loop design',
      'Quick-win workflows',
      'Custom GPT blueprint',
      'Impact scoreboard'
    ],
    extras: [
      'Per team, 1–2 days',
      'Tailored topic for audience',
      'Frameworks, resources, metric trackers, systems',
      'Variable pricing depending on demand'
    ],
    pricing: 'Variable by scope and demand.',
    ctaLabel: 'Learn more',
    ctaRoute: 'https://calendly.com/troyenzo/30min',
    dmKeywords: ['BUILD', 'TEAM'],
    workshopTopics: [
      'AI workflow automation',
      'Prompt engineering',
      'Team productivity systems'
    ],
    isActive: true
  },
  {
    id: 'cohort',
    title: 'Cohort',
    subtitle: 'Group session with live sprint in 6 weeks',
    cardSubtitle: 'Group session with live sprint in 6 weeks.',
    targets: [
      'Founders',
      'Builders',
      'Entrepreneurs (B2C/B2B solo or early-stage)'
    ],
    format: '6-week sprint with live sessions, hot seats, and a public scoreboard.',
    deliverables: [
      'Offer page with checkout',
      '90-second VSL shipped',
      'Booking system live',
      '1 production AI workflow'
    ],
    extras: [
      'Seasonal cadence with access to community, frameworks, resources',
      'Metric trackers and systems',
      'Price increases each season as seats scale (like Tom Noske\'s model)'
    ],
    pricing: 'Cost per seat. Seasonal price increase.',
    ctaLabel: 'Coming Soon',
    ctaRoute: '#',
    dmKeywords: ['COHORT'],
    seasonOpen: false,
    isActive: false
  }
];
