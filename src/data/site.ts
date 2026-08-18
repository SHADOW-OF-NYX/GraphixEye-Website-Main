export const site = {
  name: 'GraphixEye',
  nameLower: 'graphixeye',
  tagline: 'We Do As We Promise',
  parent: 'Eram Printing & Packaging Factory Co.',
  established: '2009',
  phone: '+966 13 802 1919',
  email: 'info@eramprintandpack.com',
  web: 'www.eramprintandpack.com',
  address: ['P.O. Box 4416', '2nd Industrial City', 'Dammam 34341, KSA'],
  cta: 'Contact Us',
  contactHeadline: 'Not Sure Where to Start?',
  contactLead: "Let's connect and figure out the best route to achieve your vision together.",
};

export const navLinks = [
  { name: 'Showcase', path: '/showcase' },
  { name: 'Experience', path: '/experience' },
  { name: 'Commercial', path: '/contact' },
];

export const heroPoints = [
  'Guided briefs from identity to installation — designed for repeatable quality',
  'Self-contained production with clear safety, colour, and finishing standards',
  'Monitoring, reprints, new programs, and remote support across one point of contact',
];

export const studioSpecs = [
  { value: '2009', label: 'Established' },
  { value: 'Dammam', label: 'Headquarters' },
  { value: '1 POC', label: 'End-to-end production' },
];

export const studioFeatures = [
  { title: 'Design to install', body: 'Identity, signage, print, packaging, and gifting as one workflow.' },
  { title: 'Press & finish', body: 'Offset, digital, silk screen, UV, hot stamping, bindery.' },
  { title: 'Architectural fit', body: 'Exterior, interior, fleet, and exhibition systems for real spaces.' },
];

export const serviceTabs = [
  {
    id: 'design',
    title: 'The Studio. Ready-to-run identity from day one, no guesswork required.',
    points: [
      'Guided flow covering briefing to brand completion',
      'Self-contained UX reduces client rework',
      'Optional bilingual systems and custom protocols',
    ],
  },
  {
    id: 'signage',
    title: 'Support & production. On-site fabrication, monitoring, and rollout across locations.',
    points: [
      'Remote coordination and optional 24/7 project health checks',
      'Automatic reprints and rollout of new programs and protocols',
      'Built for multi-location scaling',
    ],
  },
  {
    id: 'print',
    title: 'The Ecosystem. From an on-site session to a long-term brand routine.',
    points: [
      'Short-run and industrial capacity for high daily throughput',
      'Flexible engagement: single jobs, packages, and retainers',
      'Supports retention through structured brand systems',
    ],
  },
];

export const operatorPoints = [
  {
    title: 'Monetization & clarity.',
    body: 'Campaigns, environments, and amenity upsells with a clear production case (unit cost × volume).',
  },
  {
    title: 'Operational simplicity.',
    body: 'One partner reduces vendor load. Minimal briefing needs with clear, repeatable workflows.',
  },
  {
    title: 'Premium differentiation.',
    body: 'Craft meets industrial finish. Modern, design-forward, and high-end. No catalogue coldness.',
  },
  {
    title: 'Production you can defend.',
    body: 'Guided colour and finishing logic instead of one-size-fits-all print. Updateable systems over time.',
  },
];

export const sessionSteps = [
  'Welcome & brief',
  'Goal selection',
  'Program explanation',
  'Production guidance',
  'Completion',
];

export const industries = [
  'Corporate HQs',
  'Industrial sites',
  'Hotels & retail',
  'Performance spaces',
  'Events & exhibitions',
];

export const standAlone = [
  {
    title: 'Architectural OpenFrame.',
    body: 'A premium production system designed to feel integrated into your space — not added as an afterthought.',
  },
  {
    title: 'Customized Protocols.',
    body: 'Precision-calibrated colour and material blends for repeatable outcomes and high brand retention.',
  },
  {
    title: 'Bespoke Execution.',
    body: 'No two GraphixEye programs are identical. Each brief is planned around your room, journey, team, and budget.',
  },
  {
    title: 'Self-Service Autonomy.',
    body: 'Clients can start safely via a guided brief, reducing dependency and improving scalability.',
  },
];

export const journey = [
  {
    title: 'Personal Consultation',
    body: 'Book a call to define your vision. We analyze your space and timeline to deliver a tailored offer and a preliminary production snapshot.',
  },
  {
    title: 'Bespoke Configuration',
    body: 'Once the plan is set, we finalize custom elements: branding, signature protocols, bilingual systems, and material upgrades.',
  },
  {
    title: 'Dammam Craftsmanship',
    body: 'Production begins in the 2nd Industrial City. Each system is built using high-end materials, colour tests, and full finishing integration.',
  },
  {
    title: 'White-Glove Deployment',
    body: 'We handle logistics. Assembly is performed by our internal experts — no loose contractor chain. Every install ends with a final check.',
  },
  {
    title: 'Onboarding & Growth',
    body: 'We do not just install; we launch. Training, marketing assets, reprint programs, and workshops to ensure long-term success.',
  },
];

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    id: 'seed-1',
    quote: 'GraphixEye became the single production partner we actually trust — identity, environments, and print that feel like one system.',
    name: 'Placeholder name',
    role: 'Brand lead · replace this',
    rating: 5,
  },
  {
    id: 'seed-2',
    quote: 'From fleet wraps to exhibition builds, the finish is consistent. We stopped juggling five vendors.',
    name: 'Placeholder name',
    role: 'Operations · replace this',
    rating: 5,
  },
  {
    id: 'seed-3',
    quote: 'The brief was treated like a protocol, not a guess. Colour, materials, and install landed as promised.',
    name: 'Placeholder name',
    role: 'Project manager · replace this',
    rating: 4,
  },
];

export const faqs = {
  client: [
    {
      q: 'What does GraphixEye actually produce?',
      a: 'Design, signage, printing, packaging, and gifting — from logo systems to architectural environments — as one production partner in Dammam.',
    },
    {
      q: 'What happens during the first brief?',
      a: 'We walk through welcome, safety and site constraints, goal selection, program explanation, then a production plan. After that the process is designed to feel simple, calm, and guided.',
    },
    {
      q: 'How long does a typical program take?',
      a: 'Short-run print can turn in days. Custom signage, packaging, and exhibition builds depend on site, materials, and approvals. We confirm a timeline in the first consultation.',
    },
    {
      q: 'Can we visit the factory?',
      a: 'Yes. GraphixEye operates from the 2nd Industrial City, Dammam. Partner walkthroughs can include the guest experience of a project, the production floor, and partnership potential.',
    },
    {
      q: 'Do you work outside Dammam?',
      a: 'Yes. We partner with industry leaders across the Kingdom — from headquarters and industrial sites to retail and events — from a single point of contact.',
    },
  ],
  partner: [
    {
      q: 'Who is GraphixEye designed for?',
      a: 'Premium operators who want a high-value brand experience without adding vendor complexity: corporates, industrial sites, hospitality, retail, and events.',
    },
    {
      q: 'Can the experience be customized for our brand?',
      a: 'Yes. Visual presentation, room concept, guest journey, naming, and selected experience elements can be adapted. Premium partners can explore signature protocols.',
    },
    {
      q: 'Can GraphixEye be used across multiple locations?',
      a: 'Yes. Guided briefing, repeatable finishing logic, and one production standard make it suitable for partners who want to launch across several sites.',
    },
    {
      q: 'How do we start?',
      a: 'Contact us. After a short partner call we provide a concrete offer with recommended setup, expected throughput, and a lightweight snapshot for your location.',
    },
  ],
};

export const clients = ['Aramco', 'SABIC', 'Maaden', 'Sadara', 'Lulu', 'Eram'];
