import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onMediaQueryChange, shouldUseNativeScroll } from '../lib/device';
import { registerLenis } from '../lib/scrollToTop';

gsap.registerPlugin(ScrollTrigger);

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
      registerLenis(null);
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
    };

    const setup = () => {
      teardownLenis();
      window.removeEventListener('scroll', onNativeScroll);

      if (shouldUseNativeScroll()) {
        // Keep ScrollTrigger + nav contrast in sync without smooth-wheel hijacking.
        window.addEventListener('scroll', onNativeScroll, { passive: true });
        gsap.ticker.lagSmoothing(500, 33);
        onNativeScroll();
        ScrollTrigger.refresh();
        return;
      }

      lenis = new Lenis({
        duration: 1.15,
        smoothWheel: true,
      });
      registerLenis(lenis);

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
    const offMq = onMediaQueryChange(mq, setup);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onNativeScroll);
      offMq();
      teardownLenis();
    };
  }, []);

  return null;
}
