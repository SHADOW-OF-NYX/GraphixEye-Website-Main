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

/** @type {{ path: string, title: string, description: string, keywords?: string, ogTitle?: string, ogDescription?: string, priority: number }[]} */
const pages = [
  {
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
  {
    path: '/experience',
    title: 'Our Work & Experience | Printing, Signage & Immersive Experiences | GraphixEye KSA',
    description:
      "Explore GraphixEye's portfolio of printing, signage, packaging, and immersive AR/VR/MR experiences delivered for clients across Saudi Arabia.",
    priority: 0.9,
  },
  {
    path: '/services',
    title: 'Services | Design, Signage, Printing, Packaging & Gifting | GraphixEye Dammam',
    description:
      'Browse GraphixEye services from our Dammam factory: graphic design, signage, commercial printing, packaging, corporate gifting, and immersive AR/VR/AI solutions across Saudi Arabia.',
    priority: 0.9,
  },
  {
    path: '/services/printing',
    title: 'Printing Dammam | Commercial Printing Company | GraphixEye',
    description:
      'Printing in Dammam from GraphixEye: offset and digital printing, large format, brochures, and catalogues. Your printing company Dammam partner serving brands across Saudi Arabia.',
    keywords: 'printing Dammam, printing company Dammam, commercial printing Saudi Arabia, offset printing KSA, digital printing Dammam',
    priority: 0.9,
  },
  {
    path: '/services/packaging',
    title: 'Packaging Dammam | Custom Packaging Company Saudi Arabia | GraphixEye',
    description:
      'Packaging in Dammam from GraphixEye: custom boxes, labels, flexible and sustainable packaging. Packaging company Saudi Arabia production from our Dammam factory.',
    keywords: 'packaging Dammam, packaging company Saudi Arabia, custom packaging KSA, product packaging Dammam',
    priority: 0.9,
  },
  {
    path: '/services/signage',
    title: 'Signage Dammam | Signage Company Saudi Arabia | GraphixEye',
    description:
      'Signage in Dammam from GraphixEye: outdoor signs, LED, wayfinding, and fleet graphics. Signage company Dammam fabrication and install across Saudi Arabia.',
    keywords: 'signage Dammam, signage company Dammam, custom signs Saudi Arabia, LED signage KSA',
    priority: 0.9,
  },
  {
    path: '/services/gifting',
    title: 'Corporate Gifting Saudi Arabia | Branded Gifts Dammam | GraphixEye',
    description:
      'Corporate gifting Saudi Arabia from GraphixEye in Dammam: branded gifts, promotional kits, trophies, uniforms, and event merchandise for brands across the Kingdom.',
    priority: 0.8,
  },
  {
    path: '/services/design',
    title: 'Graphic Design Dammam | Branding Agency Saudi Arabia | GraphixEye',
    description:
      'Graphic design in Dammam from GraphixEye: logos, brand systems, and production-ready artwork. Branding agency Saudi Arabia with in-house print and signage.',
    priority: 0.8,
  },
  {
    path: '/services/ar-vr',
    title: 'AR VR Saudi Arabia | Immersive Experiences Dammam | GraphixEye',
    description:
      'AR VR solutions Saudi Arabia from GraphixEye: augmented, virtual, and mixed reality for events and retail, produced with immersive experiences Dammam fabrication.',
    priority: 0.8,
  },
  {
    path: '/services/ai',
    title: 'AI Solutions Saudi Arabia | AI Design Dammam | GraphixEye',
    description:
      'AI solutions Saudi Arabia from GraphixEye: AI design Dammam workflows that end in print-ready, brand-safe creative for campaigns across the Kingdom.',
    priority: 0.8,
  },
  {
    path: '/about',
    title: "About GraphixEye | Dammam's Leading Creative Production House",
    description:
      "Learn about GraphixEye - Dammam's trusted factory for printing, signage, packaging, gifting, and immersive experiences. We Do As We Promise, serving clients across Saudi Arabia since day one.",
    priority: 0.7,
  },
  {
    path: '/contact',
    title: 'Contact GraphixEye | Printing & Signage Company Dammam, Saudi Arabia',
    description:
      'Get in touch with GraphixEye in Dammam, Saudi Arabia. Request a quote for printing, packaging, signage, gifting, or AR/VR/MR projects. We respond within 24 hours.',
    priority: 0.7,
  },
  {
    path: '/careers',
    title: 'Careers at GraphixEye | Join Our Dammam Production Team',
    description:
      'Explore careers at GraphixEye in Dammam, Saudi Arabia. Work with a creative production house spanning design, print, signage, packaging, and immersive experiences.',
    priority: 0.5,
  },
  {
    path: '/vendors',
    title: 'Vendor Registration | Supply GraphixEye Dammam',
    description:
      'Register as a vendor with GraphixEye in Dammam. Partner with our printing, packaging, and signage production house serving clients across Saudi Arabia.',
    priority: 0.4,
  },
  {
    path: '/expansions',
    title: 'Expansions | GraphixEye Capabilities Across Saudi Arabia',
    description:
      'Discover how GraphixEye expands brand presence through design, environments, and production from our Dammam factory across the Kingdom of Saudi Arabia.',
    priority: 0.6,
  },
  {
    path: '/faq',
    title: 'FAQ | One-Stop Printing, Signage & Packaging in Dammam | GraphixEye',
    description:
      'Answers about GraphixEye in Dammam: one-stop design, printing, signage, packaging, gifting, and AR/VR production across Saudi Arabia. Factory visits, timelines, and how to get a quote.',
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
    title: `${title} | GraphixEye Dammam, Saudi Arabia`,
    description: `${title} by GraphixEye in Dammam for clients across Saudi Arabia.`,
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
