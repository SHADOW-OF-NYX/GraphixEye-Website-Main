import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { breadcrumbJsonLd, SITE_URL } from '../data/seo';
import { markets, marketsIndexSeo } from '../data/markets';
import { site } from '../data/site';

export default function Markets() {
  const seo = marketsIndexSeo();

  return (
    <div className="bg-ll-white min-h-screen pt-28 sm:pt-36 pb-28">
      <Seo
        page={seo}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: seo.title,
            description: seo.description,
            url: `${SITE_URL}/markets`,
          },
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Markets', path: '/markets' },
          ]),
        ]}
      />

      <div className="max-w-[1100px] mx-auto px-6 md:px-8">
        <p className="text-[12px] tracking-[0.22em] uppercase text-black/40 mb-4">Markets</p>
        <h1 className="display-xl mb-6">Where GraphixEye works</h1>
        <p className="text-[17px] leading-relaxed text-black/65 mb-4 max-w-2xl">
          A global production firm with factory HQ in Dammam — supporting sales teams and clients in the United States
          (including Chicago), the United Kingdom, the UAE, Saudi Arabia, Europe, Asia, Africa, Canada, and Australia.
        </p>
        <p className="text-[15px] leading-relaxed text-black/50 mb-14 max-w-2xl">
          Pick a market for local context, services, and how to brief us. {site.tagline}.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {markets.map((m) => (
            <Link
              key={m.slug}
              to={`/markets/${m.slug}`}
              className="block border border-ll-stroke card-r p-6 hover:border-ll-highlight transition-colors"
            >
              <p className="text-[11px] tracking-[0.18em] uppercase text-black/40 mb-2">{m.eyebrow}</p>
              <h2 className="font-display text-2xl mb-3">{m.name}</h2>
              <p className="text-[14px] leading-relaxed text-black/55 line-clamp-3">{m.summary}</p>
            </Link>
          ))}
        </div>

        <div className="bg-ll-sand card-r p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="display-md mb-2">Brief us from anywhere</h2>
            <p className="text-[15px] text-black/55 max-w-md">
              Tell us the city, the site, and the finish. We respond with materials, quantities, and a timeline.
            </p>
          </div>
          <Link
            to="/contact"
            className="self-start pill bg-black text-ll-white h-[52px] px-8 text-[14px] inline-flex items-center hover:bg-ll-highlight transition-colors"
          >
            Get a Free Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
