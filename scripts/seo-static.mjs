/**
 * Post-build SEO: write sitemap.xml and per-route HTML shells with unique meta
 * so crawlers/social scrapers that do not execute JS still see the right tags.
 * Vercel serves these static files before the SPA rewrite.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

const SITE_URL = 'https://www.graphixeyesa.com';
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

function buildGlobalKeywords() {
  const raw = JSON.parse(fs.readFileSync(path.join(root, 'src/data/geoMarkets.json'), 'utf8'));
  const countries = raw.countries;
  const us = raw.usStates;
  const all = [
    ...us,
    ...raw.canadaProvinces,
    ...raw.australiaStates,
    ...raw.ukRegions,
    ...raw.indiaStates,
    ...raw.uaeEmirates,
    ...raw.germanyStates,
    ...raw.brazilStates,
    ...raw.mexicoStates,
    ...raw.nigeriaStates,
    ...raw.southAfricaProvinces,
  ];
  const seeds = [
    'global printing company',
    'international signage manufacturer',
    'worldwide packaging production',
    'corporate gifting global',
    'graphic design worldwide',
    'AR VR experiences international',
    'printing Chicago',
    'printing London',
    'printing Dubai',
    'signage United States',
    'signage United Kingdom',
    'packaging USA',
    'packaging UK',
    'printing company Saudi Arabia',
    'GraphixEye global',
  ];
  const parts = [
    ...seeds,
    ...countries.map((c) => `printing ${c}`),
    ...countries.map((c) => `signage ${c}`),
    ...us.map((s) => `printing ${s}`),
    ...us.map((s) => `signage ${s}`),
    ...raw.ukRegions.map((r) => `printing ${r}`),
    ...raw.canadaProvinces.map((p) => `printing ${p}`),
    ...raw.australiaStates.map((s) => `printing ${s}`),
    ...raw.uaeEmirates.map((e) => `printing ${e}`),
    ...raw.majorCities.map((c) => `GraphixEye ${c}`),
    ...all,
    ...countries,
  ];
  return [...new Set(parts)].join(', ');
}

const GLOBAL_KEYWORDS = buildGlobalKeywords();

/** @type {{ path: string, title: string, description: string, keywords?: string, ogTitle?: string, ogDescription?: string, priority: number }[]} */
const pages = [
  {
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
  {
    path: '/experience',
    title: 'Our Work & Experience | Global Printing, Signage & Immersive | GraphixEye',
    description:
      "Explore GraphixEye's portfolio of printing, signage, packaging, and immersive AR/VR/MR experiences delivered for international brands. Tour the factory floor that powers our global production.",
    keywords: GLOBAL_KEYWORDS,
    priority: 0.9,
  },
  {
    path: '/services',
    title: 'Services | Design, Signage, Printing, Packaging & Gifting | GraphixEye Global',
    description:
      'Browse GraphixEye services worldwide: graphic design, signage, commercial printing, packaging, corporate gifting, and immersive AR/VR/AI — produced from our Dammam factory HQ for international brands.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.9,
  },
  {
    path: '/services/printing',
    title: 'Global Commercial Printing | Printing Company Worldwide | GraphixEye',
    description:
      'Commercial printing for brands worldwide from GraphixEye: offset, digital, large format, brochures, and catalogues. A global printing partner with factory HQ in Dammam serving the US, UK, GCC, and beyond.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.9,
  },
  {
    path: '/services/packaging',
    title: 'Global Custom Packaging | Packaging Company Worldwide | GraphixEye',
    description:
      'Custom packaging for international brands from GraphixEye: boxes, labels, flexible and sustainable formats — designed and manufactured for clients across the US, UK, GCC, and worldwide.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.9,
  },
  {
    path: '/services/signage',
    title: 'Global Signage Manufacturer | Custom Signs Worldwide | GraphixEye',
    description:
      'Custom signage for global brands from GraphixEye: outdoor signs, LED, wayfinding, and fleet graphics — fabricated for sites in the United States, United Kingdom, GCC, and worldwide.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.9,
  },
  {
    path: '/services/gifting',
    title: 'Corporate Gifting Worldwide | Branded Gifts Global | GraphixEye',
    description:
      'Corporate gifting for international teams from GraphixEye: branded gifts, promotional kits, trophies, uniforms, and event merchandise shipped to clients worldwide.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.8,
  },
  {
    path: '/services/design',
    title: 'Graphic Design & Branding Worldwide | GraphixEye Global',
    description:
      'Graphic design and branding for global brands from GraphixEye: logos, brand systems, and production-ready artwork backed by in-house print and signage worldwide.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.8,
  },
  {
    path: '/services/ar-vr',
    title: 'AR VR Worldwide | Immersive Experiences Global | GraphixEye',
    description:
      'AR, VR, and MR experiences for international events and retail from GraphixEye — immersive production for brands across the US, UK, GCC, and worldwide.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.8,
  },
  {
    path: '/services/ai',
    title: 'AI Creative Solutions Worldwide | GraphixEye Global',
    description:
      'AI-assisted creative workflows from GraphixEye that end in print-ready, brand-safe production for campaigns worldwide.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.8,
  },
  {
    path: '/about',
    title: 'About GraphixEye | Global Creative Production Firm',
    description:
      'GraphixEye is a global creative production firm with factory HQ in Dammam. Printing, signage, packaging, gifting, and immersive experiences for clients worldwide since 2009. We Do As We Promise.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.7,
  },
  {
    path: '/contact',
    title: 'Contact GraphixEye | Global Printing & Signage Firm',
    description:
      'Brief GraphixEye from anywhere in the world. Request a quote for printing, packaging, signage, gifting, or AR/VR/MR. Factory HQ in Dammam — we aim to respond within 24 hours.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.7,
  },
  {
    path: '/careers',
    title: 'Careers at GraphixEye | Join a Global Production Team',
    description:
      'Explore careers at GraphixEye. Work with a global creative production house spanning design, print, signage, packaging, and immersive experiences — factory HQ in Dammam.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.5,
  },
  {
    path: '/vendors',
    title: 'Vendor Registration | Supply GraphixEye Worldwide',
    description:
      'Register as a vendor with GraphixEye. Partner with our global printing, packaging, and signage production firm serving clients worldwide.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.4,
  },
  {
    path: '/expansions',
    title: 'Expansions | GraphixEye Capabilities Worldwide',
    description:
      'Discover how GraphixEye expands brand presence through design, environments, and production for international clients — powered from our Dammam factory HQ.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.6,
  },
  {
    path: '/faq',
    title: 'FAQ | Global Printing, Signage & Packaging | GraphixEye',
    description:
      'Answers about GraphixEye as a global production firm: design, printing, signage, packaging, gifting, and AR/VR for clients worldwide. Factory visits, timelines, and how to get a quote.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.7,
  },
];

const workSlugs = [
  'logo-design',
  'branding-identity',
  'print-design',
  'digital-design',
  'packaging-design',
  'illustration-infographics',
  'ai-services',
  'augmented-reality',
  'virtual-reality',
  'mixed-reality',
  'exterior-signage',
  'interior-signage',
  'directional-signage',
  'wall-branding',
  'display-stand',
  'digital-signage',
  'vehicle-graphics',
  'road-signage',
  'exhibition-booth',
  'event-management',
  'offset-printing',
  'digital-printing',
  'silk-screen',
  'uv-hot-stamping',
  'continuous-forms',
  'binding-finishing',
  'packaging-custom',
  'packaging-innovative',
  'packaging-versatile',
  'packaging-flexible',
  'packaging-specialty',
  'packaging-sustainable',
  'giveaways',
  'trophies',
  'lanyards',
  'uniforms',
  'safety-wears',
];

for (const slug of workSlugs) {
  const title = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  pages.push({
    path: `/services/${slug}`,
    title: `${title} | GraphixEye Global`,
    description: `${title} by GraphixEye for clients worldwide from our Dammam factory HQ.`,
    keywords: GLOBAL_KEYWORDS,
    priority: 0.6,
  });
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function absoluteUrl(pagePath) {
  if (pagePath === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${pagePath}`;
}

function injectMeta(html, page) {
  const url = absoluteUrl(page.path);
  const ogTitle = page.ogTitle ?? page.title;
  const ogDescription = page.ogDescription ?? page.description;
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const ogTitleEsc = escapeHtml(ogTitle);
  const ogDescEsc = escapeHtml(ogDescription);

  let next = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);

  const replacements = [
    [/name="description" content="[^"]*"/i, `name="description" content="${description}"`],
    [/property="og:title" content="[^"]*"/i, `property="og:title" content="${ogTitleEsc}"`],
    [/property="og:description" content="[^"]*"/i, `property="og:description" content="${ogDescEsc}"`],
    [/property="og:url" content="[^"]*"/i, `property="og:url" content="${url}"`],
    [/property="og:image" content="[^"]*"/i, `property="og:image" content="${OG_IMAGE}"`],
    [/name="twitter:title" content="[^"]*"/i, `name="twitter:title" content="${ogTitleEsc}"`],
    [/name="twitter:description" content="[^"]*"/i, `name="twitter:description" content="${ogDescEsc}"`],
    [/name="twitter:image" content="[^"]*"/i, `name="twitter:image" content="${OG_IMAGE}"`],
    [/rel="canonical" href="[^"]*"/i, `rel="canonical" href="${url}"`],
  ];

  for (const [pattern, replacement] of replacements) {
    if (pattern.test(next)) {
      next = next.replace(pattern, replacement);
    }
  }

  if (page.keywords) {
    if (/name="keywords"/i.test(next)) {
      next = next.replace(
        /name="keywords" content="[^"]*"/i,
        `name="keywords" content="${escapeHtml(page.keywords)}"`,
      );
    } else {
      next = next.replace(
        '</head>',
        `    <meta name="keywords" content="${escapeHtml(page.keywords)}" />\n  </head>`,
      );
    }
  } else {
    next = next.replace(/\s*<meta name="keywords" content="[^"]*"\s*\/?>/i, '');
  }

  return next;
}

function writeSitemap(entries) {
  const today = new Date().toISOString().slice(0, 10);
  const body = entries
    .map((page) => {
      const loc = absoluteUrl(page.path);
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${page.priority.toFixed(1)}</priority>\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
  fs.writeFileSync(path.join(dist, 'sitemap.xml'), xml, 'utf8');
}

function writeRouteHtml(template, page) {
  const html = injectMeta(template, page);
  if (page.path === '/') {
    fs.writeFileSync(path.join(dist, 'index.html'), html, 'utf8');
    return;
  }
  const dir = path.join(dist, page.path.replace(/^\//, ''));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
}

if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('dist/index.html missing — run vite build first');
  process.exit(1);
}

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
writeSitemap(pages);
for (const page of pages) {
  writeRouteHtml(template, page);
}

console.log(`SEO: wrote sitemap.xml and ${pages.length} HTML shells`);
