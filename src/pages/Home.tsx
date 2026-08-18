import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroVideo, Placeholder } from '../components/ui';
import { heroVideo, photos } from '../data/images';
import {
  clients,
  faqs,
  heroPoints,
  industries,
  journey,
  operatorPoints,
  serviceTabs,
  sessionSteps,
  site,
  standAlone,
  studioFeatures,
  studioSpecs,
} from '../data/site';
import { horizontalScrollWorks } from '../data/works';
import ReviewSection from '../components/ReviewSection';

gsap.registerPlugin(ScrollTrigger);

const washes = ['bg-ll-br1', 'bg-ll-br6', 'bg-ll-br3', 'bg-ll-br4', 'bg-ll-br5'];

export default function Home() {
  const heroWrap = useRef<HTMLDivElement>(null);
  const heroFrame = useRef<HTMLDivElement>(null);
  const heroDim = useRef<HTMLDivElement>(null);
  const heroTitle = useRef<HTMLHeadingElement>(null);
  const introCopy = useRef<HTMLDivElement>(null);
  const horizWrap = useRef<HTMLDivElement>(null);
  const horizTrack = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState(0);
  const [faqGroup, setFaqGroup] = useState<'client' | 'partner'>('client');

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (heroWrap.current && heroFrame.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroWrap.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.65,
          },
        });

        tl.fromTo(
          heroFrame.current,
          { top: 0, left: 0, right: 0, bottom: 0, borderRadius: 0 },
          { top: 28, left: 28, right: 28, bottom: 28, borderRadius: 40, duration: 1, ease: 'none' },
          0,
        );
        tl.fromTo(heroDim.current, { opacity: 0.12 }, { opacity: 0.4, duration: 0.4, ease: 'none' }, 0.12);
        tl.fromTo(heroTitle.current, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.32, ease: 'none' }, 0.18);
        tl.to(heroTitle.current, { opacity: 0.16, duration: 0.38, ease: 'none' }, 0.58);
        tl.to(heroDim.current, { opacity: 0.58, duration: 0.38, ease: 'none' }, 0.58);
        tl.fromTo(introCopy.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4, ease: 'none' }, 0.58);
      }

      if (horizWrap.current && horizTrack.current) {
        const getDistance = () => Math.max(0, horizTrack.current!.scrollWidth - window.innerWidth + 80);
        gsap.to(horizTrack.current, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: horizWrap.current,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 86%' },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const faqItems = faqs[faqGroup];
  const featured = horizontalScrollWorks;

  return (
    <div className="bg-ll-white text-black">
      {/* HERO */}
      <section ref={heroWrap} className="relative h-[280vh] bg-ll-white">
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center bg-ll-white">
          <div ref={heroFrame} data-nav-tone="dark" className="absolute inset-0 overflow-hidden will-change-transform bg-black">
            <HeroVideo src={heroVideo} poster={photos.hero} />
            <div ref={heroDim} className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: 0.12 }} />
          </div>

          <h1 ref={heroTitle} className="hero-title relative z-[5] text-ll-white text-center px-6 opacity-0 pointer-events-none">
            GraphixEye
          </h1>

          <div ref={introCopy} className="absolute bottom-16 right-6 md:right-16 z-20 max-w-md text-ll-white opacity-0 drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)]">
            <p className="display-md mb-6">
              A premium branding system your clients can self-start and your team can scale.
            </p>
            <p className="text-[14px] leading-relaxed text-ll-white/80 mb-6">
              GraphixEye is a connected full-spectrum production platform combining design, fabrication, and program
              logic — built on a patented promise: {site.tagline}. Price on request.
            </p>
            <ul className="space-y-2 text-[13px] text-ll-white/75">
              {heroPoints.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* DEVICE / STUDIO */}
      <section className="px-4 md:px-8 py-10 md:py-16">
        <div data-nav-tone="dark" className="card-r glow-wash overflow-hidden min-h-[78vh] relative text-ll-white">
          <Placeholder src={photos.studio} label="The Studio — production floor" className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <div className="relative z-10 flex flex-col justify-between min-h-[78vh] p-8 md:p-12">
            <div className="flex justify-between items-start gap-8">
              <h2 className="display-md max-w-sm">The Studio</h2>
              <p className="max-w-sm text-[14px] leading-relaxed text-ll-white/85">
                Premium full-body brand production built for continuous professional use. GraphixEye brings{' '}
                {site.parent}, est. {site.established} in Dammam, together with industrial-scale finishing.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
              {studioFeatures.map((f) => (
                <div key={f.title}>
                  <LogoDots />
                  <p className="mt-4 text-[14px] leading-relaxed text-ll-white/90">
                    <span className="text-ll-white">{f.title}. </span>
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-10 md:gap-16 mt-10 px-2" data-reveal>
          {studioSpecs.map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl">{s.value}</p>
              <p className="text-[13px] text-black/50 mt-1">{s.label}</p>
            </div>
          ))}
          <p className="text-[13px] text-black/40 self-end">Final specs are site-dependent and confirmed during planning</p>
        </div>
      </section>

      {/* MORE THAN PRINT + HORIZONTAL CARDS */}
      <section className="px-6 md:px-12 pt-20 pb-8" data-reveal>
        <h2 className="display-md max-w-3xl">
          AI, AR, VR & MR.{' '}
          <span className="text-black/40">Immersive services alongside integrated design and production</span>
        </h2>
      </section>

      <section ref={horizWrap} className="horiz-pin h-screen">
        <div className="h-screen flex items-center">
          <div ref={horizTrack} className="flex gap-6 px-8 will-change-transform">
            {featured.map((work, i) => (
              <article
                key={work.slug}
                data-nav-tone="dark"
                className="relative w-[72vw] md:w-[36vw] h-[62vh] card-r overflow-hidden shrink-0 bg-ll-sand group"
              >
                <div className={`absolute inset-x-0 top-0 h-40 opacity-80 ${washes[i % washes.length]} blur-2xl`} />
                <Placeholder src={work.image} label={work.title} className="absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-ll-white">
                  <p className="text-[12px] tracking-widest uppercase opacity-70 mb-2">{work.category}</p>
                  <h3 className="font-display text-3xl">{work.title}</h3>
                  <p className="text-[14px] mt-2 text-ll-white/75">{work.location}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TABS */}
      <section className="px-6 md:px-12 py-24 grid md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div data-reveal>
          <div className="flex gap-2 mb-10">
            {serviceTabs.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(i)}
                className={`h-10 px-5 pill text-[13px] transition-colors ${
                  tab === i ? 'bg-black text-ll-white' : 'bg-ll-sand text-black hover:bg-black/10'
                }`}
              >
                {t.id}
              </button>
            ))}
          </div>
          <h3 className="display-md mb-8">{serviceTabs[tab].title}</h3>
          <ul className="space-y-3 text-[15px] text-black/60">
            {serviceTabs[tab].points.map((p) => (
              <li key={p} className="border-b border-ll-stroke pb-3">
                {p}
              </li>
            ))}
          </ul>
          <Link
            to="/experience"
            className="mt-10 pill border border-black h-[61px] px-8 inline-flex items-center text-[14px] hover:bg-black hover:text-ll-white transition-colors"
          >
            Experience the Master system
          </Link>
        </div>
        <div data-reveal>
          <Placeholder src={photos.tabs[serviceTabs[tab].id as keyof typeof photos.tabs]} label={`Tab — ${serviceTabs[tab].id}`} className="card-r h-[520px]" />
        </div>
      </section>

      {/* BUILT FOR OPERATORS */}
      <section className="px-6 md:px-12 py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16" data-reveal>
          <div className="md:text-right md:ml-auto">
            <h2 className="display-xl">Built for brands</h2>
            <p className="text-black/50 mt-3 text-[18px] font-display">ROI, simplicity, prestige, scalability.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-x-20 gap-y-12 max-w-5xl" data-reveal>
          {operatorPoints.map((p) => (
            <div key={p.title}>
              <p className="text-[16px] mb-2">
                <span className="font-medium">{p.title}</span>{' '}
                <span className="text-black/50">{p.body}</span>
              </p>
            </div>
          ))}
        </div>
        <div className="mt-14 flex justify-end" data-reveal>
          <Link
            to="/contact"
            className="pill bg-black text-ll-white h-[61px] px-8 inline-flex items-center text-[14px] hover:bg-ll-highlight transition-colors"
          >
            Experience the Master system
          </Link>
        </div>
      </section>

      {/* GUIDED FLOW */}
      <section className="px-6 md:px-12 py-20">
        <h2 className="display-md mb-12" data-reveal>
          Clients feel guided. Operators stay relaxed.
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3" data-reveal>
          {sessionSteps.map((step, i) => (
            <div
              key={step}
              className="card-r bg-ll-sand p-6 min-h-[160px] flex flex-col justify-between hover:-translate-y-1 transition-transform duration-500"
            >
              <span className="text-[12px] text-black/40">0{i + 1}</span>
              <p className="font-display text-[18px]">{step}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 grid md:grid-cols-2 gap-10 items-center">
          <Placeholder src={photos.guided} label="Guided session — tablet / brief flow" className="card-r h-[420px]" />
          <div>
            <p className="text-black/50 font-display text-[18px] mb-6">One system — adapted to your location</p>
            <div className="flex flex-wrap gap-2">
              {industries.map((ind) => (
                <span key={ind} className="pill bg-ll-sand px-4 h-10 inline-flex items-center text-[13px]">
                  {ind}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LIVE OPS */}
      <section className="px-6 md:px-12 py-24" data-reveal>
        <h2 className="display-md max-w-4xl mb-6">
          Live in real operations, not just a showroom. Fifteen years across live sites. One production floor.
        </h2>
        <p className="text-black/45 mb-10">Based in Dammam and varying by location.</p>
        <div className="flex gap-10 overflow-hidden">
          <div className="marquee-track flex gap-16 whitespace-nowrap text-[18px] font-display text-black/35">
            {[...clients, ...clients].map((c, i) => (
              <span key={`${c}-${i}`}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* WHY STANDS ALONE */}
      <section className="px-6 md:px-12 py-24">
        <h2 className="display-md mb-12" data-reveal>
          Why GraphixEye stands alone
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {standAlone.map((card, i) => (
            <article
              key={card.title}
              className="card-r bg-ll-sand p-8 md:p-10 min-h-[240px] group hover:bg-black hover:text-ll-white transition-colors duration-500"
              data-reveal
            >
              <div className={`w-full h-1 mb-8 rounded-full ${washes[i]} group-hover:bg-ll-highlight`} />
              <h3 className="font-display text-[22px] mb-3">{card.title}</h3>
              <p className="text-[15px] leading-relaxed text-black/55 group-hover:text-ll-white/70">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* JOURNEY — dark */}
      <section data-nav-tone="dark" className="mx-4 md:mx-8 card-r glow-wash text-ll-white py-20 px-8 md:px-14 mb-8 overflow-hidden relative">
        <Placeholder src={photos.craft} label="Craftsmanship — press / finishing" className="absolute inset-0 opacity-30" />
        <div className="relative z-10">
          <h2 className="display-md mb-3">Bring GraphixEye to your location</h2>
          <p className="text-ll-sand/70 mb-14">From interest to live operation in clear steps</p>
          <div className="grid md:grid-cols-5 gap-8">
            {journey.map((step, i) => (
              <div key={step.title}>
                <p className="text-[12px] text-ll-white/40 mb-3">0{i + 1}</p>
                <h3 className="font-display text-[18px] mb-3">{step.title}</h3>
                <p className="text-[13px] leading-relaxed text-ll-white/65">{step.body}</p>
              </div>
            ))}
          </div>
          <Link
            to="/contact"
            className="mt-14 pill bg-ll-white text-black h-[61px] px-8 inline-flex items-center text-[14px] hover:bg-ll-highlight hover:text-ll-white transition-colors"
          >
            {site.cta}
          </Link>
        </div>
      </section>

      <ReviewSection />

      {/* FAQ */}
      <section className="px-6 md:px-12 py-24 grid md:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
        <div className="md:sticky md:top-28">
          <h2 className="display-md mb-8">We’re here to answer all your questions</h2>
          <div className="inline-flex bg-ll-sand p-1 pill">
            {(['client', 'partner'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setFaqGroup(g)}
                className={`h-9 px-5 pill capitalize text-[14px] ${faqGroup === g ? 'bg-black text-ll-white' : ''}`}
              >
                {g === 'client' ? 'Guest' : 'B2B'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {faqItems.map((item) => (
            <details key={item.q} className="faq-item group bg-ll-sand card-r px-6 py-5">
              <summary className="flex items-center justify-between cursor-pointer list-none font-display text-[16px] md:text-[17px]">
                {item.q}
                <span className="faq-plus ml-4 text-xl leading-none transition-transform">+</span>
              </summary>
              <p className="pt-4 text-[14px] leading-relaxed text-black/55 max-w-2xl">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CONTACT STRIP */}
      <section className="px-6 md:px-12 pb-24">
        <div data-nav-tone="dark" className="card-r bg-black text-ll-white p-10 md:p-16 flex flex-col md:flex-row justify-between gap-10">
          <div>
            <h2 className="display-md mb-4">{site.contactHeadline}</h2>
            <p className="text-ll-white/60 max-w-md">
              {site.contactLead}
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-4">
            <p className="font-display text-3xl">{site.phone}</p>
            <p className="text-ll-white/55">{site.email}</p>
            <Link
              to="/contact"
              className="pill bg-ll-white text-black h-[61px] px-8 inline-flex items-center text-[14px] hover:bg-ll-highlight hover:text-ll-white transition-colors"
            >
              {site.cta}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function LogoDots() {
  return (
    <svg viewBox="0 0 20 20" className="w-5 h-5 fill-ll-white" aria-hidden="true">
      <circle cx="6" cy="6" r="2.15" />
      <circle cx="14" cy="6" r="2.15" />
      <circle cx="6" cy="14" r="2.15" />
      <circle cx="14" cy="14" r="2.15" />
    </svg>
  );
}
