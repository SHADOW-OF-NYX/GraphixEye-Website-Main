import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isCoarsePointer, isNarrowViewport } from '../lib/device';

gsap.registerPlugin(ScrollTrigger);

/** Prefer native scroll on phones/tablets — Lenis fights touch + GSAP pins. */
function shouldUseNativeScroll() {
  return isCoarsePointer() || isNarrowViewport(900);
}

export default function SmoothScroll() {
  useEffect(() => {
    let lenis: Lenis | null = null;
    let ticker: ((time: number) => void) | null = null;

    const onNativeScroll = () => {
      ScrollTrigger.update();
      window.dispatchEvent(new Event('site-scroll'));
    };

    const onResize = () => ScrollTrigger.refresh();

    const teardownLenis = () => {
      if (ticker) {
        gsap.ticker.remove(ticker);
        ticker = null;
      }
      if (lenis) {
        lenis.destroy();
        lenis = null;
      }
    };

    const setup = () => {
      teardownLenis();
      window.removeEventListener('scroll', onNativeScroll);

      if (shouldUseNativeScroll()) {
        // Keep ScrollTrigger + nav contrast in sync without smooth-wheel hijacking.
        window.addEventListener('scroll', onNativeScroll, { passive: true });
        gsap.ticker.lagSmoothing(500, 33);
        onNativeScroll();
        return;
      }

      lenis = new Lenis({
        duration: 1.15,
        smoothWheel: true,
      });

      lenis.on('scroll', () => {
        ScrollTrigger.update();
        window.dispatchEvent(new Event('site-scroll'));
      });

      ticker = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
    };

    setup();
    window.addEventListener('resize', onResize);
    const mq = window.matchMedia('(pointer: coarse), (max-width: 900px)');
    const onMq = () => setup();
    mq.addEventListener('change', onMq);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onNativeScroll);
      mq.removeEventListener('change', onMq);
      teardownLenis();
    };
  }, []);

  return null;
}
