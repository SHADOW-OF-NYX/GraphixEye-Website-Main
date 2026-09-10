/** Canonical site origin used for OG, canonical, sitemap, and schema. */
export const SITE_URL = 'https://www.graphixeyesa.com';

export const GEO = {
  region: 'SA-04',
  placename: 'Dammam, Eastern Province, Saudi Arabia',
  position: '26.3927;49.9777',
  icbm: '26.3927, 49.9777',
} as const;

export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const LOGO_URL = `${SITE_URL}/logo.png`;

export type PageSeo = {
  path: string;
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  priority?: number;
  /** Include in sitemap.xml */
  sitemap?: boolean;
};

export const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'GraphixEye',
  url: SITE_URL,
  logo: LOGO_URL,
  image: OG_IMAGE,
  description:
    'Dammam-based production house specializing in printing, packaging, signage, corporate gifting, and AR/VR/MR immersive experiences across Saudi Arabia.',
  telephone: '+966-13-802-1919',
  email: 'info@eramprintandpack.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2nd Industrial City',
    addressLocality: 'Dammam',
    addressRegion: 'Eastern Province',
    postalCode: '34341',
    addressCountry: 'SA',
  },
  areaServed: ['Saudi Arabia', 'Dammam', 'Riyadh', 'Jeddah', 'Eastern Province'],
  serviceType: [
    'Printing',
    'Packaging',
    'Signage',
    'Corporate Gifting',
    'Graphic Design',
    'AR',
    'VR',
    'MR',
    'Immersive Experiences',
    'AI Solutions',
  ],
  sameAs: [
    'https://www.instagram.com/graphixeyesa',
    'https://www.linkedin.com/company/graphixeye',
  ],
};

export const pageSeo: Record<string, PageSeo> = {
  '/': {
    path: '/',
    title: 'GraphixEye | Printing, Signage & Packaging Company in Dammam, Saudi Arabia',
    description:
      "GraphixEye is Dammam's leading production house for commercial printing, custom signage, packaging, corporate gifting, and immersive AR/VR/MR experiences across Saudi Arabia. We Do As We Promise.",
    keywords:
      'printing company Dammam, signage Saudi Arabia, packaging KSA, AR VR Saudi Arabia, graphic design Dammam, corporate gifting KSA',
    ogTitle: 'GraphixEye | Printing, Signage & Packaging - Dammam, Saudi Arabia',
    ogDescription:
      "Dammam's trusted production house for printing, signage, packaging, gifting, and immersive AR/VR experiences across the Kingdom.",
    priority: 1,
  },
  '/experience': {
    path: '/experience',
    title: 'Our Work & Experience | Printing, Signage & Immersive Experiences | GraphixEye KSA',
    description:
      "Explore GraphixEye's portfolio of printing, signage, packaging, and immersive AR/VR/MR experiences delivered for clients across Saudi Arabia. See what Dammam's top creative production house has built.",
    ogTitle: "Our Experience | GraphixEye - Saudi Arabia's Creative Production House",
    ogDescription:
      "See GraphixEye's portfolio: world-class printing, packaging, signage, gifting and AR/VR experiences across the Kingdom of Saudi Arabia.",
    priority: 0.9,
  },
  '/services': {
    path: '/services',
    title: 'Services | Design, Signage, Printing, Packaging & Gifting | GraphixEye Dammam',
    description:
      'Browse GraphixEye services from our Dammam factory: graphic design, signage, commercial printing, packaging, corporate gifting, and immersive AR/VR/AI solutions across Saudi Arabia.',
    priority: 0.9,
  },
  '/services/printing': {
    path: '/services/printing',
    title: 'Commercial Printing Company in Dammam | GraphixEye KSA',
    description:
      'GraphixEye offers professional offset and digital printing in Dammam, Saudi Arabia. Business cards, brochures, banners, catalogues, and large format printing for businesses across the Kingdom.',
    keywords: 'printing company Dammam, commercial printing Saudi Arabia, offset printing KSA, digital printing Dammam',
    priority: 0.9,
  },
  '/services/packaging': {
    path: '/services/packaging',
    title: 'Custom Packaging Solutions Saudi Arabia | GraphixEye Dammam',
    description:
      'Premium custom packaging design and manufacturing in Saudi Arabia. Boxes, labels, retail packaging, and brand packaging solutions delivered from our Dammam factory.',
    keywords: 'packaging company Saudi Arabia, custom packaging KSA, product packaging Dammam, packaging design Saudi Arabia',
    priority: 0.9,
  },
  '/services/signage': {
    path: '/services/signage',
    title: 'Signage Company in Dammam, Saudi Arabia | GraphixEye',
    description:
      'Expert signage manufacturing and installation across Saudi Arabia. Indoor signs, outdoor signs, LED signage, wayfinding, and corporate branding from GraphixEye in Dammam.',
    keywords: 'signage company Dammam, custom signs Saudi Arabia, LED signage KSA, outdoor signage Dammam',
    priority: 0.9,
  },
  '/services/gifting': {
    path: '/services/gifting',
    title: 'Corporate Gifting & Branded Gifts Saudi Arabia | GraphixEye',
    description:
      'Elevate your brand with premium corporate gifts and branded merchandise across Saudi Arabia. GraphixEye creates custom gifting solutions from our Dammam production facility.',
    keywords: 'corporate gifting Saudi Arabia, branded gifts KSA, promotional gifts Dammam, custom gifts Saudi Arabia',
    priority: 0.8,
  },
  '/services/design': {
    path: '/services/design',
    title: 'Graphic Design & Branding Agency in Dammam, KSA | GraphixEye',
    description:
      'Creative graphic design and brand identity services in Saudi Arabia. Logos, brand systems, marketing materials, and visual identity designed and produced in Dammam.',
    keywords: 'graphic design Dammam, branding agency Saudi Arabia, logo design KSA, creative agency Dammam',
    priority: 0.8,
  },
  '/services/ar-vr': {
    path: '/services/ar-vr',
    title: 'AR, VR & MR Immersive Experiences Saudi Arabia | GraphixEye',
    description:
      'Cutting-edge Augmented Reality, Virtual Reality, and Mixed Reality experiences built for Saudi brands. GraphixEye delivers immersive tech solutions for events and retail across the Kingdom.',
    keywords: 'AR VR solutions Saudi Arabia, augmented reality KSA, immersive experiences Dammam, mixed reality Saudi Arabia',
    priority: 0.8,
  },
  '/services/ai': {
    path: '/services/ai',
    title: 'AI-Powered Creative Solutions Saudi Arabia | GraphixEye',
    description:
      'GraphixEye blends artificial intelligence with creative production. Discover how AI-powered design, content, and imaging solutions are transforming brands in Saudi Arabia.',
    keywords: 'AI solutions Saudi Arabia, artificial intelligence KSA, AI design Dammam',
    priority: 0.8,
  },
  '/about': {
    path: '/about',
    title: "About GraphixEye | Dammam's Leading Creative Production House",
    description:
      "Learn about GraphixEye - Dammam's trusted factory for printing, signage, packaging, gifting, and immersive experiences. We Do As We Promise, serving clients across Saudi Arabia since day one.",
    priority: 0.7,
  },
  '/contact': {
    path: '/contact',
    title: 'Contact GraphixEye | Printing & Signage Company Dammam, Saudi Arabia',
    description:
      'Get in touch with GraphixEye in Dammam, Saudi Arabia. Request a quote for printing, packaging, signage, gifting, or AR/VR/MR projects. We respond within 24 hours.',
    priority: 0.7,
  },
  '/careers': {
    path: '/careers',
    title: 'Careers at GraphixEye | Join Our Dammam Production Team',
    description:
      'Explore careers at GraphixEye in Dammam, Saudi Arabia. Work with a creative production house spanning design, print, signage, packaging, and immersive experiences.',
    priority: 0.5,
  },
  '/vendors': {
    path: '/vendors',
    title: 'Vendor Registration | Supply GraphixEye Dammam',
    description:
      'Register as a vendor with GraphixEye in Dammam. Partner with our printing, packaging, and signage production house serving clients across Saudi Arabia.',
    priority: 0.4,
  },
  '/expansions': {
    path: '/expansions',
    title: 'Expansions | GraphixEye Capabilities Across Saudi Arabia',
    description:
      'Discover how GraphixEye expands brand presence through design, environments, and production from our Dammam factory across the Kingdom of Saudi Arabia.',
    priority: 0.6,
  },
};

export function absoluteUrl(path: string): string {
  if (path === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function getPageSeo(path: string): PageSeo | undefined {
  const normalized = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  return pageSeo[normalized];
}

export function serviceDetailSeo(slug: string, title: string, summary: string): PageSeo {
  return {
    path: `/services/${slug}`,
    title: `${title} | GraphixEye Dammam, Saudi Arabia`,
    description: `${summary} Produced by GraphixEye in Dammam for clients across Saudi Arabia.`,
    ogTitle: `${title} | GraphixEye KSA`,
    ogDescription: summary,
    priority: 0.6,
  };
}

export function allSitemapEntries(): PageSeo[] {
  return Object.values(pageSeo).filter((p) => p.sitemap !== false);
}
