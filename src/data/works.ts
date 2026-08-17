import { u } from './images';

export type WorkCategory = 'Design' | 'Signage' | 'Printing' | 'Packaging' | 'Gifting';

export interface Work {
  slug: string;
  title: string;
  category: WorkCategory;
  location: string;
  image: string;
}

export const works: Work[] = [
  { slug: 'logo-design', title: 'Logo Design', category: 'Design', location: 'Brand Identity', image: u('photo-1626785774573-4b799315345d') },
  { slug: 'branding-identity', title: 'Branding and Identity', category: 'Design', location: 'Dammam, KSA', image: u('photo-1586717791821-3f44a563fa4c') },
  { slug: 'print-design', title: 'Print Design', category: 'Design', location: 'Collateral', image: u('photo-1586281380349-632531db7ed4') },
  { slug: 'digital-design', title: 'Digital Design', category: 'Design', location: 'Social & Web', image: u('photo-1498050108023-c5249f4df085') },
  { slug: 'packaging-design', title: 'Packaging Design', category: 'Design', location: 'Unboxing', image: u('photo-1553062407-98eeb64c6a62') },
  { slug: 'illustration-infographics', title: 'Illustration and Infographics', category: 'Design', location: 'Visual Systems', image: u('photo-1618005182384-a83a8bd57fbe') },
  { slug: 'virtual-reality', title: 'Virtual Reality', category: 'Design', location: 'Immersive', image: u('photo-1593508512255-86ab42a8e620') },
  { slug: 'augmented-reality', title: 'Augmented Reality', category: 'Design', location: 'Spatial', image: u('photo-1633356122544-f134324a6cee') },
  { slug: 'exterior-signage', title: 'Exterior Signage', category: 'Signage', location: 'Onshore & Offshore', image: u('photo-1486406146926-c627a92ad1ab') },
  { slug: 'interior-signage', title: 'Interior Signage', category: 'Signage', location: 'Wayfinding', image: u('photo-1497366811353-6870744d04b2') },
  { slug: 'directional-signage', title: 'Directional Signage', category: 'Signage', location: 'Traffic & Pedestrian', image: u('photo-1477959858617-67f85cf4f1df') },
  { slug: 'wall-branding', title: 'Wall Branding Signage', category: 'Signage', location: 'Workplace', image: u('photo-1497366754035-f200968a6e72') },
  { slug: 'display-stand', title: 'Display Stand Signage', category: 'Signage', location: 'Retail', image: u('photo-1441986300917-64674bd600d8') },
  { slug: 'digital-signage', title: 'Digital Signage', category: 'Signage', location: 'LED & Screens', image: u('photo-1558655146-d09347e92766') },
  { slug: 'vehicle-graphics', title: 'Vehicle Graphics', category: 'Signage', location: 'Fleet Wraps', image: u('photo-1449965408869-eaa3f722e40d') },
  { slug: 'road-signage', title: 'Road Signage', category: 'Signage', location: 'Regulatory', image: u('photo-1503376780353-7e6692767b70') },
  { slug: 'exhibition-booth', title: 'Exhibition Booth', category: 'Signage', location: 'Design & Build', image: u('photo-1540575467063-178a50c2df87') },
  { slug: 'event-management', title: 'Event Management', category: 'Signage', location: 'On-Site Production', image: u('photo-1511578314322-379afb476865') },
  { slug: 'offset-printing', title: 'Offset Services', category: 'Printing', location: 'Commercial Press', image: u('photo-1562564055-71e051d33c19') },
  { slug: 'digital-printing', title: 'Digital Printing', category: 'Printing', location: 'Short Run', image: u('photo-1581092160562-40aa08e78837') },
  { slug: 'silk-screen', title: 'Silk Screen Printing', category: 'Printing', location: 'Textiles & Metal', image: u('photo-1562157873-818bc0726f68') },
  { slug: 'uv-hot-stamping', title: 'UV Printing / Hot Stamping', category: 'Printing', location: 'Premium Finish', image: u('photo-1611532736597-de2d4265fba3') },
  { slug: 'continuous-forms', title: 'Continuous Forms', category: 'Printing', location: 'Invoices & Labels', image: u('photo-1586281380117-5a60ae2050cc') },
  { slug: 'binding-finishing', title: 'Binding and Finishing', category: 'Printing', location: 'Bindery', image: u('photo-1481627834876-b7833e8f5570') },
  { slug: 'packaging-custom', title: 'Packaging Design & Customization', category: 'Packaging', location: 'Premium Materials', image: u('photo-1607344645866-009c320b63e0') },
  { slug: 'packaging-innovative', title: 'Innovative Packaging Solutions', category: 'Packaging', location: 'Industry Specific', image: u('photo-1581235720704-06d3acfcb36f') },
  { slug: 'packaging-versatile', title: 'Versatile Packaging Options', category: 'Packaging', location: 'Boxes & Labels', image: u('photo-1534723328310-e82dad3ee43f') },
  { slug: 'packaging-flexible', title: 'Flexible Packaging', category: 'Packaging', location: 'Pouches & Bags', image: u('photo-1615485290382-441e4d049cb5') },
  { slug: 'packaging-specialty', title: 'Specialty Packaging', category: 'Packaging', location: 'Custom Forms', image: u('photo-1549298916-b41d501d3772') },
  { slug: 'packaging-sustainable', title: 'Sustainable Packaging', category: 'Packaging', location: 'Recyclable', image: u('photo-1542601906990-b4d3fb778b09') },
  { slug: 'giveaways', title: 'Custom Made Giveaways', category: 'Gifting', location: 'Branded Kits', image: u('photo-1513885535751-8b9238bd345a') },
  { slug: 'trophies', title: 'Acrylic Trophies and Mementos', category: 'Gifting', location: 'Recognition', image: u('photo-1567427017947-545c5f8d16ad') },
  { slug: 'lanyards', title: 'Lanyards and Badge Pins', category: 'Gifting', location: 'Events', image: u('photo-1505373877841-8d25f7d46678') },
  { slug: 'uniforms', title: 'Uniforms and Apparel', category: 'Gifting', location: 'Corporate Wear', image: u('photo-1523381210434-271e8be1f52b') },
  { slug: 'safety-wears', title: 'Safety Wears', category: 'Gifting', location: 'Industrial PPE', image: u('photo-1504917595217-d4dc5ebe6122') },
];

export const featuredWorks = [
  works.find((w) => w.slug === 'logo-design')!,
  works.find((w) => w.slug === 'exterior-signage')!,
  works.find((w) => w.slug === 'offset-printing')!,
  works.find((w) => w.slug === 'packaging-custom')!,
];

export const workFilters = ['All Projects', 'Design', 'Signage', 'Printing', 'Packaging', 'Gifting'] as const;
