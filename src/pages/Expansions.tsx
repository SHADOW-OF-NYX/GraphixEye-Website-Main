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
    <div className="relative bg-[#080f18] text-ll-white min-h-screen">
      <ThreeSceneLoader />

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -1,
          background:
            'radial-gradient(ellipse 120% 80% at 50% 28%, #1e2d40 0%, #0d1520 58%, #080f18 100%)',
        }}
        aria-hidden
      />

      <ServiceShowcase />

      <div id="morph-track" className="relative" style={{ height: '620vh', zIndex: 10 }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <div ref={introRef} className="absolute inset-0 pointer-events-none select-none">
            <div className="absolute left-5 md:left-14 top-1/2 -translate-y-1/2 -mt-10 max-w-xl">
              <p
                className="uppercase text-white/35 mb-4"
                style={{ fontSize: 11, letterSpacing: '0.2em' }}
              >
                Expansions
              </p>
              <h1
                className="uppercase font-light text-white leading-none drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)]"
                style={{ fontSize: 'clamp(28px, 4.5vw, 56px)', letterSpacing: '-0.015em' }}
              >
                Where intent
                <br />
                takes form
              </h1>
              <p
                className="mt-6 uppercase text-white/40 max-w-xs"
                style={{ fontSize: 12, letterSpacing: '0.12em' }}
              >
                AI · AR · VR · MR — scroll to explore
              </p>
            </div>
          </div>

          <p
            className="absolute bottom-8 left-1/2 -translate-x-1/2 uppercase text-white/25 tracking-[0.2em] pointer-events-none"
            style={{ fontSize: 10 }}
          >
            Scroll
          </p>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center py-16 px-5">
        <Link
          to="/contact"
          className="inline-flex items-center h-[44px] px-6 text-[14px] pill bg-ll-white text-black hover:bg-ll-highlight hover:text-ll-white transition-colors"
        >
          Start a project
        </Link>
      </div>
    </div>
  );
}
