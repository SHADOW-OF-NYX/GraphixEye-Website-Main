import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import { breadcrumbJsonLd, SITE_URL } from '../data/seo';
import { getMarket, marketPageSeo } from '../data/markets';
import { site } from '../data/site';

export default function MarketDetail() {
  const { slug = '' } = useParams();
  const market = getMarket(slug);
  if (!market) return <Navigate to="/markets" replace />;

  const seo = marketPageSeo(market);

  return (
    <div className="bg-ll-white min-h-screen pt-28 sm:pt-36 pb-28">
      <Seo
        page={seo}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: market.h1,
            description: market.summary,
            url: `${SITE_URL}/markets/${market.slug}`,
            about: {
              '@type': 'Place',
              name: market.name,
            },
            provider: { '@id': `${SITE_URL}/#business` },
          },
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Markets', path: '/markets' },
            { name: market.name, path: `/markets/${market.slug}` },
          ]),
        ]}
      />

      <div className="max-w-[900px] mx-auto px-6 md:px-8">
        <p className="text-[12px] tracking-[0.22em] uppercase text-black/40 mb-4">{market.eyebrow}</p>
        <h1 className="display-xl mb-6">{market.h1}</h1>
        <p className="text-[17px] leading-relaxed text-black/65 mb-10">{market.summary}</p>

        {market.body.map((para) => (
          <p key={para.slice(0, 48)} className="text-[16px] leading-relaxed text-black/55 mb-6">
            {para}
          </p>
        ))}

        <h2 className="display-md mt-12 mb-4">Services for {market.name}</h2>
        <ul className="grid sm:grid-cols-2 gap-2 mb-12">
          {market.servicesFocus.map((s) => (
            <li key={s} className="border-b border-ll-stroke py-3 text-[15px] text-black/70">
              {s}
            </li>
          ))}
        </ul>

        <h2 className="display-md mb-4">Cities & hubs</h2>
        <p className="text-[15px] leading-relaxed text-black/55 mb-4">
          Teams brief us from these hubs and beyond — production is coordinated from our Dammam factory HQ.
        </p>
        <p className="text-[14px] leading-relaxed text-black/50 mb-12">{market.cities.join(' · ')}</p>

        <div className="flex flex-wrap gap-3 mb-14">
          <Link
            to="/services/printing"
            className="pill border border-ll-stroke h-11 px-5 text-[13px] inline-flex items-center hover:border-ll-highlight transition-colors"
          >
            Printing
          </Link>
          <Link
            to="/services/signage"
            className="pill border border-ll-stroke h-11 px-5 text-[13px] inline-flex items-center hover:border-ll-highlight transition-colors"
          >
            Signage
          </Link>
          <Link
            to="/services/packaging"
            className="pill border border-ll-stroke h-11 px-5 text-[13px] inline-flex items-center hover:border-ll-highlight transition-colors"
          >
            Packaging
          </Link>
          <Link
            to="/markets"
            className="pill border border-ll-stroke h-11 px-5 text-[13px] inline-flex items-center hover:border-ll-highlight transition-colors"
          >
            All markets
          </Link>
        </div>

        <div className="bg-ll-sand card-r p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="display-md mb-2">Work with GraphixEye in {market.name}</h2>
            <p className="text-[15px] text-black/55 max-w-md">
              Call {site.phone} or send a brief — we aim to respond within 24 hours.
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
