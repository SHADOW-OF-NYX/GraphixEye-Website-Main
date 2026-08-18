import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Placeholder } from '../components/ui';
import { photos } from '../data/images';
import { bannerCropSlugs, workFilters, works, type WorkCategory } from '../data/works';

const CARD_GAP = 24;
const SPEED = 0.55;

export default function Showcase() {
  const [filter, setFilter] = useState<(typeof workFilters)[number]>('All Projects');
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);

  const filtered = useMemo(() => {
    if (filter === 'All Projects') return works;
    return works.filter((work) => work.category === (filter as WorkCategory));
  }, [filter]);

  const copies = filtered.length > 0 && filtered.length < 8 ? 4 : 2;
  const looped = useMemo(() => {
    if (!filtered.length) return [];
    return Array.from({ length: copies }, (_, copy) =>
      filtered.map((work) => ({ ...work, loopKey: `${work.slug}-${copy}` })),
    ).flat();
  }, [filtered, copies]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    offsetRef.current = 0;
    const track = trackRef.current;
    if (track) track.style.transform = 'translateX(0px)';
  }, [filter]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !filtered.length) return;

    let frame = 0;
    const tick = () => {
      if (!pausedRef.current) {
        offsetRef.current -= SPEED;
        const loopWidth = track.scrollWidth / copies;
        if (loopWidth > 0 && Math.abs(offsetRef.current) >= loopWidth) {
          offsetRef.current += loopWidth;
        }
        track.style.transform = `translateX(${offsetRef.current}px)`;
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [filtered, looped]);

  const step = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('[data-flash-card]');
    const width = (card?.offsetWidth ?? 280) + CARD_GAP;
    offsetRef.current += direction * width;
    const loopWidth = track.scrollWidth / copies;
    if (loopWidth > 0) {
      while (offsetRef.current <= -loopWidth) offsetRef.current += loopWidth;
      while (offsetRef.current > 0) offsetRef.current -= loopWidth;
    }
    track.style.transform = `translateX(${offsetRef.current}px)`;
  };

  return (
    <div className="bg-ll-white min-h-screen pt-28 pb-24">
      <section className="px-4 md:px-8 mb-16">
        <Placeholder src={photos.showcaseHero} label="Selected Works — hero" className="w-full h-[70vh] card-r" />
      </section>

      <section className="max-w-[1600px] mx-auto px-6 md:px-8 mb-10 flex flex-col md:flex-row justify-between items-end gap-8">
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

      <section className="overflow-hidden">
        {looped.length ? (
          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div ref={trackRef} className="flex gap-6 px-6 md:px-8 will-change-transform">
              {looped.map((work) => (
                <article
                  key={work.loopKey}
                  data-flash-card
                  data-nav-tone="dark"
                  className="relative shrink-0 w-[240px] sm:w-[280px] md:w-[320px] h-[360px] md:h-[440px] card-r overflow-hidden bg-ll-sand shadow-[0_18px_40px_rgba(0,0,0,0.12)]"
                >
                  <Placeholder
                    src={work.image}
                    label={work.title}
                    eager
                    className="w-full h-full"
                    imgClassName={bannerCropSlugs.has(work.slug) ? 'object-[24%_center]' : ''}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-ll-white">
                    <p className="text-[11px] tracking-widest uppercase opacity-70 mb-2">{work.category}</p>
                    <h2 className="font-display text-[22px] md:text-[26px] leading-tight mb-1">{work.title}</h2>
                    <p className="text-[13px] text-ll-white/75">{work.location}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <p className="px-8 text-black/50">No works found for this filter.</p>
        )}

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => step(1)}
            className="pill border border-black w-12 h-12 inline-flex items-center justify-center hover:bg-black hover:text-ll-white transition-colors"
            aria-label="Previous work"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => step(-1)}
            className="pill border border-black w-12 h-12 inline-flex items-center justify-center hover:bg-black hover:text-ll-white transition-colors"
            aria-label="Next work"
          >
            →
          </button>
        </div>
      </section>
    </div>
  );
}
