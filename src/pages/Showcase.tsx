import React, { useEffect, useMemo, useState } from 'react';
import { Placeholder } from '../components/ui';
import { photos } from '../data/images';
import { workFilters, works, type WorkCategory } from '../data/works';

export default function Showcase() {
  const [filter, setFilter] = useState<(typeof workFilters)[number]>('All Projects');
  const [slide, setSlide] = useState(0);

  const filtered = useMemo(() => {
    if (filter === 'All Projects') return works;
    return works.filter((work) => work.category === (filter as WorkCategory));
  }, [filter]);

  useEffect(() => {
    setSlide(0);
  }, [filter]);

  useEffect(() => {
    if (!filtered.length) return;
    const timer = window.setInterval(() => {
      setSlide((s) => (s + 1) % filtered.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [filtered]);

  const active = filtered[slide];

  const onPrev = () => {
    if (!filtered.length) return;
    setSlide((s) => (s === 0 ? filtered.length - 1 : s - 1));
  };

  const onNext = () => {
    if (!filtered.length) return;
    setSlide((s) => (s + 1) % filtered.length);
  };

  return (
    <div className="bg-ll-white min-h-screen pt-28 pb-24">
      <section className="px-4 md:px-8 mb-16">
        <Placeholder src={photos.showcaseHero} label="Selected Works — hero" className="w-full h-[70vh] card-r" />
      </section>

      <section className="max-w-[1600px] mx-auto px-6 md:px-8 mb-14 flex flex-col md:flex-row justify-between items-end gap-8">
        <h1 className="display-md">Selected Works</h1>
        <div className="flex flex-wrap gap-2">
          {workFilters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`h-10 px-4 pill text-[13px] transition-colors ${
                filter === item ? 'bg-black text-ll-white' : 'bg-ll-sand text-black hover:bg-black/10'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-6 md:px-8">
        {active ? (
          <>
            <article
              key={active.slug}
              data-nav-tone="dark"
              className="relative card-r overflow-hidden min-h-[460px] md:min-h-[560px] group"
            >
              <Placeholder src={active.image} label={active.title} className="w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-85 transition-opacity" />
              <div className="absolute bottom-8 left-8 right-8 text-ll-white">
                <p className="text-[12px] tracking-widest uppercase opacity-70 mb-2">{active.category}</p>
                <h2 className="font-display text-3xl md:text-5xl mb-2">{active.title}</h2>
                <p className="text-[14px] md:text-[16px] text-ll-white/75">{active.location}</p>
              </div>
            </article>

            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onPrev}
                className="pill border border-black w-12 h-12 inline-flex items-center justify-center hover:bg-black hover:text-ll-white transition-colors"
                aria-label="Previous work"
              >
                ←
              </button>
              <button
                type="button"
                onClick={onNext}
                className="pill border border-black w-12 h-12 inline-flex items-center justify-center hover:bg-black hover:text-ll-white transition-colors"
                aria-label="Next work"
              >
                →
              </button>
            </div>
          </>
        ) : (
          <p className="text-black/50">No works found for this filter.</p>
        )}
        <div className="mt-5 text-center text-[12px] text-black/40">
          {filtered.length > 0 ? `${slide + 1} / ${filtered.length}` : ''}
        </div>
      </section>
    </div>
  );
}
