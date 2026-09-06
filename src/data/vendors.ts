export type VendorCategory =
  | 'Materials'
  | 'Finishing'
  | 'Equipment'
  | 'Logistics'
  | 'Services'
  | 'Other';

export const vendorCategories: VendorCategory[] = [
  'Materials',
  'Finishing',
  'Equipment',
  'Logistics',
  'Services',
  'Other',
];

export const vendorCategoryDetails: {
  id: VendorCategory;
  title: string;
  summary: string;
  examples: string[];
}[] = [
  {
    id: 'Materials',
    title: 'Materials & substrates',
    summary: 'Paper, board, vinyl, acrylic, metal, and specialty stocks we run every day.',
    examples: ['Paper & board mills', 'Vinyl & film suppliers', 'Acrylic & metal stockists'],
  },
  {
    id: 'Finishing',
    title: 'Finishing & consumables',
    summary: 'Lamination, foils, adhesives, inks, and the finishing materials that close a job.',
    examples: ['Lamination films', 'Hot-stamp foils', 'Inks & coatings'],
  },
  {
    id: 'Equipment',
    title: 'Equipment & spare parts',
    summary: 'Press, finishing, and fabrication hardware — plus the parts that keep lines running.',
    examples: ['Press & finishing OEMs', 'Spare parts', 'Maintenance partners'],
  },
  {
    id: 'Logistics',
    title: 'Logistics & freight',
    summary: 'Inbound materials and outbound delivery across the Kingdom.',
    examples: ['Freight & courier', 'Warehouse handling', 'Site delivery crews'],
  },
  {
    id: 'Services',
    title: 'Professional services',
    summary: 'Calibration, certification, facilities, and specialist support on the factory floor.',
    examples: ['Calibration & QA', 'Facilities & utilities', 'Specialist contractors'],
  },
  {
    id: 'Other',
    title: 'Something else',
    summary: 'If your category is not listed, tell us what you supply — we review every serious brief.',
    examples: ['Niche materials', 'New processes', 'Regional partners'],
  },
];

export const vendorBenefits = [
  {
    title: 'One production floor',
    body: 'Your materials and services land where design, press, and finishing already sit together.',
  },
  {
    title: 'Clear specifications',
    body: 'We buy to locked colour, finish, and volume — not catalogue guesswork.',
  },
  {
    title: 'Long-run partners',
    body: 'Reprints and rollouts keep the same specs on file, so reliable suppliers stay in the loop.',
  },
];
