import type { WorkCategory } from './works';
import { works } from './works';

export type ServiceHub = {
  slug: string;
  /** Related work category for listing child services; null for AI-only hub. */
  category: WorkCategory | 'Immersive' | null;
  /** Child work slugs when category alone is not enough (ar-vr, ai). */
  workSlugs?: string[];
  h1: string;
  eyebrow: string;
  intro: string;
  sections: { h2: string; body: string }[];
  arabicH2: string;
  arabicBody: string;
  image: string;
  imageAlt: string;
  relatedHubs: string[];
  schemaServiceType: string;
};

export const serviceHubs: ServiceHub[] = [
  {
    slug: 'printing',
    category: 'Printing',
    h1: 'Commercial Printing Company in Dammam, Saudi Arabia',
    eyebrow: 'Press & finish',
    intro:
      'GraphixEye is a commercial printing company in Dammam built for brands that need colour accuracy, finish quality, and reliable turnaround across Saudi Arabia. From our factory in the 2nd Industrial City we run offset and digital presses, silk screen, UV and hot stamping, continuous forms, and full bindery — so one team owns the job from proof to delivery.',
    sections: [
      {
        h2: 'Digital Printing Services KSA',
        body: 'When you need speed, variable data, or short-run commercial printing in Saudi Arabia, our digital printing lines in Dammam keep campaigns moving. Business cards, flyers, booklets, and on-demand reprints stay matched to brand colour without waiting for a long offset set-up. Agencies and in-house marketing teams across Riyadh, Jeddah, and the Eastern Province use GraphixEye digital printing Dammam capacity for launches, events, and seasonal refresh cycles.',
      },
      {
        h2: 'Offset Printing Dammam',
        body: 'For volume catalogues, packaging inserts, and high-run collateral, offset printing KSA buyers choose GraphixEye for press-side colour control. We lock proofs, run commercial printing Saudi Arabia jobs at industrial scale, and finish in house with binding, lamination, and die cutting. That is why organisations treat us as their printing company Dammam partner for repeatable quality — the next reprint looks like the first.',
      },
      {
        h2: 'Large Format Printing Saudi Arabia',
        body: 'Banners, exhibition graphics, POS, and site boards need more than a desktop print. Our large format printing Saudi Arabia capability supports events, retail rollouts, and industrial sites with durable materials and install-ready finishing. Combined with our signage and packaging floors, GraphixEye keeps print, structure, and brand in one production conversation instead of a chain of vendors.',
      },
    ],
    arabicH2: 'طباعة في الدمام — شركة طباعة في السعودية',
    arabicBody:
      'جرافيكس آي هي شركة طباعة في الدمام تقدم خدمات الطباعة التجارية للأوفست والرقمية عبر المملكة العربية السعودية. من مصنعنا في المدينة الصناعية الثانية نوفر بطاقات الأعمال والكتيبات واللافتات والطباعة كبيرة الحجم بجودة يمكن الاعتماد عليها للعلامات التجارية في الدمام والرياض وجدة والمنطقة الشرقية.',
    image: '/images/divider-printing.jpg',
    imageAlt: 'commercial printing press floor Dammam Saudi Arabia GraphixEye',
    relatedHubs: ['packaging', 'design', 'signage'],
    schemaServiceType: 'Commercial Printing',
  },
  {
    slug: 'packaging',
    category: 'Packaging',
    h1: 'Custom Packaging Solutions Saudi Arabia | GraphixEye Dammam',
    eyebrow: 'Unboxing & shelf',
    intro:
      'GraphixEye is a packaging company Saudi Arabia brands trust for custom boxes, labels, flexible formats, and premium finishes produced in Dammam. We design and manufacture product packaging that protects the goods, elevates the unboxing moment, and stays consistent from sample to full production run across the Kingdom.',
    sections: [
      {
        h2: 'Custom Packaging KSA',
        body: 'Custom packaging KSA projects start with structure and brand. Whether you need rigid boxes, retail ready packaging, or specialty constructions, our Dammam team engineers materials and finishes for shelf, transit, and gifting. Product packaging Dammam clients get samples, colour locks, and production that scales without losing the detail that makes the brand feel premium.',
      },
      {
        h2: 'Packaging Design Saudi Arabia',
        body: 'Packaging design Saudi Arabia is not decoration alone — it is dielines, hierarchy, bilingual Arabic/English artwork, and finish specs that survive the press. GraphixEye pairs in-house design with the packaging floor so creative intent survives manufacturing. From innovative industry-specific solutions to sustainable and recyclable options, we keep design and production on one schedule.',
      },
      {
        h2: 'Flexible, Specialty & Sustainable Packaging',
        body: 'Pouches, bags, specialty forms, and recyclable lines sit alongside premium custom work. As a packaging company Saudi Arabia operators can rely on, we help you choose formats that fit logistics and brand story. Brands across Dammam, Riyadh, and Jeddah use GraphixEye when packaging must look intentional and ship reliably.',
      },
    ],
    arabicH2: 'تصميم تغليف السعودية — تغليف مخصص من الدمام',
    arabicBody:
      'تقدم جرافيكس آي حلول التغليف المخصص وتصميم العبوات في المملكة العربية السعودية من مصنعنا في الدمام. نصمم وننتج علب وملصقات وتغليف مرن ومستدام يحمي المنتج ويعزز تجربة فتح العبوة للعلامات التجارية في جميع أنحاء المملكة.',
    image: '/images/divider-packaging.jpg',
    imageAlt: 'custom packaging manufacturing Dammam Saudi Arabia GraphixEye',
    relatedHubs: ['printing', 'design', 'gifting'],
    schemaServiceType: 'Custom Packaging',
  },
  {
    slug: 'signage',
    category: 'Signage',
    h1: 'Signage Company in Dammam, Saudi Arabia',
    eyebrow: 'Environments & wayfinding',
    intro:
      'GraphixEye is a signage company Dammam organisations call when exterior identity, interior wayfinding, LED programmes, and fleet graphics must be fabricated and installed correctly. From the 2nd Industrial City we manufacture custom signs Saudi Arabia wide — headquarters, industrial sites, retail, and exhibitions — with crews who understand onshore and offshore realities.',
    sections: [
      {
        h2: 'Outdoor Signage Dammam',
        body: 'Outdoor signage Dammam projects face sun, dust, and long viewing distances. We build exterior identification, road and regulatory systems, and vehicle graphics that stay legible and on brand. As a signage company Dammam with full fabrication capacity, GraphixEye handles surveys, materials, and install so the facade matches the brand book.',
      },
      {
        h2: 'LED Signage KSA & Digital Screens',
        body: 'LED signage KSA programmes need content planning as much as hardware. We deliver digital signage, screen networks, and hybrid physical-digital environments for lobbies, campuses, and events. Combined with wall branding and display stands, brands get a coherent environmental system rather than disconnected boards.',
      },
      {
        h2: 'Custom Signs Saudi Arabia — Interior & Events',
        body: 'Interior signage, directional systems, exhibition booths, and event branding complete the offer. Custom signs Saudi Arabia clients expect bilingual clarity and durable finishes; we produce and fit them from the same Dammam floor that runs print and packaging, keeping colour and craft consistent across touchpoints.',
      },
    ],
    arabicH2: 'لوحات الدمام — تصنيع وتركيب اللوحات في السعودية',
    arabicBody:
      'جرافيكس آي شركة لوحات ولافتات في الدمام متخصصة في اللوحات الخارجية والداخلية والإرشادية ولوحات LED والواجهات والمركبات. نصنع ونركب حلول اللافتات للمشاريع في الدمام والرياض وجدة والمنشآت الصناعية في جميع أنحاء المملكة العربية السعودية.',
    image: '/images/divider-signage.jpg',
    imageAlt: 'custom signage manufacturing Dammam Saudi Arabia GraphixEye',
    relatedHubs: ['printing', 'design', 'ar-vr'],
    schemaServiceType: 'Signage Manufacturing',
  },
  {
    slug: 'gifting',
    category: 'Gifting',
    h1: 'Corporate Gifting & Branded Gifts Saudi Arabia',
    eyebrow: 'Branded kits & recognition',
    intro:
      'Corporate gifting Saudi Arabia programmes succeed when the gift feels intentional, on brand, and deliverable at scale. GraphixEye produces branded gifts KSA teams use for employees, clients, and events — giveaways, acrylic trophies, lanyards, uniforms, and safety wear — from our Dammam production facility.',
    sections: [
      {
        h2: 'Branded Gifts KSA',
        body: 'Branded gifts KSA buyers need more than logo-stamped stock. We design and produce promotional gifts Dammam clients can put in front of executives and site crews alike, with materials and finishes that match the wider brand system. Custom gifts Saudi Arabia campaigns stay coherent with your print and packaging because they leave the same factory.',
      },
      {
        h2: 'Promotional Gifts Dammam for Events',
        body: 'Launches, conferences, and national occasions need kits that arrive on time. Promotional gifts Dammam production at GraphixEye covers lanyards, badges, giveaway sets, and recognition pieces with bilingual artwork when required. We coordinate quantities and packing so event teams are not assembling brand moments the night before.',
      },
      {
        h2: 'Uniforms, Apparel & Industrial Safety Wear',
        body: 'Corporate wear and safety wears extend the brand onto people and sites. From apparel to industrial PPE branding, GraphixEye supports programmes that must look professional and survive real work conditions across Saudi Arabia.',
      },
    ],
    arabicH2: 'هدايا الشركات السعودية — هدايا وهوية من الدمام',
    arabicBody:
      'تقدم جرافيكس آي هدايا الشركات والهدايا الترويجية المخصصة في المملكة العربية السعودية من منشأتنا في الدمام. نصنع هدايا العلامة التجارية والجوائز والزي الموحد ومستلزمات الفعاليات بجودة تناسب الشركات والمؤسسات في جميع أنحاء المملكة.',
    image: '/images/divider-gifting.jpg',
    imageAlt: 'corporate branded gifts manufacturing Dammam Saudi Arabia',
    relatedHubs: ['design', 'printing', 'packaging'],
    schemaServiceType: 'Corporate Gifting',
  },
  {
    slug: 'design',
    category: 'Design',
    h1: 'Graphic Design & Branding Agency in Dammam, KSA',
    eyebrow: 'Identity systems',
    intro:
      'GraphixEye is a graphic design Dammam studio embedded in a real production house. Logos, brand systems, print and digital design, packaging graphics, and illustration are built as artwork that is ready for press, signage, and immersive channels across Saudi Arabia — not files that fall apart in manufacturing.',
    sections: [
      {
        h2: 'Branding Agency Saudi Arabia',
        body: 'As a branding agency Saudi Arabia teams can brief in one place, we connect strategy to production. Colour, type, bilingual Arabic/English systems, and guidelines are developed with the factory floor in mind so identity survives offset, vinyl, LED, and packaging substrates. Creative agency Dammam clients get fewer handoffs and clearer proofs.',
      },
      {
        h2: 'Logo Design KSA & Visual Systems',
        body: 'Logo design KSA projects at GraphixEye include marks that work at favicon scale and on building fascias. We extend into print design, digital design, packaging design, and infographics so every touchpoint speaks one visual language. That continuity is why brands treat us as more than a freelance design desk.',
      },
      {
        h2: 'Artwork Ready for the Kingdom',
        body: 'Graphic design Dammam only matters if it prints. Our designers sit beside presses and fabrication, checking proofs before volume runs. From Riyadh campaigns to Eastern Province sites, GraphixEye delivers creative that is production-ready across Saudi Arabia.',
      },
    ],
    arabicH2: 'تصميم جرافيك الدمام — هوية وعلامة تجارية',
    arabicBody:
      'جرافيكس آي وكالة تصميم جرافيك وهوية بصرية في الدمام تعمل داخل مصنع إنتاج حقيقي. نصمم الشعارات وأنظمة الهوية والمواد التسويقية والتغليف بأعمال فنية جاهزة للطباعة واللوحات والتجارب الرقمية في المملكة العربية السعودية.',
    image: '/images/divider-design.jpg',
    imageAlt: 'graphic design branding studio Dammam Saudi Arabia GraphixEye',
    relatedHubs: ['printing', 'packaging', 'signage'],
    schemaServiceType: 'Graphic Design',
  },
  {
    slug: 'ar-vr',
    category: 'Immersive',
    workSlugs: ['augmented-reality', 'virtual-reality', 'mixed-reality'],
    h1: 'AR, VR & MR Immersive Experiences Saudi Arabia',
    eyebrow: 'Spatial & immersive',
    intro:
      'GraphixEye builds AR VR solutions Saudi Arabia brands use for launches, retail, training, and exhibitions. Augmented reality, virtual reality, and mixed reality experiences extend print and physical environments into interactive layers — produced alongside the same Dammam team that fabricates the spaces those experiences live in.',
    sections: [
      {
        h2: 'Augmented Reality KSA',
        body: 'Augmented reality KSA projects turn packaging, signage, and print into interactive overlays. We design AR experiences that respect brand systems and work on the devices your audiences already use. Immersive experiences Dammam clients get concepts that are installable in real venues, not demos that never leave a laptop.',
      },
      {
        h2: 'Immersive Experiences Dammam',
        body: 'Immersive experiences Dammam production means coordinating content, hardware planning, and on-site realities. From brand worlds in VR to hybrid MR installs, GraphixEye delivers mixed reality Saudi Arabia programmes that sit next to exhibition booths, digital signage, and environmental graphics we also build.',
      },
      {
        h2: 'Events, Retail & Brand Activations',
        body: 'AR VR solutions Saudi Arabia perform best when creative, fabrication, and tech share one schedule. We support experiential marketing across the Kingdom with a production house mindset — clear specs, tested colour, and crews who understand both the physical and digital layers of the experience.',
      },
    ],
    arabicH2: 'الواقع المعزز السعودية — تجارب غامرة من الدمام',
    arabicBody:
      'تقدم جرافيكس آي حلول الواقع المعزز والافتراضي والمختلط للعلامات التجارية في المملكة العربية السعودية. نصمم تجارب غامرة للفعاليات والتجزئة والمعارض انطلاقاً من الدمام، ونجمع بين التقنية والإنتاج الميداني تحت سقف واحد.',
    image: '/images/works/augmented-reality.jpg',
    imageAlt: 'augmented reality immersive experience Dammam Saudi Arabia',
    relatedHubs: ['ai', 'signage', 'design'],
    schemaServiceType: 'Augmented Reality and Virtual Reality',
  },
  {
    slug: 'ai',
    category: null,
    workSlugs: ['ai-services'],
    h1: 'AI-Powered Creative Solutions Saudi Arabia',
    eyebrow: 'Smart production',
    intro:
      'GraphixEye delivers AI solutions Saudi Arabia marketing and operations teams can actually put into production. We blend artificial intelligence KSA workflows with design, imaging, and content pipelines inside a Dammam factory that still checks colour on press — so AI accelerates craft instead of replacing accountability.',
    sections: [
      {
        h2: 'Artificial Intelligence KSA for Brand Teams',
        body: 'Artificial intelligence KSA adoption fails when outputs never reach print-ready files. GraphixEye builds AI-assisted design and content workflows that end in approved artwork, packaging graphics, and campaign assets. AI design Dammam programmes stay governed by brand guidelines and human review before anything hits a machine.',
      },
      {
        h2: 'AI Design Dammam Connected to the Floor',
        body: 'AI design Dammam at GraphixEye means faster exploration with the same production standards as our classic studio. We help brands prototype variants, localise bilingual materials, and prepare imaging for signage and packaging while designers and press operators keep final control.',
      },
      {
        h2: 'From Pilot to Kingdom-Wide Rollout',
        body: 'AI solutions Saudi Arabia scale when the first pilot is documented. We lock prompts, templates, and approval steps so the next branch, event, or SKU follows the same quality bar across the Kingdom — aligned with our print, packaging, and immersive teams.',
      },
    ],
    arabicH2: 'حلول الذكاء الاصطناعي السعودية — إبداع وإنتاج',
    arabicBody:
      'تمزج جرافيكس آي بين الذكاء الاصطناعي والإنتاج الإبداعي في الدمام. نساعد العلامات التجارية في المملكة العربية السعودية على تسريع التصميم والمحتوى والصور مع الحفاظ على معايير الجودة قبل الطباعة والتنفيذ.',
    image: '/images/works/ai-services.jpg',
    imageAlt: 'AI creative production solutions Dammam Saudi Arabia GraphixEye',
    relatedHubs: ['ar-vr', 'design', 'printing'],
    schemaServiceType: 'Artificial Intelligence Creative Services',
  },
];

export function getServiceHub(slug: string): ServiceHub | undefined {
  return serviceHubs.find((h) => h.slug === slug);
}

export function worksForHub(hub: ServiceHub) {
  if (hub.workSlugs?.length) {
    return works.filter((w) => hub.workSlugs!.includes(w.slug));
  }
  if (hub.category) {
    return works.filter((w) => w.category === hub.category);
  }
  return [];
}

export const hubSlugs = serviceHubs.map((h) => h.slug);
