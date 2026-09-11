/** Canonical site origin used for OG, canonical, sitemap, and schema. */
import { buildAreaServed, GLOBAL_KEYWORDS, GLOBAL_REACH_LINE } from './geoMarkets';

export const SITE_URL = 'https://www.graphixeyesa.com';

export const GEO = {
  region: 'SA-04',
  placename: 'Dammam HQ — serving clients worldwide',
  position: '26.3927;49.9777',
  icbm: '26.3927, 49.9777',
  coverage: 'Worldwide',
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

const AREA_SERVED = buildAreaServed();

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
    'Global creative production firm with factory HQ in Dammam, Saudi Arabia — graphic design, commercial printing, custom signage, packaging, corporate gifting, and AR/VR/MR immersive experiences for clients worldwide.',
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
  areaServed: AREA_SERVED,
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
    'GraphixEye — global production firm for printing, signage, packaging, design, gifting, and immersive experiences. Factory HQ in Dammam; clients worldwide.',
  publisher: { '@id': `${SITE_URL}/#business` },
  inLanguage: ['en', 'ar'],
};

export { GLOBAL_KEYWORDS, GLOBAL_REACH_LINE, AREA_SERVED as globalAreaServed };

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
    title: 'GraphixEye | Global Printing, Signage & Packaging Company',
    description:
      'GraphixEye is a global creative production firm — commercial printing, custom signage, packaging, corporate gifting, and AR/VR/MR experiences for clients in the United States, United Kingdom, GCC, Europe, Asia, Africa, and worldwide. Factory HQ in Dammam. We Do As We Promise.',
    keywords: GLOBAL_KEYWORDS,
    ogTitle: 'GraphixEye | Global Printing, Signage & Packaging',
    ogDescription:
      'Global production house for printing, signage, packaging, gifting, and immersive AR/VR — serving Chicago, the UK, the GCC, and clients worldwide from our Dammam factory HQ.',
    priority: 1,
  },
  '/experience': {
    path: '/experience',
    title: 'Our Work & Experience | Global Printing, Signage & Immersive | GraphixEye',
    description:
      "Explore GraphixEye's portfolio of printing, signage, packaging, and immersive AR/VR/MR experiences delivered for international brands. Tour the factory floor that powers our global production.",
    keywords: GLOBAL_KEYWORDS,
    ogTitle: 'Our Experience | GraphixEye — Global Creative Production',
    ogDescription:
      "See GraphixEye's portfolio: world-class printing, packaging, signage, gifting and AR/VR for clients across the globe.",
    priority: 0.9,
  },
  '/services': {
    path: '/services',
    title: 'Services | Design, Signage, Printing, Packaging & Gifting | GraphixEye Global',
    description:
      'Browse GraphixEye services worldwide: graphic design, signage, commercial printing, packaging, corporate gifting, and immersive AR/VR/AI — produced from our Dammam factory HQ for international brands.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.9,
  },
  '/services/printing': {
    path: '/services/printing',
    title: 'Global Commercial Printing | Printing Company Worldwide | GraphixEye',
    description:
      'Commercial printing for brands worldwide from GraphixEye: offset, digital, large format, brochures, and catalogues. A global printing partner with factory HQ in Dammam serving the US, UK, GCC, and beyond.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.9,
  },
  '/services/packaging': {
    path: '/services/packaging',
    title: 'Global Custom Packaging | Packaging Company Worldwide | GraphixEye',
    description:
      'Custom packaging for international brands from GraphixEye: boxes, labels, flexible and sustainable formats — designed and manufactured for clients across the US, UK, GCC, and worldwide.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.9,
  },
  '/services/signage': {
    path: '/services/signage',
    title: 'Global Signage Manufacturer | Custom Signs Worldwide | GraphixEye',
    description:
      'Custom signage for global brands from GraphixEye: outdoor signs, LED, wayfinding, and fleet graphics — fabricated for sites in the United States, United Kingdom, GCC, and worldwide.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.9,
  },
  '/services/gifting': {
    path: '/services/gifting',
    title: 'Corporate Gifting Worldwide | Branded Gifts Global | GraphixEye',
    description:
      'Corporate gifting for international teams from GraphixEye: branded gifts, promotional kits, trophies, uniforms, and event merchandise shipped to clients worldwide.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.8,
  },
  '/services/design': {
    path: '/services/design',
    title: 'Graphic Design & Branding Worldwide | GraphixEye Global',
    description:
      'Graphic design and branding for global brands from GraphixEye: logos, brand systems, and production-ready artwork backed by in-house print and signage worldwide.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.8,
  },
  '/services/ar-vr': {
    path: '/services/ar-vr',
    title: 'AR VR Worldwide | Immersive Experiences Global | GraphixEye',
    description:
      'AR, VR, and MR experiences for international events and retail from GraphixEye — immersive production for brands across the US, UK, GCC, and worldwide.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.8,
  },
  '/services/ai': {
    path: '/services/ai',
    title: 'AI Creative Solutions Worldwide | GraphixEye Global',
    description:
      'AI-assisted creative workflows from GraphixEye that end in print-ready, brand-safe production for campaigns worldwide.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.8,
  },
  '/about': {
    path: '/about',
    title: 'About GraphixEye | Global Creative Production Firm',
    description:
      'GraphixEye is a global creative production firm with factory HQ in Dammam. Printing, signage, packaging, gifting, and immersive experiences for clients worldwide since 2009. We Do As We Promise.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.7,
  },
  '/contact': {
    path: '/contact',
    title: 'Contact GraphixEye | Global Printing & Signage Firm',
    description:
      'Brief GraphixEye from anywhere in the world. Request a quote for printing, packaging, signage, gifting, or AR/VR/MR. Factory HQ in Dammam — we aim to respond within 24 hours.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.7,
  },
  '/careers': {
    path: '/careers',
    title: 'Careers at GraphixEye | Join a Global Production Team',
    description:
      'Explore careers at GraphixEye. Work with a global creative production house spanning design, print, signage, packaging, and immersive experiences — factory HQ in Dammam.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.5,
  },
  '/vendors': {
    path: '/vendors',
    title: 'Vendor Registration | Supply GraphixEye Worldwide',
    description:
      'Register as a vendor with GraphixEye. Partner with our global printing, packaging, and signage production firm serving clients worldwide.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.4,
  },
  '/expansions': {
    path: '/expansions',
    title: 'Expansions | GraphixEye Capabilities Worldwide',
    description:
      'Discover how GraphixEye expands brand presence through design, environments, and production for international clients — powered from our Dammam factory HQ.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.6,
  },
  '/faq': {
    path: '/faq',
    title: 'FAQ | Global Printing, Signage & Packaging | GraphixEye',
    description:
      'Answers about GraphixEye as a global production firm: design, printing, signage, packaging, gifting, and AR/VR for clients worldwide. Factory visits, timelines, and how to get a quote.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.7,
  },
  '/markets': {
    path: '/markets',
    title: 'Markets Worldwide | Printing, Signage & Packaging | GraphixEye',
    description:
      'GraphixEye serves brands worldwide — United States (including Chicago), United Kingdom, UAE, Saudi Arabia, Europe, Asia, Africa, Canada, and Australia — from our Dammam factory HQ.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.9,
  },
};

export function getPageSeo(path: string): PageSeo | undefined {
  const normalized = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  return pageSeo[normalized];
}

export function serviceDetailSeo(slug: string, title: string, summary: string): PageSeo {
  return {
    path: `/services/${slug}`,
    title: `${title} | GraphixEye Global`,
    description: `${summary} Produced by GraphixEye for clients worldwide from our Dammam factory HQ.`,
    keywords: GLOBAL_KEYWORDS,
    ogTitle: `${title} | GraphixEye`,
    ogDescription: summary,
    priority: 0.6,
  };
}

export function allSitemapEntries(): PageSeo[] {
  return Object.values(pageSeo).filter((p) => p.sitemap !== false);
}
