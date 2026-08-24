import React, { useLayoutEffect, useRef } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Placeholder } from '../components/ui';
import {
  bannerCropSlugs,
  getCategoryForWork,
  getWorkBySlug,
} from '../data/works';

gsap.registerPlugin(ScrollTrigger);

export default function ServiceDetail() {
  const { slug = '' } = useParams();
  const work = getWorkBySlug(slug);
  const meta = work ? getCategoryForWork(work) : undefined;
  const projects = work?.projects ?? [];
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!work || !meta) return;
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 28, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.95, ease: 'power3.out' },
        );
      }
      gridRef.current?.querySelectorAll('[data-project]').forEach((node, i) => {
        const el = node as HTMLElement;
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          delay: 0.05 * i,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        });
      });
    });
    return () => ctx.revert();
  }, [work, meta, slug]);

  if (!work || !meta) return <Navigate to="/services" replace />;

  return (
    <div className="bg-ll-white min-h-screen pt-28 pb-28">
      <section className="px-4 md:px-8 mb-12">
        <div className="relative card-r overflow-hidden min-h-[70vh] bg-black" data-nav-tone="dark">
          <Placeholder
            src={work.image}
            label={work.title}
            eager
            className="absolute inset-0"
            imgClassName={bannerCropSlugs.has(work.slug) ? 'object-[24%_center]' : ''}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
          <div
            className={`work-glow-pulse pointer-events-none absolute -bottom-24 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-gradient-to-br ${meta.glow} opacity-60 blur-3xl`}
          />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14 text-ll-white">
            <Link to="/services" className="mb-8 text-[13px] text-ll-white/70 hover:text-ll-white transition-colors w-fit">
              ← Services
            </Link>
            <p className="text-[12px] tracking-[0.22em] uppercase text-ll-white/65 mb-3">{work.category}</p>
            <h1 ref={titleRef} className="display-xl max-w-4xl">
              <span className={`bg-gradient-to-r ${meta.glow} bg-clip-text text-transparent`}>{work.title}</span>
            </h1>
            <p className="mt-4 text-[15px] text-ll-white/75 max-w-xl">{work.location}</p>
          </div>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-6 md:px-12 mb-14">
        <p className="text-[13px] tracking-[0.22em] uppercase text-black/40 mb-4">{work.title}</p>
        <h2 className="display-md max-w-3xl mb-4">{work.title} works</h2>
        <p className="max-w-2xl text-[16px] leading-relaxed text-black/50">{work.summary}</p>
        <p className="mt-4 text-[13px] text-black/35">
          {projects.length} {projects.length === 1 ? 'project' : 'projects'} in this service
        </p>
      </section>

      <section ref={gridRef} className="max-w-[1600px] mx-auto px-6 md:px-12">
        {projects.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {projects.map((project, i) => (
              <article
                key={project.id}
                data-project
                data-nav-tone="dark"
                className={`relative card-r overflow-hidden min-h-[360px] md:min-h-[420px] group ${
                  i % 3 === 0 ? 'md:min-h-[480px]' : ''
                }`}
              >
                <Placeholder
                  src={project.image}
                  label={project.title}
                  className="absolute inset-0"
                  imgClassName={bannerCropSlugs.has(work.slug) ? 'object-[24%_center]' : ''}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-8 left-8 right-8 text-ll-white">
                  <p className="text-[11px] tracking-widest uppercase opacity-70 mb-2">{work.title}</p>
                  <h3 className="font-display text-3xl mb-1">{project.title}</h3>
                  <p className="text-[14px] text-ll-white/70">{project.location}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="card-r bg-ll-sand p-10 md:p-14">
            <p className="font-display text-[28px] mb-3">Works coming soon</p>
            <p className="text-[15px] text-black/50 max-w-xl">
              This dedicated {work.title} page is ready. Add portfolio pieces to the{' '}
              <code className="text-[13px]">projects</code> array for <code className="text-[13px]">{work.slug}</code> in{' '}
              <code className="text-[13px]">src/data/works.ts</code>.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
