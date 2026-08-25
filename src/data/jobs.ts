export type Department =
  | 'Finance'
  | 'Sales'
  | 'Design'
  | 'Production'
  | 'Printing'
  | 'Operations'
  | 'Immersive'
  | 'Marketing';

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract';

export interface Job {
  id: string;
  title: string;
  department: Department;
  type: EmploymentType;
  location: string;
  experience: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
}

export const jobs: Job[] = [
  {
    id: 'senior-accountant',
    title: 'Senior Accountant',
    department: 'Finance',
    type: 'Full-time',
    location: 'Dammam, KSA',
    experience: '5+ years',
    summary:
      'Own the monthly close, cost accounting across print and signage jobs, and reporting for the factory floor.',
    responsibilities: [
      'Run monthly, quarterly, and year-end close cycles',
      'Maintain job costing across offset, digital, signage, and packaging lines',
      'Prepare VAT and Zakat filings in line with ZATCA requirements',
      'Reconcile supplier accounts and manage payment runs',
      'Partner with production leads on material and waste variance',
    ],
    requirements: [
      "Bachelor's degree in Accounting, Finance, or equivalent",
      'SOCPA, CMA, or CPA progress is a strong advantage',
      'Hands-on ERP experience (SAP, Odoo, or similar)',
      'Working knowledge of Saudi VAT and Zakat regulations',
      'Fluent English; Arabic strongly preferred',
    ],
  },
  {
    id: 'accountant',
    title: 'Accountant',
    department: 'Finance',
    type: 'Full-time',
    location: 'Dammam, KSA',
    experience: '2+ years',
    summary:
      'Support day-to-day bookkeeping, invoicing, and receivables for a busy production house.',
    responsibilities: [
      'Process supplier invoices and customer billing',
      'Track receivables and follow up on collections',
      'Maintain petty cash and expense records',
      'Assist with month-end schedules and audit requests',
    ],
    requirements: [
      "Bachelor's degree in Accounting or Finance",
      'Strong Excel skills',
      'Accuracy under deadline pressure',
      'Arabic and English communication',
    ],
  },
  {
    id: 'sales-executive',
    title: 'Sales Executive',
    department: 'Sales',
    type: 'Full-time',
    location: 'Dammam, KSA',
    experience: '3+ years',
    summary:
      'Grow accounts across signage, print, packaging, and gifting — from first brief to delivered install.',
    responsibilities: [
      'Develop new business across industrial, retail, and corporate sectors',
      'Prepare quotations and negotiate commercial terms',
      'Coordinate with design and production on feasibility and timelines',
      'Maintain an accurate pipeline and forecast',
      'Own client relationships through repeat rollouts',
    ],
    requirements: [
      'Proven B2B sales record, ideally in print, signage, or advertising',
      'Comfortable presenting to procurement and marketing teams',
      'Valid Saudi driving licence',
      'Fluent Arabic and English',
    ],
  },
  {
    id: 'sales-coordinator',
    title: 'Sales Coordinator',
    department: 'Sales',
    type: 'Full-time',
    location: 'Dammam, KSA',
    experience: '1+ years',
    summary:
      'Keep quotes, job orders, and client updates moving between sales and the factory floor.',
    responsibilities: [
      'Prepare and issue quotations and job orders',
      'Track order status and communicate timelines to clients',
      'Maintain CRM records and sales documentation',
      'Support the sales team with reporting',
    ],
    requirements: [
      'Diploma or degree in Business Administration or similar',
      'Strong organisation and follow-through',
      'Confident with Excel and CRM tools',
      'Arabic and English communication',
    ],
  },
  {
    id: 'graphic-designer',
    title: 'Graphic Designer',
    department: 'Design',
    type: 'Full-time',
    location: 'Dammam, KSA',
    experience: '3+ years',
    summary:
      'Design identity, print, and environmental graphics that survive the jump from screen to press to wall.',
    responsibilities: [
      'Develop logos, identity systems, and brand guidelines',
      'Produce print-ready artwork for offset and digital output',
      'Design signage layouts, packaging dielines, and collateral',
      'Prepare presentations and visual mockups for clients',
      'Work with press operators on colour and finish',
    ],
    requirements: [
      'Strong portfolio across identity and print',
      'Expert in Adobe Illustrator, Photoshop, and InDesign',
      'Solid understanding of prepress, CMYK, and finishing',
      'Detail-obsessed with typography and layout',
    ],
  },
  {
    id: 'packaging-designer',
    title: 'Packaging Design Specialist',
    department: 'Design',
    type: 'Full-time',
    location: 'Dammam, KSA',
    experience: '3+ years',
    summary:
      'Engineer structural and graphic packaging built for shelf, transit, and the unboxing moment.',
    responsibilities: [
      'Create dielines and structural packaging concepts',
      'Design graphics that hold up across substrates and finishes',
      'Prototype and test samples with the production team',
      'Advise clients on sustainable material options',
    ],
    requirements: [
      'Experience in packaging or structural design',
      'Proficiency with Illustrator and dieline software (ArtiosCAD a plus)',
      'Knowledge of corrugated, folding carton, and flexible substrates',
    ],
  },
  {
    id: 'signage-supervisor',
    title: 'Signage Production Supervisor',
    department: 'Production',
    type: 'Full-time',
    location: 'Dammam, KSA',
    experience: '5+ years',
    summary:
      'Run the signage floor — fabrication, quality, and on-site install across onshore and offshore projects.',
    responsibilities: [
      'Plan and supervise fabrication schedules',
      'Manage CNC, welding, acrylic, and LED assembly teams',
      'Enforce quality and safety standards on floor and on site',
      'Coordinate installation crews and site logistics',
      'Report progress and resource needs to project managers',
    ],
    requirements: [
      'Deep signage fabrication experience',
      'Able to read technical drawings and shop plans',
      'Team leadership on a production floor',
      'Valid Saudi driving licence',
    ],
  },
  {
    id: 'offset-press-operator',
    title: 'Offset Press Operator',
    department: 'Printing',
    type: 'Full-time',
    location: 'Dammam, KSA',
    experience: '4+ years',
    summary:
      'Run commercial offset presses with colour accuracy you can check and repeat across volume runs.',
    responsibilities: [
      'Set up, run, and maintain offset presses',
      'Match colour to proofs and maintain density through the run',
      'Perform routine maintenance and minimise makeready waste',
      'Log production output and material consumption',
    ],
    requirements: [
      'Hands-on experience with sheet-fed offset presses',
      'Strong colour judgement and densitometer use',
      'Mechanical aptitude for press maintenance',
    ],
  },
  {
    id: 'digital-print-operator',
    title: 'Digital Print Operator',
    department: 'Printing',
    type: 'Full-time',
    location: 'Dammam, KSA',
    experience: '2+ years',
    summary:
      'Handle short-run digital and large-format output, from file check to finished cut.',
    responsibilities: [
      'Operate digital and large-format printers',
      'Run RIP software and manage colour profiles',
      'Handle laminating, cutting, and finishing',
      'Maintain machines and consumables',
    ],
    requirements: [
      'Experience with digital or wide-format print equipment',
      'Familiar with RIP workflows and colour management',
      'Careful file and substrate handling',
    ],
  },
  {
    id: 'project-manager',
    title: 'Project Manager',
    department: 'Operations',
    type: 'Full-time',
    location: 'Dammam, KSA',
    experience: '5+ years',
    summary:
      'Carry multi-discipline rollouts from kickoff to handover across design, print, signage, and install.',
    responsibilities: [
      'Own project scope, budget, and schedule',
      'Coordinate design, production, and installation teams',
      'Manage client communication and approvals',
      'Track risks, changes, and site readiness',
      'Close out projects with documentation and sign-off',
    ],
    requirements: [
      'Project management experience in print, signage, or fit-out',
      'PMP or equivalent is an advantage',
      'Strong stakeholder communication',
      'Fluent Arabic and English',
    ],
  },
  {
    id: 'logistics-coordinator',
    title: 'Warehouse & Logistics Coordinator',
    department: 'Operations',
    type: 'Full-time',
    location: 'Dammam, KSA',
    experience: '2+ years',
    summary:
      'Keep materials, finished goods, and delivery schedules moving without a bottleneck.',
    responsibilities: [
      'Manage inbound materials and stock levels',
      'Organise finished goods and dispatch schedules',
      'Coordinate delivery and installation logistics',
      'Maintain accurate inventory records',
    ],
    requirements: [
      'Warehouse or logistics coordination experience',
      'Comfortable with inventory systems',
      'Organised under high job volume',
    ],
  },
  {
    id: 'ar-vr-developer',
    title: 'AR / VR Developer',
    department: 'Immersive',
    type: 'Full-time',
    location: 'Dammam, KSA',
    experience: '3+ years',
    summary:
      'Build the immersive layer — AR overlays, VR environments, and mixed reality installs for brand experiences.',
    responsibilities: [
      'Develop AR and VR experiences in Unity or Unreal',
      'Build WebAR and WebXR experiences for browser delivery',
      'Optimise 3D assets and scenes for headset and mobile performance',
      'Collaborate with designers on spatial interaction',
      'Support on-site deployment at exhibitions and installs',
    ],
    requirements: [
      'Unity or Unreal production experience',
      'C# or C++ proficiency',
      '3D pipeline knowledge (Blender, Maya, or 3ds Max)',
      'Portfolio of shipped AR, VR, or MR work',
    ],
  },
  {
    id: 'motion-3d-artist',
    title: '3D & Motion Artist',
    department: 'Immersive',
    type: 'Full-time',
    location: 'Dammam, KSA',
    experience: '3+ years',
    summary:
      'Model, light, and animate the assets that carry our immersive and digital signage work.',
    responsibilities: [
      'Produce 3D models, materials, and lighting setups',
      'Create motion graphics for digital signage and social',
      'Render visualisations for signage and exhibition proposals',
      'Optimise assets for real-time engines',
    ],
    requirements: [
      'Strong 3D and motion reel',
      'Blender, Cinema 4D, or Maya proficiency',
      'After Effects for compositing and motion',
    ],
  },
  {
    id: 'digital-marketing-specialist',
    title: 'Digital Marketing Specialist',
    department: 'Marketing',
    type: 'Full-time',
    location: 'Dammam, KSA',
    experience: '3+ years',
    summary:
      'Run the channels that put our work in front of the right procurement and brand teams.',
    responsibilities: [
      'Plan and run social and paid campaigns',
      'Produce content from real production and install work',
      'Manage SEO and website content updates',
      'Report on performance and pipeline contribution',
    ],
    requirements: [
      'B2B digital marketing experience',
      'Hands-on with Meta, LinkedIn, and Google Ads',
      'Comfortable with analytics tools',
      'Arabic and English copywriting',
    ],
  },
];

export const departments: Department[] = [
  'Finance',
  'Sales',
  'Design',
  'Production',
  'Printing',
  'Operations',
  'Immersive',
  'Marketing',
];

export const jobFilters = ['All Roles', ...departments] as const;
export type JobFilter = (typeof jobFilters)[number];
