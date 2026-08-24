export type WorkCategory = 'Design' | 'Signage' | 'Printing' | 'Packaging' | 'Gifting' | 'Immersive';

/** Portfolio pieces that belong to one flash-card service only. Add more here anytime. */
export interface ServiceProject {
  id: string;
  title: string;
  location: string;
  image: string;
}

export interface Work {
  slug: string;
  title: string;
  category: WorkCategory;
  location: string;
  image: string;
  summary: string;
  /** Only projects for this service — never mixes in sibling flash cards. */
  projects: ServiceProject[];
}

const local = (slug: string) => `/images/works/${slug}.jpg`;

/** Seed starter projects for a service. Replace / extend these as real portfolio files land. */
function seedProjects(slug: string, title: string, location: string): ServiceProject[] {
  return [
    {
      id: `${slug}-01`,
      title: `${title} — Selected work 01`,
      location,
      image: local(slug),
    },
    {
      id: `${slug}-02`,
      title: `${title} — Selected work 02`,
      location,
      image: local(slug),
    },
    {
      id: `${slug}-03`,
      title: `${title} — Selected work 03`,
      location,
      image: local(slug),
    },
  ];
}

function service(
  slug: string,
  title: string,
  category: WorkCategory,
  location: string,
  summary: string,
): Work {
  return {
    slug,
    title,
    category,
    location,
    image: local(slug),
    summary,
    projects: seedProjects(slug, title, location),
  };
}

export const works: Work[] = [
  service('logo-design', 'Logo Design', 'Design', 'Brand Identity', 'Marks and wordmarks built for print, signage, and digital systems.'),
  service('branding-identity', 'Branding and Identity', 'Design', 'Dammam, KSA', 'Full identity systems — colour, type, and guidelines across touchpoints.'),
  service('print-design', 'Print Design', 'Design', 'Collateral', 'Brochures, stationery, and collateral designed for press and finish.'),
  service('digital-design', 'Digital Design', 'Design', 'Social & Web', 'Social, web, and screen graphics aligned to the brand system.'),
  service('packaging-design', 'Packaging Design', 'Design', 'Unboxing', 'Structural and graphic packaging designed for shelf and unboxing.'),
  service('illustration-infographics', 'Illustration and Infographics', 'Design', 'Visual Systems', 'Illustration and infographic systems for campaigns and reports.'),
  service('ai-services', 'AI Services', 'Immersive', 'Smart Production', 'AI-assisted production workflows for brand and content programs.'),
  service('augmented-reality', 'Augmented Reality', 'Immersive', 'Spatial Overlays', 'AR overlays that extend print and space into interactive layers.'),
  service('virtual-reality', 'Virtual Reality', 'Immersive', 'Immersive Worlds', 'VR environments for brand, training, and exhibition experiences.'),
  service('mixed-reality', 'Mixed Reality', 'Immersive', 'Hybrid Experiences', 'Hybrid MR experiences combining physical installs with digital layers.'),
  service('exterior-signage', 'Exterior Signage', 'Signage', 'Onshore & Offshore', 'Building, site, and industrial exterior identification systems.'),
  service('interior-signage', 'Interior Signage', 'Signage', 'Wayfinding', 'Interior identity and wayfinding for workplaces and venues.'),
  service('directional-signage', 'Directional Signage', 'Signage', 'Traffic & Pedestrian', 'Traffic and pedestrian directional systems for complex sites.'),
  service('wall-branding', 'Wall Branding Signage', 'Signage', 'Workplace', 'Environmental wall branding for lobbies, floors, and teams.'),
  service('display-stand', 'Display Stand Signage', 'Signage', 'Retail', 'Retail and exhibition display stands and counters.'),
  service('digital-signage', 'Digital Signage', 'Signage', 'LED & Screens', 'LED and screen-based digital signage programs.'),
  service('vehicle-graphics', 'Vehicle Graphics', 'Signage', 'Fleet Wraps', 'Fleet wraps and vehicle graphics for brand mobility.'),
  service('road-signage', 'Road Signage', 'Signage', 'Regulatory', 'Regulatory and road signage for industrial and public routes.'),
  service('exhibition-booth', 'Exhibition Booth', 'Signage', 'Design & Build', 'Exhibition booth design and build for trade and brand events.'),
  service('event-management', 'Event Management', 'Signage', 'On-Site Production', 'On-site event production, branding, and install support.'),
  service('offset-printing', 'Offset Services', 'Printing', 'Commercial Press', 'Commercial offset press work for volume and colour accuracy.'),
  service('digital-printing', 'Digital Printing', 'Printing', 'Short Run', 'Short-run digital print for speed and variable data.'),
  service('silk-screen', 'Silk Screen Printing', 'Printing', 'Textiles & Metal', 'Silk screen on textiles, metal, and specialty substrates.'),
  service('uv-hot-stamping', 'UV Printing / Hot Stamping', 'Printing', 'Premium Finish', 'UV print and hot stamping for premium finishes.'),
  service('continuous-forms', 'Continuous Forms', 'Printing', 'Invoices & Labels', 'Continuous forms, invoices, and label production.'),
  service('binding-finishing', 'Binding and Finishing', 'Printing', 'Bindery', 'Binding, lamination, die cutting, and finishing.'),
  service('packaging-custom', 'Packaging Design & Customization', 'Packaging', 'Premium Materials', 'Custom packaging with premium materials and finishes.'),
  service('packaging-innovative', 'Innovative Packaging Solutions', 'Packaging', 'Industry Specific', 'Industry-specific packaging engineered for product and transit.'),
  service('packaging-versatile', 'Versatile Packaging Options', 'Packaging', 'Boxes & Labels', 'Boxes, labels, and versatile packaging formats.'),
  service('packaging-flexible', 'Flexible Packaging', 'Packaging', 'Pouches & Bags', 'Pouches, bags, and flexible packaging systems.'),
  service('packaging-specialty', 'Specialty Packaging', 'Packaging', 'Custom Forms', 'Specialty forms and custom packaging constructions.'),
  service('packaging-sustainable', 'Sustainable Packaging', 'Packaging', 'Recyclable', 'Recyclable and sustainable packaging options.'),
  service('giveaways', 'Custom Made Giveaways', 'Gifting', 'Branded Kits', 'Custom branded giveaways and kits.'),
  service('trophies', 'Acrylic Trophies and Mementos', 'Gifting', 'Recognition', 'Acrylic trophies and recognition mementos.'),
  service('lanyards', 'Lanyards and Badge Pins', 'Gifting', 'Events', 'Event lanyards, badges, and pins.'),
  service('uniforms', 'Uniforms and Apparel', 'Gifting', 'Corporate Wear', 'Corporate uniforms and branded apparel.'),
  service('safety-wears', 'Safety Wears', 'Gifting', 'Industrial PPE', 'Industrial PPE and safety wear branding.'),
];

export const featuredWorks = [
  works.find((w) => w.slug === 'logo-design')!,
  works.find((w) => w.slug === 'exterior-signage')!,
  works.find((w) => w.slug === 'offset-printing')!,
  works.find((w) => w.slug === 'packaging-custom')!,
];

/** Cards pinned in the home page horizontal scroll — AI, AR, VR, and MR. */
export const horizontalScrollWorks = [
  works.find((w) => w.slug === 'ai-services')!,
  works.find((w) => w.slug === 'augmented-reality')!,
  works.find((w) => w.slug === 'virtual-reality')!,
  works.find((w) => w.slug === 'mixed-reality')!,
];

export const workFilters = ['All Projects', 'Design', 'Signage', 'Printing', 'Packaging', 'Gifting', 'Immersive'] as const;

export type WorkCategorySlug = 'design' | 'signage' | 'printing' | 'packaging' | 'gifting' | 'immersive';

export interface WorkCategoryMeta {
  slug: WorkCategorySlug;
  category: WorkCategory;
  title: string;
  eyebrow: string;
  body: string;
  glow: string;
}

export const workCategories: WorkCategoryMeta[] = [
  {
    slug: 'design',
    category: 'Design',
    title: 'Design',
    eyebrow: 'Identity systems',
    body: 'Logo, branding, print and digital design, packaging systems, illustration, and infographics — built as one visual language.',
    glow: 'from-[#ff443a] via-[#ff6e8f] to-[#ff9ae7]',
  },
  {
    slug: 'signage',
    category: 'Signage',
    title: 'Signage',
    eyebrow: 'Environments',
    body: 'Exterior, interior, directional, wall branding, displays, digital screens, fleet wraps, road signage, exhibitions, and events.',
    glow: 'from-[#ff8958] via-[#f6633c] to-[#ff5860]',
  },
  {
    slug: 'printing',
    category: 'Printing',
    title: 'Printing',
    eyebrow: 'Press & finish',
    body: 'Offset, digital, silk screen, UV and hot stamping, continuous forms, binding, and finishing — colour you can check on press.',
    glow: 'from-[#ff5860] via-[#ff93a5] to-[#ff9ae7]',
  },
  {
    slug: 'packaging',
    category: 'Packaging',
    title: 'Packaging',
    eyebrow: 'Unboxing',
    body: 'Custom, innovative, versatile, flexible, specialty, and sustainable packaging engineered for shelf, transit, and brand moments.',
    glow: 'from-[#f6633c] via-[#ff8958] to-[#ff6e8f]',
  },
  {
    slug: 'gifting',
    category: 'Gifting',
    title: 'Gifting',
    eyebrow: 'Branded kits',
    body: 'Giveaways, acrylic trophies, lanyards and badges, uniforms and apparel, and safety wear for corporate and industrial programs.',
    glow: 'from-[#ff6e8f] via-[#ff9ae7] to-[#ff443a]',
  },
  {
    slug: 'immersive',
    category: 'Immersive',
    title: 'Immersive',
    eyebrow: 'Spatial & AI',
    body: 'AI services, augmented reality, virtual reality, and mixed reality experiences that extend the brand beyond print and space.',
    glow: 'from-[#ff9ae7] via-[#ff5860] to-[#ff8958]',
  },
];

export function getCategoryForWork(work: Work): WorkCategoryMeta | undefined {
  return workCategories.find((c) => c.category === work.category);
}

export function getWorkBySlug(slug: string): Work | undefined {
  return works.find((work) => work.slug === slug);
}

export function projectsForService(slug: string): ServiceProject[] {
  return getWorkBySlug(slug)?.projects ?? [];
}

/** Graphix banners with a navy brand panel; flash cards crop these so the panel is not visible. */
export const bannerCropSlugs = new Set(
  works.map((work) => work.slug).filter((slug) => slug !== 'ai-services' && slug !== 'mixed-reality'),
);
