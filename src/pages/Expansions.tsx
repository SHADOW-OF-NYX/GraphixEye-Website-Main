import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ThreeSceneLoader from '../components/particles/ThreeSceneLoader';
import ServiceShowcase from '../components/particles/ServiceShowcase';

gsap.registerPlugin(ScrollTrigger);

/**
 * Immersive particle morph page — AI → AR → VR → MR.
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
                AI · AR · VR · MR — scroll to explore
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
      <div className="relative z-10 bg-ll-white px-4 md:px-8 pt-24 pb-10">
        <section
          data-nav-tone="dark"
          className="max-w-[1600px] mx-auto card-r glow-wash text-ll-white overflow-hidden py-20 px-8 md:px-14 flex flex-col items-center gap-6 text-center"
        >
          <p className="text-[12px] tracking-widest uppercase text-ll-white/55">Expansions</p>
          <h2 className="display-md max-w-2xl">
            Built on the same floor as everything else we make
          </h2>
          <p className="text-ll-sand/70 max-w-md text-[15px] leading-relaxed">
            AI, AR, VR, and MR run alongside our presses and finishing lines — one team, one
            production house in Dammam.
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
  );
}
