import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { breadcrumbJsonLd, faqPageJsonLd, getPageSeo, SITE_URL } from '../data/seo';
import { allFaqs, site } from '../data/site';
import { serviceHubs } from '../data/serviceHubs';

export default function About() {
  const seo = getPageSeo('/about')!;

  const aboutJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: seo.title,
      description: seo.description,
      url: `${SITE_URL}/about`,
      mainEntity: { '@id': `${SITE_URL}/#business` },
    },
    faqPageJsonLd(allFaqs.slice(0, 6)),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
    ]),
  ];

  return (
    <div className="bg-ll-white min-h-screen pt-28 sm:pt-36 pb-28">
      <Seo page={seo} jsonLd={aboutJsonLd} />

      <div className="max-w-[900px] mx-auto px-6 md:px-8">
        <p className="text-[12px] tracking-[0.22em] uppercase text-black/40 mb-4">About</p>
        <h1 className="display-xl mb-8">Saudi Arabia&apos;s one-stop creative production house in Dammam</h1>
        <p className="text-[17px] leading-relaxed text-black/65 mb-8">
          GraphixEye is the one-stop solution brands use when they need design, commercial printing, custom signage,
          packaging, corporate gifting, and immersive AR/VR/MR — without splitting the job across vendors. Part of{' '}
          {site.parent}, we have operated from Dammam&apos;s 2nd Industrial City since {site.established}. Our promise:{' '}
          {site.tagline}.
        </p>
        <p className="text-[16px] leading-relaxed text-black/55 mb-8">
          Artwork, fabrication, press, finishing, and install sit on one floor. That single-factory model keeps colour,
          materials, and timelines accountable — whether the brief is a logo system, outdoor signage, commercial
          printing, custom packaging, branded gifts, or an immersive activation in Riyadh, Jeddah, or the Eastern
          Province.
        </p>

        <h2 className="display-md mb-4">One factory. Full production stack.</h2>
        <p className="text-[16px] leading-relaxed text-black/55 mb-10">
          Instead of a design agency plus a printer plus a signage contractor plus a packaging supplier, GraphixEye
          delivers the full stack from Dammam and installs across the Kingdom. That is what &ldquo;one-stop&rdquo; means
          here: one brief, one team, one set of locked specs for the next reprint or the next site.
        </p>

        <address className="not-italic bg-ll-sand card-r p-6 md:p-8 mb-14 text-[15px] leading-relaxed text-black/65">
          <p className="text-[12px] tracking-[0.22em] uppercase text-black/40 mb-3">Factory · NAP</p>
          <p className="font-display text-[18px] text-black mb-2">GraphixEye</p>
          <p>{site.address.join(', ')}</p>
          <p className="mt-2">
            <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="hover:text-ll-highlight transition-colors">
              {site.phone}
            </a>
            {' · '}
            <a href={`mailto:${site.email}`} className="hover:text-ll-highlight transition-colors">
              {site.email}
            </a>
          </p>
          <p className="mt-2">
            <Link to="/contact" className="underline underline-offset-4 hover:text-ll-highlight transition-colors">
              Contact / get a quote
            </Link>
          </p>
        </address>

        <section className="mb-16" lang="ar" dir="rtl">
          <h2 className="display-md mb-4 text-right">جرافيكس آي — حل متكامل في الدمام</h2>
          <p className="text-[16px] leading-relaxed text-black/55 text-right">
            جرافيكس آي بيت إنتاج إبداعي متكامل في الدمام: تصميم، طباعة، لوحات، تغليف، هدايا الشركات، وتجارب غامرة تحت
            سقف واحد. نخدم العملاء في الرياض وجدة والمنطقة الشرقية وجميع أنحاء المملكة. شعارنا: نفعل كما نعد.
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

        <h2 className="display-md mb-6">Common questions</h2>
        <div className="flex flex-col gap-2 mb-6">
          {allFaqs.slice(0, 5).map((item) => (
            <details key={item.q} className="faq-item group bg-ll-sand card-r px-6 py-5">
              <summary className="flex items-center justify-between cursor-pointer list-none font-display text-[16px]">
                {item.q}
                <span className="faq-plus ml-4 text-xl leading-none">+</span>
              </summary>
              <p className="pt-4 text-[14px] leading-relaxed text-black/55">{item.a}</p>
            </details>
          ))}
        </div>
        <p className="mb-16">
          <Link to="/faq" className="text-[14px] underline underline-offset-4 hover:text-ll-highlight transition-colors">
            See all FAQs →
          </Link>
        </p>

        <div className="bg-ll-sand card-r p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="display-md mb-3">Work with GraphixEye</h2>
            <p className="text-[15px] text-black/55 max-w-md">
              Request a quote for your next one-stop printing, signage, packaging, or immersive project in Saudi Arabia.
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
