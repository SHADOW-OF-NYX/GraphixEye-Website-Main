import React, { Suspense, lazy, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { breadcrumbJsonLd, SITE_URL } from '../data/seo';
import { markets, marketsIndexSeo } from '../data/markets';
import { marketForPin, MARKET_COLORS, type GlobePin } from '../data/globePins';
import { site } from '../data/site';

const MarketsGlobe = lazy(() => import('../components/markets/MarketsGlobe'));

export default function Markets() {
  const seo = marketsIndexSeo();
  const [selected, setSelected] = useState<GlobePin | null>(null);
  const market = useMemo(() => (selected ? marketForPin(selected) : null), [selected]);

  return (
    <div className="markets-page bg-[#07060c] text-ll-white min-h-app-screen" data-nav-tone="dark">
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

      <div className="markets-stage relative h-app-screen w-full overflow-hidden">
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center text-[13px] tracking-[0.2em] uppercase text-white/40">
              Loading globe…
            </div>
          }
        >
          <MarketsGlobe
            className="absolute inset-0 z-0"
            selectedId={selected?.id ?? null}
            onSelect={setSelected}
          />
        </Suspense>

        {/* Intro chrome — fades when a pin is open */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 z-10 px-6 md:px-10 pt-[max(5.5rem,env(safe-area-inset-top)+4.5rem)] transition-opacity duration-500 ${
            selected ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <p className="text-[11px] tracking-[0.22em] uppercase text-white/45 mb-3">Markets</p>
          <h1 className="font-display text-[clamp(1.75rem,4vw,3rem)] max-w-xl leading-tight">
            Where we can take your project
          </h1>
          <p className="mt-3 text-[14px] md:text-[15px] text-white/55 max-w-md leading-relaxed">
            Glowing pins mark cities we serve. Click one to zoom in — each colour is a market region.
          </p>
        </div>

        {/* Legend */}
        <div
          className={`pointer-events-none absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-6 md:left-10 z-10 flex flex-wrap gap-x-4 gap-y-2 max-w-[min(100%,28rem)] transition-opacity duration-500 ${
            selected ? 'opacity-0 md:opacity-40' : 'opacity-100'
          }`}
        >
          {markets.map((m) => (
            <span key={m.slug} className="inline-flex items-center gap-2 text-[11px] text-white/55">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: MARKET_COLORS[m.slug], boxShadow: `0 0 8px ${MARKET_COLORS[m.slug]}` }}
              />
              {m.name}
            </span>
          ))}
        </div>

        {/* Detail panel */}
        <aside
          className={`markets-panel absolute z-20 top-0 right-0 h-full w-full md:w-[min(42vw,28rem)] flex flex-col justify-center px-6 md:px-10 py-[max(5rem,env(safe-area-inset-top)+3rem)] pb-[max(2rem,env(safe-area-inset-bottom)+1.5rem)] transition-all duration-500 ease-out ${
            selected
              ? 'opacity-100 translate-x-0 pointer-events-auto'
              : 'opacity-0 translate-x-8 md:translate-x-12 pointer-events-none'
          }`}
          aria-hidden={!selected}
        >
          {selected && market ? (
            <div className="markets-panel__card relative max-h-full overflow-y-auto">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute top-0 right-0 text-[12px] tracking-[0.16em] uppercase text-white/50 hover:text-white transition-colors"
              >
                Close
              </button>
              <p className="text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: selected.color }}>
                {market.eyebrow}
              </p>
              <h2 className="font-display text-[clamp(1.6rem,3vw,2.35rem)] leading-tight mb-2">{selected.label}</h2>
              <p className="text-[13px] text-white/45 mb-5">{market.name}</p>
              <p className="text-[15px] leading-relaxed text-white/70 mb-6">{market.summary}</p>
              <ul className="space-y-2 mb-8">
                {market.servicesFocus.slice(0, 5).map((s) => (
                  <li key={s} className="text-[13px] text-white/55 border-b border-white/10 pb-2">
                    {s}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/markets/${market.slug}`}
                  className="pill h-11 px-6 inline-flex items-center text-[13px] bg-ll-white text-black hover:bg-ll-highlight transition-colors"
                >
                  Open {market.name}
                </Link>
                <Link
                  to="/contact"
                  className="pill h-11 px-6 inline-flex items-center text-[13px] border border-white/25 text-ll-white hover:border-white/60 transition-colors"
                >
                  Get a quote
                </Link>
              </div>
              <p className="mt-6 text-[12px] text-white/35">
                Factory HQ in Dammam · {site.tagline}
              </p>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
