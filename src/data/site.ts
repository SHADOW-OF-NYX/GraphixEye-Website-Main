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
  'Identity, signage, print, packaging, and gifting from one factory floor',
  'Offset, digital, silk screen, UV, and bindery with colour you can check on press',
  'Reprints, rollouts, and install handled by the same Dammam team',
];

export const studioSpecs = [
  { value: '2009', label: 'Established' },
  { value: 'Dammam', label: 'Factory' },
  { value: 'One floor', label: 'Design through finishing' },
];

export const studioFeatures = [
  { title: 'Design to install', body: 'Identity, signage, print, packaging, and gifting under one roof.' },
  { title: 'Press & finish', body: 'Offset, digital, silk screen, UV, hot stamping, bindery.' },
  { title: 'Built for the site', body: 'Exterior, interior, fleet, and exhibition work made for real spaces.' },
];

export const serviceTabs = [
  {
    id: 'design',
    title: 'Design on the floor. Artwork that is ready to go to press.',
    points: [
      'Briefing through brand completion with our in-house designers',
      'Proofs and colour checks before anything hits the machines',
      'Bilingual artwork when the job needs Arabic and English together',
    ],
  },
  {
    id: 'signage',
    title: 'Signage & environments. Fabricated here, fitted on your site.',
    points: [
      'Exterior, interior, fleet, and exhibition builds from the Dammam floor',
      'Site surveys and install by our own crews',
      'Matching reprints when you open the next branch or hall',
    ],
  },
  {
    id: 'print',
    title: 'Print & finish. A single run or a daily industrial load.',
    points: [
      'Short-run and high-volume capacity on the same floor',
      'Offset, digital, silk screen, and UV printing',
      'Binding, lamination, die cutting, and hot stamping in house',
    ],
  },
];

export const operatorPoints = [
  {
    title: 'Clear production.',
    body: 'Finish, volume, and unit cost are agreed before we go to press — no catalogue guesswork.',
  },
  {
    title: 'One factory.',
    body: 'Design, print, finishing, and install from the same team instead of a chain of vendors.',
  },
  {
    title: 'Craft at industrial scale.',
    body: 'Design-forward work with the durability of a real production floor.',
  },
  {
    title: 'Colour you can repeat.',
    body: 'The next reprint and the next site follow the same locked specs.',
  },
];

export const sessionSteps = [
  'Welcome & brief',
  'Site & materials',
  'Samples & proofs',
  'Production',
  'Delivery & install',
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
    title: 'The Dammam floor.',
    body: 'Presses, finishing bays, and a sample room you can walk — a working factory, not a digital overlay.',
  },
  {
    title: 'Colour & materials.',
    body: 'We test, match, and lock specs so the next run looks like the first.',
  },
  {
    title: 'Made for the space.',
    body: 'Signage, interiors, fleet, and exhibitions built for how the site actually works.',
  },
  {
    title: 'One team to install.',
    body: 'Our people fabricate and fit. No loose contractor chain at the end of the job.',
  },
];

export const journey = [
  {
    title: 'Personal Consultation',
    body: 'Book a call. We look at the brief, the site, and the timeline, then return with a clear offer.',
  },
  {
    title: 'Specification & samples',
    body: 'Artwork, materials, colour tests, and bilingual needs are locked before anything goes to press.',
  },
  {
    title: 'Dammam production',
    body: 'The job runs in the 2nd Industrial City on our presses and finishing lines.',
  },
  {
    title: 'Delivery & install',
    body: 'Logistics and fitting by our team. Every job ends with a check on site.',
  },
  {
    title: 'Reprints & care',
    body: 'The same specs stay on file for the next run, the next branch, and the next event.',
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
    quote: 'GraphixEye became the production house we actually trust — identity, environments, and print from one floor.',
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
    quote: 'The brief was treated like a job sheet, not a guess. Colour, materials, and install landed as promised.',
    name: 'Placeholder name',
    role: 'Project manager · replace this',
    rating: 4,
  },
];

export const faqs = {
  client: [
    {
      q: 'What does GraphixEye actually produce?',
      a: 'Design, signage, printing, packaging, and gifting — from logos to architectural environments — all from our factory in Dammam.',
    },
    {
      q: 'What happens during the first brief?',
      a: 'We walk the job: site constraints, materials, quantities, and finish. Then we set a production plan you can follow from proof to install.',
    },
    {
      q: 'How long does a typical job take?',
      a: 'Short-run print can turn in days. Custom signage, packaging, and exhibition builds depend on site, materials, and approvals. We confirm a timeline in the first consultation.',
    },
    {
      q: 'Can we visit the factory?',
      a: 'Yes. GraphixEye is in the 2nd Industrial City, Dammam. We welcome walkthroughs of the press floor, finishing bays, and live work.',
    },
    {
      q: 'Do you work outside Dammam?',
      a: 'Yes. We produce in Dammam and deliver and install across the Kingdom — headquarters, industrial sites, retail, and events.',
    },
  ],
  partner: [
    {
      q: 'Who do you work with?',
      a: 'Corporates, industrial sites, hospitality, retail, and events that want serious production without a chain of vendors.',
    },
    {
      q: 'Can the work be customized for our brand?',
      a: 'Yes. Artwork, materials, bilingual needs, and how the piece sits in the space are specified with you before we print.',
    },
    {
      q: 'Can you support several sites?',
      a: 'Yes. Locked colour and finishing specs make reprints and new locations match the first install.',
    },
    {
      q: 'How do we start?',
      a: 'Contact us. After a short call we send a concrete offer with recommended materials, quantities, and a timeline from the Dammam floor.',
    },
  ],
};

export const clients = ['Aramco', 'SABIC', 'Maaden', 'Sadara', 'Lulu', 'Eram'];
