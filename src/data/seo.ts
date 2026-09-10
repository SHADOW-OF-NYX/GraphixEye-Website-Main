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

export function absoluteUrl(path: string): string {
  if (path === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

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
  '@type': ['LocalBusiness', 'Organization'],
  '@id': `${SITE_URL}/#business`,
  name: 'GraphixEye',
  alternateName: 'Graphix Eye',
  legalName: 'GraphixEye — Eram Printing & Packaging Factory Co.',
  url: SITE_URL,
  logo: LOGO_URL,
  image: OG_IMAGE,
  description:
    'One-stop creative production house in Dammam, Saudi Arabia for graphic design, commercial printing, custom signage, packaging, corporate gifting, and AR/VR/MR immersive experiences — all from a single factory floor.',
  telephone: '+966-13-802-1919',
  email: 'info@eramprintandpack.com',
  foundingDate: '2009',
  parentOrganization: {
    '@type': 'Organization',
    name: 'Eram Printing & Packaging Factory Co.',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2nd Industrial City',
    addressLocality: 'Dammam',
    addressRegion: 'Eastern Province',
    postalCode: '34341',
    addressCountry: 'SA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 26.3927,
    longitude: 49.9777,
  },
  areaServed: [
    { '@type': 'Country', name: 'Saudi Arabia' },
    { '@type': 'City', name: 'Dammam' },
    { '@type': 'City', name: 'Riyadh' },
    { '@type': 'City', name: 'Jeddah' },
    { '@type': 'AdministrativeArea', name: 'Eastern Province' },
  ],
  knowsLanguage: ['en', 'ar'],
  priceRange: '$$',
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
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'GraphixEye production services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Commercial Printing', url: `${SITE_URL}/services/printing` } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom Packaging', url: `${SITE_URL}/services/packaging` } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Signage Manufacturing', url: `${SITE_URL}/services/signage` } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Corporate Gifting', url: `${SITE_URL}/services/gifting` } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Graphic Design', url: `${SITE_URL}/services/design` } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AR VR MR Experiences', url: `${SITE_URL}/services/ar-vr` } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Creative Solutions', url: `${SITE_URL}/services/ai` } },
    ],
  },
  sameAs: [
    'https://www.instagram.com/graphixeyesa',
    'https://www.linkedin.com/company/graphixeye',
  ],
};

export const webSiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'GraphixEye',
  url: SITE_URL,
  description:
    'GraphixEye — Dammam one-stop production house for printing, signage, packaging, design, gifting, and immersive experiences across Saudi Arabia.',
  publisher: { '@id': `${SITE_URL}/#business` },
  inLanguage: ['en', 'ar'],
};

export function faqPageJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export const pageSeo: Record<string, PageSeo> = {
  '/': {
    path: '/',
    title: 'GraphixEye | Printing, Signage & Packaging Company in Dammam, Saudi Arabia',
    description:
      "GraphixEye is Dammam's one-stop production house for commercial printing, custom signage, packaging, corporate gifting, and immersive AR/VR/MR experiences across Saudi Arabia. We Do As We Promise.",
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
    title: 'Printing Dammam | Commercial Printing Company | GraphixEye',
    description:
      'Printing in Dammam from GraphixEye: offset and digital printing, large format, brochures, and catalogues. Your printing company Dammam partner serving brands across Saudi Arabia.',
    keywords: 'printing Dammam, printing company Dammam, commercial printing Saudi Arabia, offset printing KSA, digital printing Dammam',
    priority: 0.9,
  },
  '/services/packaging': {
    path: '/services/packaging',
    title: 'Packaging Dammam | Custom Packaging Company Saudi Arabia | GraphixEye',
    description:
      'Packaging in Dammam from GraphixEye: custom boxes, labels, flexible and sustainable packaging. Packaging company Saudi Arabia production from our Dammam factory.',
    keywords: 'packaging Dammam, packaging company Saudi Arabia, custom packaging KSA, product packaging Dammam, packaging design Saudi Arabia',
    priority: 0.9,
  },
  '/services/signage': {
    path: '/services/signage',
    title: 'Signage Dammam | Signage Company Saudi Arabia | GraphixEye',
    description:
      'Signage in Dammam from GraphixEye: outdoor signs, LED, wayfinding, and fleet graphics. Signage company Dammam fabrication and install across Saudi Arabia.',
    keywords: 'signage Dammam, signage company Dammam, custom signs Saudi Arabia, LED signage KSA, outdoor signage Dammam',
    priority: 0.9,
  },
  '/services/gifting': {
    path: '/services/gifting',
    title: 'Corporate Gifting Saudi Arabia | Branded Gifts Dammam | GraphixEye',
    description:
      'Corporate gifting Saudi Arabia from GraphixEye in Dammam: branded gifts, promotional kits, trophies, uniforms, and event merchandise for brands across the Kingdom.',
    keywords: 'corporate gifting Saudi Arabia, branded gifts KSA, promotional gifts Dammam, custom gifts Saudi Arabia',
    priority: 0.8,
  },
  '/services/design': {
    path: '/services/design',
    title: 'Graphic Design Dammam | Branding Agency Saudi Arabia | GraphixEye',
    description:
      'Graphic design in Dammam from GraphixEye: logos, brand systems, and production-ready artwork. Branding agency Saudi Arabia with in-house print and signage.',
    keywords: 'graphic design Dammam, branding agency Saudi Arabia, logo design KSA, creative agency Dammam',
    priority: 0.8,
  },
  '/services/ar-vr': {
    path: '/services/ar-vr',
    title: 'AR VR Saudi Arabia | Immersive Experiences Dammam | GraphixEye',
    description:
      'AR VR solutions Saudi Arabia from GraphixEye: augmented, virtual, and mixed reality for events and retail, produced with immersive experiences Dammam fabrication.',
    keywords: 'AR VR Saudi Arabia, AR VR solutions Saudi Arabia, augmented reality KSA, immersive experiences Dammam',
    priority: 0.8,
  },
  '/services/ai': {
    path: '/services/ai',
    title: 'AI Solutions Saudi Arabia | AI Design Dammam | GraphixEye',
    description:
      'AI solutions Saudi Arabia from GraphixEye: AI design Dammam workflows that end in print-ready, brand-safe creative for campaigns across the Kingdom.',
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
  '/faq': {
    path: '/faq',
    title: 'FAQ | One-Stop Printing, Signage & Packaging in Dammam | GraphixEye',
    description:
      'Answers about GraphixEye in Dammam: one-stop design, printing, signage, packaging, gifting, and AR/VR production across Saudi Arabia. Factory visits, timelines, and how to get a quote.',
    priority: 0.7,
  },
};

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
