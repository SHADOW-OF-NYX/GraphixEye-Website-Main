import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Placeholder } from '../components/ui';
import { photos } from '../data/images';
import { bannerCropSlugs, workFilters, works, type WorkCategory } from '../data/works';

const CARD_GAP = 28;
const SPEED = 0.42;
const MAX_ROTATE = 38;
const MAX_Z = 140;

export default function Showcase() {
  const [filter, setFilter] = useState<(typeof workFilters)[number]>('All Projects');
  const [paused, setPaused] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(0);
  const velocityRef = useRef(0);
  const lastPointerX = useRef(0);
  const lastPointerT = useRef(0);

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
    pausedRef.current = paused || draggingRef.current;
  }, [paused]);

  useEffect(() => {
    offsetRef.current = 0;
    const track = trackRef.current;
    if (track) {
      track.style.transform = 'translate3d(0px, 0, 0)';
      applyPerspective();
    }
  }, [filter]);

  const wrapOffset = (track: HTMLDivElement) => {
    const loopWidth = track.scrollWidth / copies;
    if (loopWidth <= 0) return;
    while (offsetRef.current <= -loopWidth) offsetRef.current += loopWidth;
    while (offsetRef.current > 0) offsetRef.current -= loopWidth;
  };

  const applyPerspective = () => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;

    const stageRect = stage.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    const centerX = stageRect.left + stageRect.width / 2;
    const cards = track.querySelectorAll('[data-flash-card]') as NodeListOf<HTMLElement>;

    cards.forEach((card) => {
      const cardCenter = trackRect.left + card.offsetLeft + card.offsetWidth / 2;
      const delta = (cardCenter - centerX) / Math.max(card.offsetWidth, 1);
      const rotateY = Math.max(-MAX_ROTATE, Math.min(MAX_ROTATE, -delta * 22));
      const abs = Math.min(Math.abs(delta), 2.4);
      const translateZ = MAX_Z * (1 - abs / 2.4);
      const scale = 0.86 + 0.14 * (1 - abs / 2.4);
      const opacity = 0.42 + 0.58 * (1 - Math.min(abs, 1.6) / 1.6);

      card.style.transform = `translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.opacity = String(opacity);

      const label = card.querySelector('[data-hall-label]') as HTMLElement | null;
      if (label) {
        label.style.opacity = String(0.35 + 0.65 * (1 - Math.min(abs, 1.2) / 1.2));
      }

      const mirror = card.querySelector('[data-hall-mirror]') as HTMLElement | null;
      if (mirror) {
        mirror.style.opacity = String(opacity * 0.5);
      }
    });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !filtered.length) return;

    let frame = 0;
    const tick = () => {
      if (!pausedRef.current) {
        offsetRef.current -= SPEED;
        if (Math.abs(velocityRef.current) > 0.05) {
          offsetRef.current += velocityRef.current;
          velocityRef.current *= 0.94;
        }
        wrapOffset(track);
        track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
        applyPerspective();
      } else if (draggingRef.current) {
        applyPerspective();
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [filtered, looped, copies]);

  const step = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('[data-flash-card]') as HTMLElement | null;
    const width = (card?.offsetWidth ?? 280) + CARD_GAP;
    offsetRef.current += direction * width;
    wrapOffset(track);
    track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    applyPerspective();
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    draggingRef.current = true;
    pausedRef.current = true;
    velocityRef.current = 0;
    dragStartX.current = e.clientX;
    dragStartOffset.current = offsetRef.current;
    lastPointerX.current = e.clientX;
    lastPointerT.current = performance.now();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const track = trackRef.current;
    if (!track) return;
    const dx = e.clientX - dragStartX.current;
    offsetRef.current = dragStartOffset.current + dx;
    wrapOffset(track);
    track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;

    const now = performance.now();
    const dt = Math.max(now - lastPointerT.current, 1);
    velocityRef.current = ((e.clientX - lastPointerX.current) / dt) * 16;
    lastPointerX.current = e.clientX;
    lastPointerT.current = now;
    applyPerspective();
  };

  const onPointerUp = () => {
    draggingRef.current = false;
    pausedRef.current = paused;
  };

  return (
    <div className="bg-ll-white min-h-screen pt-28 pb-24">
      <section className="px-4 md:px-8 mb-16">
        <Placeholder src={photos.showcaseHero} label="Selected Works — hero" className="w-full h-[70vh] card-r" />
      </section>

      <section className="max-w-[1600px] mx-auto px-6 md:px-8 mb-10 flex flex-col md:flex-row justify-between items-end gap-8">
        <h1 className="display-md">Services</h1>
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

      <section className="mirror-hall mx-4 md:mx-8 card-r overflow-hidden">
        <div className="mirror-hall-ambient" aria-hidden="true" />
        <div className="relative z-10 px-6 md:px-10 pt-10 pb-4 flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] tracking-[0.22em] uppercase text-white/40 mb-2">Production house</p>
            <h2 className="font-display text-[28px] md:text-[36px] text-white tracking-tight">Walk the floor</h2>
          </div>
          <p className="hidden md:block max-w-xs text-[13px] leading-relaxed text-white/45 text-right">
            Drag through the hall. Each service catches the light — and its reflection — as it passes center.
          </p>
        </div>

        {looped.length ? (
          <div
            ref={stageRef}
            className="mirror-hall-stage relative select-none cursor-grab active:cursor-grabbing touch-pan-y"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div className="mirror-hall-perspective">
              <div ref={trackRef} className="mirror-hall-track flex gap-7 px-8 md:px-16 will-change-transform">
                {looped.map((work) => (
                  <Link
                    key={work.loopKey}
                    to={`/services/${work.slug}`}
                    data-flash-card
                    data-nav-tone="dark"
                    className="mirror-hall-card group relative shrink-0 w-[200px] sm:w-[240px] md:w-[280px]"
                    onClick={(e) => {
                      if (Math.abs(velocityRef.current) > 0.8) e.preventDefault();
                    }}
                    draggable={false}
                  >
                    <p
                      data-hall-label
                      className="mb-3 text-center text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-white/55 truncate px-1"
                    >
                      {work.title}
                    </p>
                    <div className="relative">
                      <div className="mirror-hall-panel relative h-[300px] sm:h-[340px] md:h-[400px] overflow-hidden">
                        <Placeholder
                          src={work.image}
                          label={work.title}
                          eager
                          className="w-full h-full"
                          imgClassName={bannerCropSlugs.has(work.slug) ? 'object-[24%_center]' : ''}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                        <div className="absolute bottom-5 left-5 right-5 text-ll-white">
                          <p className="text-[10px] tracking-widest uppercase opacity-60 mb-1">{work.category}</p>
                          <p className="font-display text-[18px] md:text-[20px] leading-tight">{work.title}</p>
                          <p className="text-[12px] text-white/60 mt-1">{work.location}</p>
                        </div>
                        <div className="mirror-hall-rim" aria-hidden="true" />
                      </div>
                      <div data-hall-mirror className="mirror-hall-reflection pointer-events-none" aria-hidden="true">
                        <div className="relative h-[300px] sm:h-[340px] md:h-[400px] overflow-hidden rounded-[1.15rem]">
                          <Placeholder
                            src={work.image}
                            label=""
                            eager
                            className="w-full h-full"
                            imgClassName={bannerCropSlugs.has(work.slug) ? 'object-[24%_center]' : ''}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="mirror-hall-floor" aria-hidden="true" />
          </div>
        ) : (
          <p className="px-8 py-20 text-white/50">No works found for this filter.</p>
        )}

        <div className="relative z-10 mt-2 mb-10 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => step(1)}
            className="w-12 h-12 rounded-full border border-white/25 text-white/80 inline-flex items-center justify-center hover:bg-white hover:text-black transition-colors"
            aria-label="Previous work"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => step(-1)}
            className="w-12 h-12 rounded-full border border-white/25 text-white/80 inline-flex items-center justify-center hover:bg-white hover:text-black transition-colors"
            aria-label="Next work"
          >
            →
          </button>
        </div>
      </section>
    </div>
  );
}
