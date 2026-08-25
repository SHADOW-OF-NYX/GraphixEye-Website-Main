import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Placeholder } from '../components/ui';
import { bannerCropSlugs, workFilters, works, type WorkCategory } from '../data/works';

const CARD_GAP = 24;
const SPEED = 0.38;
const MAX_ROTATE = 38;
const MAX_Z = 160;

export default function Showcase() {
  const [filter, setFilter] = useState<(typeof workFilters)[number]>('All Projects');
  const [paused, setPaused] = useState(false);
  const [activeTitle, setActiveTitle] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
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

    let closestDelta = Infinity;
    let closestIdx = 0;

    cards.forEach((card, i) => {
      const cardCenter = trackRect.left + card.offsetLeft + card.offsetWidth / 2;
      const delta = (cardCenter - centerX) / Math.max(card.offsetWidth, 1);
      const rotateY = Math.max(-MAX_ROTATE, Math.min(MAX_ROTATE, -delta * 22));
      const abs = Math.min(Math.abs(delta), 2.4);
      const translateZ = MAX_Z * (1 - abs / 2.4);
      const scale = 0.84 + 0.16 * (1 - abs / 2.4);
      const opacity = 0.38 + 0.62 * (1 - Math.min(abs, 1.8) / 1.8);

      card.style.transform = `translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.opacity = String(opacity);

      const mirror = card.querySelector('[data-hall-mirror]') as HTMLElement | null;
      if (mirror) {
        mirror.style.opacity = String(opacity * 0.55);
      }

      if (Math.abs(delta) < closestDelta) {
        closestDelta = Math.abs(delta);
        closestIdx = i;
      }
    });

    // Map closestIdx back to filtered (not looped) index
    if (filtered.length > 0) {
      const trueIdx = closestIdx % filtered.length;
      setActiveIndex(trueIdx);
      setActiveTitle(filtered[trueIdx]?.title ?? '');
    }
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

  const dotCount = Math.min(filtered.length, 10);
  const dotActive = activeIndex % dotCount;

  return (
    <div className="mh-page">
      {/* Filter bar */}
      <div className="mh-filter-bar">
        {workFilters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`mh-filter-pill ${filter === item ? 'mh-filter-pill--active' : ''}`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Mirror Hall section */}
      <section className="mirror-hall mx-4 md:mx-8 card-r overflow-hidden">
        <div className="mirror-hall-ambient" aria-hidden="true" />

        {/* Header */}
        <div className="mh-header">
          <p className="mh-eyebrow">GraphixEye · Services</p>
          <h1 className="mh-title">Mirror Hall</h1>
          <p className="mh-subtitle">Every service, framed and reflected.</p>
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
              <div ref={trackRef} className="mirror-hall-track flex gap-6 px-8 md:px-16 will-change-transform">
                {looped.map((work) => (
                  <Link
                    key={work.loopKey}
                    to={`/services/${work.slug}`}
                    data-flash-card
                    data-nav-tone="dark"
                    className="mirror-hall-card group relative shrink-0 w-[160px] sm:w-[200px] md:w-[240px]"
                    onClick={(e) => {
                      if (Math.abs(velocityRef.current) > 0.8) e.preventDefault();
                    }}
                    draggable={false}
                  >
                    {/* Label above card */}
                    <p className="mh-card-label">{work.title}</p>

                    <div className="relative">
                      <div className="mirror-hall-panel relative h-[280px] sm:h-[340px] md:h-[400px] overflow-hidden">
                        <Placeholder
                          src={work.image}
                          label={work.title}
                          eager
                          className="w-full h-full"
                          imgClassName={bannerCropSlugs.has(work.slug) ? 'object-[24%_center]' : ''}
                        />
                        <div className="mirror-hall-rim" aria-hidden="true" />
                      </div>
                      <div data-hall-mirror className="mirror-hall-reflection pointer-events-none" aria-hidden="true">
                        <div className="relative h-[280px] sm:h-[340px] md:h-[400px] overflow-hidden rounded-[1.15rem]">
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

        {/* Active name + counter + dots */}
        <div className="mh-footer">
          <div className="mh-counter">
            <span className="mh-counter-num">{String(activeIndex + 1).padStart(2, '0')}</span>
            <span className="mh-counter-sep"> / </span>
            <span className="mh-counter-total">{String(filtered.length).padStart(2, '0')}</span>
          </div>
          <p className="mh-active-name">{activeTitle}</p>
          <div className="mh-dots" aria-hidden="true">
            {Array.from({ length: dotCount }).map((_, i) => (
              <span key={i} className={`mh-dot ${i === dotActive ? 'mh-dot--active' : ''}`} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
