export type WorkCategory = 'Design' | 'Signage' | 'Printing' | 'Packaging' | 'Gifting' | 'Immersive';

export interface Work {
  slug: string;
  title: string;
  category: WorkCategory;
  location: string;
  image: string;
}

const local = (slug: string) => `/images/works/${slug}.jpg`;

export const works: Work[] = [
  { slug: 'logo-design', title: 'Logo Design', category: 'Design', location: 'Brand Identity', image: local('logo-design') },
  { slug: 'branding-identity', title: 'Branding and Identity', category: 'Design', location: 'Dammam, KSA', image: local('branding-identity') },
  { slug: 'print-design', title: 'Print Design', category: 'Design', location: 'Collateral', image: local('print-design') },
  { slug: 'digital-design', title: 'Digital Design', category: 'Design', location: 'Social & Web', image: local('digital-design') },
  { slug: 'packaging-design', title: 'Packaging Design', category: 'Design', location: 'Unboxing', image: local('packaging-design') },
  { slug: 'illustration-infographics', title: 'Illustration and Infographics', category: 'Design', location: 'Visual Systems', image: local('illustration-infographics') },
  { slug: 'ai-services', title: 'AI Services', category: 'Immersive', location: 'Smart Production', image: local('ai-services') },
  { slug: 'augmented-reality', title: 'Augmented Reality', category: 'Immersive', location: 'Spatial Overlays', image: local('augmented-reality') },
  { slug: 'virtual-reality', title: 'Virtual Reality', category: 'Immersive', location: 'Immersive Worlds', image: local('virtual-reality') },
  { slug: 'mixed-reality', title: 'Mixed Reality', category: 'Immersive', location: 'Hybrid Experiences', image: local('mixed-reality') },
  { slug: 'exterior-signage', title: 'Exterior Signage', category: 'Signage', location: 'Onshore & Offshore', image: local('exterior-signage') },
  { slug: 'interior-signage', title: 'Interior Signage', category: 'Signage', location: 'Wayfinding', image: local('interior-signage') },
  { slug: 'directional-signage', title: 'Directional Signage', category: 'Signage', location: 'Traffic & Pedestrian', image: local('directional-signage') },
  { slug: 'wall-branding', title: 'Wall Branding Signage', category: 'Signage', location: 'Workplace', image: local('wall-branding') },
  { slug: 'display-stand', title: 'Display Stand Signage', category: 'Signage', location: 'Retail', image: local('display-stand') },
  { slug: 'digital-signage', title: 'Digital Signage', category: 'Signage', location: 'LED & Screens', image: local('digital-signage') },
  { slug: 'vehicle-graphics', title: 'Vehicle Graphics', category: 'Signage', location: 'Fleet Wraps', image: local('vehicle-graphics') },
  { slug: 'road-signage', title: 'Road Signage', category: 'Signage', location: 'Regulatory', image: local('road-signage') },
  { slug: 'exhibition-booth', title: 'Exhibition Booth', category: 'Signage', location: 'Design & Build', image: local('exhibition-booth') },
  { slug: 'event-management', title: 'Event Management', category: 'Signage', location: 'On-Site Production', image: local('event-management') },
  { slug: 'offset-printing', title: 'Offset Services', category: 'Printing', location: 'Commercial Press', image: local('offset-printing') },
  { slug: 'digital-printing', title: 'Digital Printing', category: 'Printing', location: 'Short Run', image: local('digital-printing') },
  { slug: 'silk-screen', title: 'Silk Screen Printing', category: 'Printing', location: 'Textiles & Metal', image: local('silk-screen') },
  { slug: 'uv-hot-stamping', title: 'UV Printing / Hot Stamping', category: 'Printing', location: 'Premium Finish', image: local('uv-hot-stamping') },
  { slug: 'continuous-forms', title: 'Continuous Forms', category: 'Printing', location: 'Invoices & Labels', image: local('continuous-forms') },
  { slug: 'binding-finishing', title: 'Binding and Finishing', category: 'Printing', location: 'Bindery', image: local('binding-finishing') },
  { slug: 'packaging-custom', title: 'Packaging Design & Customization', category: 'Packaging', location: 'Premium Materials', image: local('packaging-custom') },
  { slug: 'packaging-innovative', title: 'Innovative Packaging Solutions', category: 'Packaging', location: 'Industry Specific', image: local('packaging-innovative') },
  { slug: 'packaging-versatile', title: 'Versatile Packaging Options', category: 'Packaging', location: 'Boxes & Labels', image: local('packaging-versatile') },
  { slug: 'packaging-flexible', title: 'Flexible Packaging', category: 'Packaging', location: 'Pouches & Bags', image: local('packaging-flexible') },
  { slug: 'packaging-specialty', title: 'Specialty Packaging', category: 'Packaging', location: 'Custom Forms', image: local('packaging-specialty') },
  { slug: 'packaging-sustainable', title: 'Sustainable Packaging', category: 'Packaging', location: 'Recyclable', image: local('packaging-sustainable') },
  { slug: 'giveaways', title: 'Custom Made Giveaways', category: 'Gifting', location: 'Branded Kits', image: local('giveaways') },
  { slug: 'trophies', title: 'Acrylic Trophies and Mementos', category: 'Gifting', location: 'Recognition', image: local('trophies') },
  { slug: 'lanyards', title: 'Lanyards and Badge Pins', category: 'Gifting', location: 'Events', image: local('lanyards') },
  { slug: 'uniforms', title: 'Uniforms and Apparel', category: 'Gifting', location: 'Corporate Wear', image: local('uniforms') },
  { slug: 'safety-wears', title: 'Safety Wears', category: 'Gifting', location: 'Industrial PPE', image: local('safety-wears') },
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

/** Graphix banners with a navy brand panel; flash cards crop these so the panel is not visible. */
export const bannerCropSlugs = new Set(
  works.map((work) => work.slug).filter((slug) => slug !== 'ai-services' && slug !== 'mixed-reality'),
);
