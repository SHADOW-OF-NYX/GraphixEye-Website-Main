import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { breadcrumbJsonLd, faqPageJsonLd, getPageSeo } from '../data/seo';
import { allFaqs, site } from '../data/site';
import { serviceHubs } from '../data/serviceHubs';

export default function Faq() {
  const seo = getPageSeo('/faq')!;

  return (
    <div className="bg-ll-white min-h-screen pt-28 sm:pt-36 pb-28">
      <Seo
        page={seo}
        jsonLd={[
          faqPageJsonLd(allFaqs),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'FAQ', path: '/faq' },
          ]),
        ]}
      />

      <div className="max-w-[900px] mx-auto px-6 md:px-8">
        <p className="text-[12px] tracking-[0.22em] uppercase text-black/40 mb-4">FAQ</p>
        <h1 className="display-xl mb-6">One-stop production in Dammam — answered</h1>
        <p className="text-[17px] leading-relaxed text-black/65 mb-14 max-w-2xl">
          GraphixEye is Saudi Arabia&apos;s Dammam-based one-stop house for design, printing, signage, packaging,
          corporate gifting, and immersive AR/VR — from one factory floor. {site.tagline}.
        </p>

        <div className="flex flex-col gap-2 mb-20">
          {allFaqs.map((item) => (
            <details key={item.q} className="faq-item group bg-ll-sand card-r px-6 py-5">
              <summary className="flex items-center justify-between cursor-pointer list-none font-display text-[16px] md:text-[17px]">
                {item.q}
                <span className="faq-plus ml-4 text-xl leading-none transition-transform">+</span>
              </summary>
              <p className="pt-4 text-[14px] leading-relaxed text-black/55 max-w-2xl">{item.a}</p>
            </details>
          ))}
        </div>

        <section className="mb-16" lang="ar" dir="rtl">
          <h2 className="display-md mb-4 text-right">هل جرافيكس آي حل متكامل في الدمام؟</h2>
          <p className="text-[16px] leading-relaxed text-black/55 text-right">
            نعم. جرافيكس آي بيت إنتاج متكامل في الدمام يجمع التصميم والطباعة واللوحات والتغليف وهدايا الشركات والتجارب
            الغامرة تحت سقف واحد، ويخدم العملاء في جميع أنحاء المملكة العربية السعودية.
          </p>
        </section>

        <h2 className="display-md mb-6">Explore services</h2>
        <ul className="flex flex-wrap gap-3 mb-16">
          {serviceHubs.map((hub) => (
            <li key={hub.slug}>
              <Link
                to={`/services/${hub.slug}`}
                className="inline-block border border-ll-stroke rounded-full px-4 py-2 text-[13px] hover:border-ll-highlight transition-colors"
              >
                {hub.anchorLabel}
              </Link>
            </li>
          ))}
        </ul>

        <div className="bg-ll-sand card-r p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="display-md mb-3">Still deciding?</h2>
            <p className="text-[15px] text-black/55 max-w-md">
              Call {site.phone} or request a quote — we respond within 24 hours from Dammam.
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
