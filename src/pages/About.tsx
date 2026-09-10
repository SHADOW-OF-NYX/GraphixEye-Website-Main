import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { getPageSeo, SITE_URL } from '../data/seo';
import { site } from '../data/site';
import { serviceHubs } from '../data/serviceHubs';

export default function About() {
  const seo = getPageSeo('/about')!;

  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: seo.title,
    description: seo.description,
    url: `${SITE_URL}/about`,
    mainEntity: {
      '@type': 'LocalBusiness',
      name: 'GraphixEye',
      foundingDate: site.established,
      parentOrganization: site.parent,
      address: {
        '@type': 'PostalAddress',
        streetAddress: '2nd Industrial City',
        addressLocality: 'Dammam',
        addressRegion: 'Eastern Province',
        postalCode: '34341',
        addressCountry: 'SA',
      },
    },
  };

  return (
    <div className="bg-ll-white min-h-screen pt-36 pb-28">
      <Seo page={seo} jsonLd={aboutJsonLd} />

      <div className="max-w-[900px] mx-auto px-6 md:px-8">
        <p className="text-[12px] tracking-[0.22em] uppercase text-black/40 mb-4">About</p>
        <h1 className="display-xl mb-8">Dammam&apos;s creative production house</h1>
        <p className="text-[17px] leading-relaxed text-black/65 mb-8">
          GraphixEye is a Dammam-based production house for design, signage, printing, packaging, corporate gifting,
          and immersive AR/VR/MR experiences across Saudi Arabia. Part of {site.parent}, we have operated from the
          2nd Industrial City since {site.established} with one promise: {site.tagline}.
        </p>
        <p className="text-[16px] leading-relaxed text-black/55 mb-8">
          Brands choose GraphixEye when they want artwork, fabrication, press, finishing, and install under one roof.
          That single floor approach keeps colour, materials, and timelines accountable, whether the job is a logo
          system, outdoor signage, commercial printing, custom packaging, or an immersive brand activation in Riyadh,
          Jeddah, or the Eastern Province.
        </p>
        <p className="text-[16px] leading-relaxed text-black/55 mb-14">
          From P.O. Box 4416, 2nd Industrial City, Dammam 34341, KSA, we deliver and install across the Kingdom. Visit
          the factory, brief the team, and leave with a production plan you can follow from proof to site check.
        </p>

        <section className="mb-16" lang="ar" dir="rtl">
          <h2 className="display-md mb-4 text-right">عن جرافيكس آي في الدمام</h2>
          <p className="text-[16px] leading-relaxed text-black/55 text-right">
            جرافيكس آي بيت إنتاج إبداعي في الدمام متخصص في التصميم واللوحات والطباعة والتغليف وهدايا الشركات والتجارب
            الغامرة في المملكة العربية السعودية. شعارنا: نفعل كما نعد، من المصنع إلى موقعك في أنحاء المملكة.
          </p>
        </section>

        <h2 className="display-md mb-6">What we produce</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {serviceHubs.map((hub) => (
            <li key={hub.slug}>
              <Link
                to={`/services/${hub.slug}`}
                className="block border border-ll-stroke rounded-3xl px-5 py-4 hover:border-ll-highlight transition-colors"
              >
                <span className="text-[15px] font-display">{hub.eyebrow}</span>
                <span className="block text-[13px] text-black/45 mt-1 line-clamp-2">{hub.h1}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="bg-ll-sand card-r p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="display-md mb-3">Work with GraphixEye</h2>
            <p className="text-[15px] text-black/55 max-w-md">
              Request a quote for your next printing, signage, packaging, or immersive project in Saudi Arabia.
            </p>
          </div>
          <Link
            to="/contact"
            className="self-start pill bg-black text-ll-white h-[52px] px-8 text-[14px] inline-flex items-center hover:bg-ll-highlight transition-colors"
          >
            Get a Free Quote in Dammam
          </Link>
        </div>
      </div>
    </div>
  );
}
