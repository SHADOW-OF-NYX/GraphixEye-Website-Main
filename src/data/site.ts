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
  { name: 'Services', path: '/services' },
  { name: 'Markets', path: '/markets' },
  { name: 'Expansions', path: '/expansions' },
  { name: 'Experience', path: '/experience' },
  { name: 'Careers', path: '/careers' },
];

export const heroPoints = [
  'One-stop design, signage, print, packaging, and gifting for brands worldwide',
  'Offset, digital, silk screen, UV, and bindery with colour you can check on press',
  'Reprints, rollouts, and install coordinated for sites across the US, UK, GCC, and beyond',
];

export const studioSpecs = [
  { value: '2009', label: 'Established' },
  { value: 'Global', label: 'Client footprint' },
  { value: 'One floor', label: 'Design through finishing' },
];

export const studioFeatures = [
  { title: 'One-stop stack', body: 'Identity, signage, print, packaging, and gifting under one roof — factory HQ in Dammam, delivery worldwide.' },
  { title: 'Press & finish', body: 'Offset, digital, silk screen, UV, hot stamping, bindery.' },
  { title: 'Built for the site', body: 'Exterior, interior, fleet, and exhibition work made for real spaces across continents.' },
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
      'Exterior, interior, fleet, and exhibition builds from our global production floor',
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
    body: 'Finish, volume, and unit cost are agreed before we go to press, no catalogue guesswork.',
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
    title: 'The factory floor.',
    body: 'Presses, finishing bays, and a sample room you can walk — a working factory HQ in Dammam, not a digital overlay.',
  },
  {
    title: 'Colour & materials.',
    body: 'We test, match, and lock specs so the next run looks like the first — wherever it ships.',
  },
  {
    title: 'Made for the space.',
    body: 'Signage, interiors, fleet, and exhibitions built for how the site actually works — Chicago to Dubai and beyond.',
  },
  {
    title: 'One team to deliver.',
    body: 'Our people fabricate and coordinate install or export. No loose contractor chain at the end of the job.',
  },
];

export const journey = [
  {
    title: 'Personal Consultation',
    body: 'Book a call from anywhere. We look at the brief, the site, and the timeline, then return with a clear offer.',
  },
  {
    title: 'Specification & samples',
    body: 'Artwork, materials, colour tests, and bilingual needs are locked before anything goes to press.',
  },
  {
    title: 'Global production',
    body: 'The job runs in our Dammam factory HQ on our presses and finishing lines, then ships or installs worldwide.',
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
    quote: 'GraphixEye became the production house we actually trust, identity, environments, and print from one floor.',
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
      q: 'Is GraphixEye a one-stop solution for printing, signage, and packaging worldwide?',
      a: 'Yes. GraphixEye is a global creative production firm with factory HQ in Dammam. Design, commercial printing, custom signage, packaging, corporate gifting, and AR/VR/MR experiences are produced from one floor — so international brands are not coordinating a chain of vendors across countries.',
    },
    {
      q: 'Do you work with clients outside Saudi Arabia?',
      a: 'Yes. We brief and deliver for clients across the United States (including Chicago and nationwide), the United Kingdom, the GCC, Europe, Asia, Africa, and other markets. Production is coordinated from our Dammam factory HQ with logistics for export and multi-site rollouts.',
    },
    {
      q: 'Where can I find a printing partner for Chicago, the UK, or the GCC?',
      a: 'GraphixEye provides commercial printing — offset, digital, large format, and finishing — for brands in Chicago and across the US, the United Kingdom, the GCC, and worldwide. Search GraphixEye or contact us for a quote from anywhere.',
    },
    {
      q: 'Who offers signage for international sites?',
      a: 'GraphixEye fabricates outdoor signs, LED, wayfinding, fleet wraps, and exhibitions for headquarters, industrial sites, and retail worldwide. Specs stay locked so multi-country rollouts match.',
    },
    {
      q: 'Can GraphixEye handle packaging for global brands?',
      a: 'Yes. Custom boxes, labels, flexible and sustainable formats are designed and manufactured for brands shipping across continents — samples, colour locks, and production that scales.',
    },
    {
      q: 'Do you provide graphic design for international campaigns?',
      a: 'Yes. Logos, brand systems, and production-ready artwork that go straight to our print, packaging, and signage floors — bilingual Arabic/English when needed.',
    },
    {
      q: 'What does GraphixEye actually produce?',
      a: 'Design, signage, printing, packaging, corporate gifting, and immersive AR/VR/AI experiences — from logos to architectural environments — for clients worldwide from our factory HQ in Dammam, Saudi Arabia.',
    },
    {
      q: 'Where is GraphixEye located?',
      a: 'Factory HQ: 2nd Industrial City, Dammam 34341, KSA (P.O. Box 4416). Call +966 13 802 1919 or email info@eramprintandpack.com. We produce in Dammam and serve clients and sites worldwide.',
    },
    {
      q: 'What happens during the first brief?',
      a: 'We walk the job: site constraints, materials, quantities, and finish — whether the site is in Chicago, London, Dubai, or elsewhere. Then we set a production plan you can follow from proof to install or delivery.',
    },
    {
      q: 'How long does a typical job take?',
      a: 'Short-run print can turn in days. Custom signage, packaging, and exhibition builds depend on site, materials, approvals, and shipping. We confirm a timeline in the first consultation.',
    },
    {
      q: 'Can we visit the factory?',
      a: 'Yes. GraphixEye welcomes walkthroughs of the press floor, finishing bays, and live work at our Dammam factory HQ — useful for international partners coordinating production remotely.',
    },
    {
      q: 'Do you work outside Dammam?',
      a: 'Yes. Dammam is our factory HQ. We deliver and install across Saudi Arabia and support clients and programmes in the United States, United Kingdom, GCC, and markets worldwide.',
    },
  ],
  partner: [
    {
      q: 'Why choose one factory instead of multiple vendors?',
      a: 'One GraphixEye team owns artwork, press, fabrication, finishing, and logistics. Colour and materials stay locked, timelines stay accountable, and reprints for the next country or site match the first job.',
    },
    {
      q: 'Who do you work with?',
      a: 'Corporates, industrials, hospitality, retail, and events worldwide that want serious production without a chain of vendors — including teams in Chicago, the UK, the GCC, and beyond.',
    },
    {
      q: 'Can the work be customized for our brand?',
      a: 'Yes. Artwork, materials, bilingual Arabic/English needs, and how the piece sits in the space are specified with you before we print.',
    },
    {
      q: 'Can you support several sites or countries?',
      a: 'Yes. Locked colour and finishing specs make reprints and new locations match the first install across regions and continents.',
    },
    {
      q: 'How do we start?',
      a: 'Contact GraphixEye from anywhere. After a short call we send a concrete offer with recommended materials, quantities, shipping or install notes, and a timeline from the factory floor.',
    },
  ],
};

/** Flat FAQ list for FAQPage schema and the /faq route. */
export const allFaqs = [...faqs.client, ...faqs.partner];

export const clients = ['Aramco', 'SABIC', 'Maaden', 'Sadara', 'Lulu', 'Eram'];
