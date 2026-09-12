import { GLOBAL_KEYWORDS } from './geoMarkets';
import type { PageSeo } from './seo';

export type Market = {
  slug: string;
  name: string;
  h1: string;
  eyebrow: string;
  summary: string;
  body: string[];
  cities: string[];
  servicesFocus: string[];
  keywordsExtra: string[];
};

export const markets: Market[] = [
  {
    slug: 'united-states',
    name: 'United States',
    h1: 'Printing, Signage & Packaging for the United States',
    eyebrow: 'United States · Chicago & nationwide',
    summary:
      'GraphixEye supports US brands and sales teams — including Chicago and nationwide programmes — with commercial printing, custom signage, packaging, gifting, and immersive production from our global factory HQ.',
    body: [
      'US marketing and facilities teams brief GraphixEye when they need production that stays locked from proof to delivery across multiple states. Our sales presence includes Chicago and other US markets, with factory production coordinated from Dammam for export-ready quality.',
      'Offset and digital printing, large format, outdoor and interior signage, custom packaging, corporate gifting, and AR/VR activations are specified once and repeated consistently — whether the next site is Illinois, Texas, California, New York, or another state.',
    ],
    cities: ['Chicago', 'New York', 'Los Angeles', 'Houston', 'Dallas', 'Miami', 'Atlanta', 'Boston', 'Seattle', 'San Francisco'],
    servicesFocus: ['Commercial printing', 'Custom signage', 'Packaging', 'Corporate gifting', 'Graphic design', 'AR / VR'],
    keywordsExtra: [
      'printing Chicago',
      'printing company USA',
      'signage United States',
      'packaging USA',
      'printing Illinois',
      'printing Texas',
      'printing California',
      'printing New York',
    ],
  },
  {
    slug: 'united-kingdom',
    name: 'United Kingdom',
    h1: 'Printing, Signage & Packaging for the United Kingdom',
    eyebrow: 'United Kingdom · London & UK-wide',
    summary:
      'GraphixEye works with UK brands and partners on print, signage, packaging, and immersive experiences — briefed from London, Manchester, Birmingham, and across England, Scotland, Wales, and Northern Ireland.',
    body: [
      'UK teams use GraphixEye as a global production partner when campaigns and environments need factory-grade colour control and finishing. We coordinate artwork, materials, and logistics so UK rollouts match the brand book.',
      'From commercial print and retail signage to packaging and event gifting, programmes can be specified for Greater London and extended UK-wide without rebuilding the supply chain for every city.',
    ],
    cities: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool', 'Edinburgh', 'Bristol', 'Cardiff', 'Belfast'],
    servicesFocus: ['Commercial printing', 'Signage & wayfinding', 'Packaging', 'Event gifting', 'Brand design', 'Immersive AR / VR'],
    keywordsExtra: [
      'printing London',
      'printing United Kingdom',
      'signage UK',
      'packaging United Kingdom',
      'printing England',
      'printing Scotland',
      'printing Manchester',
    ],
  },
  {
    slug: 'united-arab-emirates',
    name: 'United Arab Emirates',
    h1: 'Printing, Signage & Packaging for the UAE',
    eyebrow: 'UAE · Dubai, Abu Dhabi & all emirates',
    summary:
      'GraphixEye serves UAE brands and agencies with printing, signage, packaging, and immersive production across Dubai, Abu Dhabi, Sharjah, and the northern emirates.',
    body: [
      'GCC retail, hospitality, and corporate teams brief GraphixEye for bilingual Arabic/English artwork and finishes that survive Gulf conditions. Production is run from our Dammam factory HQ with regional delivery coordination.',
      'Whether the job is outdoor identity in Dubai, wayfinding in Abu Dhabi, or packaging for UAE retail, one specification keeps colour and materials locked across emirates.',
    ],
    cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
    servicesFocus: ['Commercial printing', 'Outdoor signage', 'Packaging', 'Corporate gifting', 'Bilingual design', 'AR / VR events'],
    keywordsExtra: [
      'printing Dubai',
      'printing Abu Dhabi',
      'signage UAE',
      'packaging Dubai',
      'printing United Arab Emirates',
    ],
  },
  {
    slug: 'saudi-arabia',
    name: 'Saudi Arabia',
    h1: 'Printing, Signage & Packaging in Saudi Arabia',
    eyebrow: 'Saudi Arabia · Dammam factory HQ',
    summary:
      'GraphixEye’s factory HQ sits in Dammam’s 2nd Industrial City, producing print, signage, packaging, gifting, and immersive work for brands across the Kingdom — Riyadh, Jeddah, Eastern Province, and beyond.',
    body: [
      'Local and national programmes benefit from press-side colour checks, factory visits, and install crews who understand onshore and industrial sites. The same floor that serves global clients powers Kingdom-wide rollouts.',
      'Design through finishing under one roof means one brief for logos, outdoor signs, packaging, and events — with locked specs for the next city.',
    ],
    cities: ['Dammam', 'Riyadh', 'Jeddah', 'Khobar', 'Jubail', 'Dhahran', 'Yanbu', 'Abha'],
    servicesFocus: ['Offset & digital printing', 'Signage & install', 'Custom packaging', 'Corporate gifting', 'Graphic design', 'AR / VR / MR'],
    keywordsExtra: [
      'printing Dammam',
      'printing company Saudi Arabia',
      'signage Riyadh',
      'packaging Jeddah',
      'printing KSA',
    ],
  },
  {
    slug: 'europe',
    name: 'Europe',
    h1: 'Printing, Signage & Packaging for Europe',
    eyebrow: 'Europe · multi-country programmes',
    summary:
      'GraphixEye supports European brands and agencies with export-ready printing, signage, packaging, and immersive production for multi-country campaigns.',
    body: [
      'When European marketing teams need a single production partner for print and environments across borders, GraphixEye locks artwork and materials once, then ships or stages delivery by market.',
      'From Germany and France to the Nordics, Benelux, and Southern Europe, programmes stay consistent without rebuilding the vendor list in every country.',
    ],
    cities: ['Paris', 'Berlin', 'Amsterdam', 'Madrid', 'Milan', 'Rome', 'Zurich', 'Stockholm', 'Vienna', 'Brussels', 'Frankfurt', 'Munich', 'Dublin', 'Lisbon', 'Warsaw'],
    servicesFocus: ['Commercial printing', 'Retail & exhibition signage', 'Packaging', 'Corporate gifting', 'Brand systems', 'Immersive experiences'],
    keywordsExtra: ['printing Europe', 'signage Europe', 'packaging Europe', 'printing Germany', 'printing France'],
  },
  {
    slug: 'asia',
    name: 'Asia',
    h1: 'Printing, Signage & Packaging for Asia',
    eyebrow: 'Asia · Singapore, India, East Asia & beyond',
    summary:
      'GraphixEye partners with Asian brands and regional HQs on print, signage, packaging, and immersive work spanning Singapore, India, East Asia, and Southeast Asia.',
    body: [
      'Regional rollouts often need bilingual or multi-script artwork and finishes that travel. GraphixEye coordinates production from our factory HQ so Asia programmes keep one visual standard.',
      'From Singapore and Hong Kong to Mumbai, Delhi, Tokyo, Seoul, and Southeast Asian hubs, we support print and environment jobs that must match across markets.',
    ],
    cities: ['Singapore', 'Hong Kong', 'Tokyo', 'Seoul', 'Shanghai', 'Beijing', 'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Bangkok', 'Kuala Lumpur', 'Jakarta', 'Manila'],
    servicesFocus: ['Commercial printing', 'Signage', 'Packaging', 'Gifting', 'Design', 'AR / VR'],
    keywordsExtra: ['printing Singapore', 'printing India', 'signage Asia', 'packaging Asia', 'printing Hong Kong'],
  },
  {
    slug: 'africa',
    name: 'Africa',
    h1: 'Printing, Signage & Packaging for Africa',
    eyebrow: 'Africa · key commercial hubs',
    summary:
      'GraphixEye supports African commercial hubs with printing, signage, packaging, and brand production for corporate, retail, and event programmes.',
    body: [
      'Teams in Nairobi, Lagos, Johannesburg, Cape Town, and other hubs brief GraphixEye when they need export-quality production with clear logistics and locked brand specs.',
      'Print, outdoor identity, packaging, and gifting can be planned as one programme rather than a patchwork of local vendors.',
    ],
    cities: ['Nairobi', 'Lagos', 'Johannesburg', 'Cape Town', 'Cairo', 'Accra', 'Casablanca'],
    servicesFocus: ['Commercial printing', 'Signage', 'Packaging', 'Corporate gifting', 'Design'],
    keywordsExtra: ['printing Africa', 'printing Nigeria', 'printing South Africa', 'signage Kenya', 'packaging Egypt'],
  },
  {
    slug: 'canada',
    name: 'Canada',
    h1: 'Printing, Signage & Packaging for Canada',
    eyebrow: 'Canada · Toronto, Vancouver, Montreal & provinces',
    summary:
      'GraphixEye works with Canadian brands on commercial printing, signage, packaging, and immersive production across provinces — Toronto, Vancouver, Montreal, and beyond.',
    body: [
      'Canadian teams use GraphixEye as a global factory partner for campaigns and environments that need consistent colour and finishing when programmes span multiple provinces.',
      'From Ontario and British Columbia to Quebec and the Prairies, one production brief keeps the brand locked.',
    ],
    cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton'],
    servicesFocus: ['Commercial printing', 'Signage', 'Packaging', 'Gifting', 'Design', 'AR / VR'],
    keywordsExtra: ['printing Canada', 'printing Toronto', 'signage Canada', 'packaging Canada', 'printing Ontario'],
  },
  {
    slug: 'australia',
    name: 'Australia',
    h1: 'Printing, Signage & Packaging for Australia',
    eyebrow: 'Australia · Sydney, Melbourne & nationwide',
    summary:
      'GraphixEye supports Australian brands with printing, signage, packaging, and immersive production for Sydney, Melbourne, and nationwide programmes.',
    body: [
      'Australian marketing and facilities teams brief GraphixEye when they want factory-grade production with clear export logistics and repeatable specs across states and territories.',
      'Commercial print, retail signage, packaging, and event work can be planned once and extended from NSW and Victoria across the country.',
    ],
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra'],
    servicesFocus: ['Commercial printing', 'Signage', 'Packaging', 'Gifting', 'Design', 'Immersive'],
    keywordsExtra: ['printing Australia', 'printing Sydney', 'signage Australia', 'packaging Melbourne', 'printing NSW'],
  },
];

export function getMarket(slug: string): Market | undefined {
  return markets.find((m) => m.slug === slug);
}

export function marketPageSeo(market: Market): PageSeo {
  return {
    path: `/markets/${market.slug}`,
    title: `${market.name} | Printing, Signage & Packaging | GraphixEye`,
    description: market.summary,
    keywords: [GLOBAL_KEYWORDS, ...market.keywordsExtra, ...market.cities.map((c) => `GraphixEye ${c}`)].join(', '),
    ogTitle: `${market.h1} | GraphixEye`,
    ogDescription: market.summary,
    priority: 0.85,
  };
}

export function marketsIndexSeo(): PageSeo {
  return {
    path: '/markets',
    title: 'Markets Worldwide | Printing, Signage & Packaging | GraphixEye',
    description:
      'GraphixEye serves brands worldwide — United States (including Chicago), United Kingdom, UAE, Saudi Arabia, Europe, Asia, Africa, Canada, and Australia — from our Dammam factory HQ.',
    keywords: GLOBAL_KEYWORDS,
    priority: 0.9,
  };
}
