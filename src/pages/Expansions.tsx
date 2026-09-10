import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ThreeSceneLoader from '../components/particles/ThreeSceneLoader';
import ServiceShowcase from '../components/particles/ServiceShowcase';
import Seo from '../components/Seo';
import { getPageSeo } from '../data/seo';
import { immersiveServices } from '../lib/particles/services';

gsap.registerPlugin(ScrollTrigger);

const PROCESS = [
  {
    title: 'Brief and feasibility',
    body: 'You tell us the objective, the space, and the date. We say plainly what is achievable in that window and what is not.',
  },
  {
    title: 'Prototype',
    body: 'A working sample of the core idea, a scannable panel, a rough walkthrough, so you are approving something real rather than a description.',
  },
  {
    title: 'Build',
    body: 'Fabrication and content production run together in Dammam, against the same drawings and the same schedule.',
  },
  {
    title: 'Install and support',
    body: 'Our crew installs, tests on site, and stays through the event or the first weeks of a permanent piece.',
  },
];

/**
 * Immersive particle morph page, AI → AR → VR → MR.
 * No solid cream/about slab under the track; canvas stays the stage.
 */
export default function Expansions() {
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    const fade = ScrollTrigger.create({
      trigger: '#morph-track',
      start: 'top top',
      end: '18% top',
      scrub: 1.2,
      onUpdate: (self) => {
        if (!introRef.current) return;
        const t = self.progress;
        const o = 1 - t * t * t * (t * (t * 6 - 15) + 10);
        introRef.current.style.opacity = String(o);
      },
    });

    return () => {
      window.cancelAnimationFrame(id);
      fade.kill();
    };
  }, []);

  return (
    <div className="relative bg-ll-white text-black min-h-screen">
      <Seo page={getPageSeo('/expansions')!} />
      <ThreeSceneLoader />

      {/* Cream wash lifted toward white behind the stage, sand at the edges */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -1,
          background:
            'radial-gradient(ellipse 115% 78% at 50% 26%, #ffffff 0%, #fcf8f1 46%, #f2ece2 100%)',
        }}
        aria-hidden
      />

      <ServiceShowcase />

      <div id="morph-track" className="relative" style={{ height: '620vh', zIndex: 10 }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <div ref={introRef} className="absolute inset-0 pointer-events-none select-none">
            <div className="absolute left-6 md:left-14 top-1/2 -translate-y-1/2 -mt-10 max-w-xl">
              <p className="text-[12px] tracking-widest uppercase text-ll-highlight mb-5">
                Expansions
              </p>
              <h1 className="display-xl text-black">
                Where intent
                <br />
                takes form
              </h1>
              <p className="mt-7 text-[12px] tracking-widest uppercase text-black/40 max-w-xs">
                AI · AR · VR · MR · scroll to explore
              </p>
            </div>
          </div>

          <p
            className="absolute bottom-8 left-1/2 -translate-x-1/2 uppercase text-black/35 tracking-[0.2em] pointer-events-none"
            style={{ fontSize: 10 }}
          >
            Scroll
          </p>
        </div>
      </div>

      {/* Opaque so it closes off the fixed canvas instead of scrolling over the model */}
      <div className="relative z-10 bg-ll-white">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          {/*
            The morph is the hook; everything below is the answer to "so what".
            Without it the page demonstrates capability without ever saying what
            a client would actually buy.
          */}
          <section className="pt-24 pb-16 border-b border-black/10">
            <div className="grid md:grid-cols-12 gap-10 md:gap-8">
              <div className="md:col-span-5">
                <p className="text-[12px] tracking-widest uppercase text-ll-highlight mb-5">
                  Why us for this
                </p>
                <h2 className="display-md text-black">
                  We are not a software
                  <br />
                  studio. That is the point.
                </h2>
              </div>
              <div className="md:col-span-6 md:col-start-7 flex flex-col gap-5">
                <p className="text-black/60 text-[15px] leading-relaxed">
                  Most immersive work fails at the handover, an agency builds the digital piece,
                  someone else fabricates the physical one, and the two meet for the first time on
                  site. We have been printing, fabricating, and installing out of Dammam since 2009,
                  so the structure and the content are made by the same company.
                </p>
                <p className="text-black/60 text-[15px] leading-relaxed">
                  That means one quote, one project manager, one crew on install day, and a digital
                  layer built against the real dimensions of something we are already producing.
                </p>
              </div>
            </div>
          </section>

          <section className="py-20">
            <p className="text-[12px] tracking-widest uppercase text-ll-highlight mb-5">
              What you can actually order
            </p>
            <h2 className="display-md text-black max-w-2xl mb-12">
              Four services, and what each one delivers
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              {immersiveServices.map((service) => (
                <article
                  key={service.id}
                  className="card-r border border-black/10 bg-white/60 p-8 md:p-10 flex flex-col"
                >
                  <p className="text-[12px] tracking-widest uppercase text-ll-highlight mb-4">
                    {service.index} · {service.eyebrow}
                  </p>
                  <h3 className="display-md text-black mb-4">{service.title}</h3>
                  <p className="text-black/60 text-[15px] leading-relaxed mb-7">{service.body}</p>

                  <p className="text-[12px] tracking-widest uppercase text-black/40 mb-3">
                    What you get
                  </p>
                  <ul className="flex flex-col gap-2 mb-7">
                    {service.deliverables.map((item) => (
                      <li
                        key={item}
                        className="text-black/70 text-[14px] leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-ll-highlight"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  <p className="text-[12px] tracking-widest uppercase text-black/40 mb-3">
                    Where it gets used
                  </p>
                  <p className="text-black/60 text-[15px] leading-relaxed mb-7">
                    {service.useCase}
                  </p>

                  <p className="text-black/45 text-[13px] leading-relaxed border-t border-black/10 pt-5 mt-auto">
                    {service.floorLink}
                  </p>

                  <Link
                    to={`/services/${service.id}`}
                    className="mt-6 text-[13px] tracking-widest uppercase text-ll-highlight hover:text-black transition-colors"
                  >
                    See the work →
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section className="pb-20 border-t border-black/10 pt-16">
            <p className="text-[12px] tracking-widest uppercase text-ll-highlight mb-5">
              How a project runs
            </p>
            <h2 className="display-md text-black max-w-2xl mb-12">
              From first call to the day it goes live
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {PROCESS.map((step, i) => (
                <div key={step.title} className="flex flex-col gap-3">
                  <p className="text-[12px] tracking-widest uppercase text-black/35">
                    0{i + 1}
                  </p>
                  <h3 className="text-black text-[17px]">{step.title}</h3>
                  <p className="text-black/55 text-[14px] leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="px-4 md:px-8 pb-10">
          <section
            data-nav-tone="dark"
            className="max-w-[1600px] mx-auto card-r glow-wash text-ll-white overflow-hidden py-20 px-8 md:px-14 flex flex-col items-center gap-6 text-center"
          >
            <p className="text-[12px] tracking-widest uppercase text-ll-white/55">Expansions</p>
            <h2 className="display-md max-w-2xl">
              Tell us what you are launching, and we will tell you what is possible
            </h2>
            <p className="text-ll-sand/70 max-w-lg text-[15px] leading-relaxed">
              Bring a date, a space, and a budget range. We will come back with what we would build,
              what it costs, and what it takes to run it, no obligation to proceed.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center h-[61px] px-8 text-[14px] pill bg-ll-white text-black hover:bg-ll-highlight hover:text-ll-white transition-colors"
            >
              Start a project
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
