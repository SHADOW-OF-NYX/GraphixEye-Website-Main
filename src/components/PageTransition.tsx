import React, { createContext, useCallback, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { scrollToTopImmediate, scrollToTopOnRouteChange } from '../lib/scrollToTop';

type Origin = { x: number; y: number };

/**
 * Backdrop each route settles on. The veil is painted in the destination's
 * colour so that lifting it reveals the new page rather than announcing it —
 * on the dark pages the ink veil fades over an already-ink page and all you see
 * is the content arriving. Values track --color-ll-ink / --color-ll-white.
 */
const VEIL_LIGHT = '#fcf8f1';
const VEIL_BY_ROUTE: Record<string, string> = {
  '/careers': '#000000',
  '/vendors': '#150907', // --color-ll-ink, the vendor foundry ground
  '/experience': '#0c100e', // olive charcoal workshop ground
};

const veilColorFor = (path: string) => VEIL_BY_ROUTE[path] ?? VEIL_LIGHT;

const COVER_SECONDS = 0.62;
const REVEAL_SECONDS = 0.55;

type PageTransitionValue = {
  navigateWithVeil: (to: string, origin?: Origin) => void;
};

const PageTransitionContext = createContext<PageTransitionValue>({
  navigateWithVeil: () => {},
});

export const usePageTransition = () => useContext(PageTransitionContext);

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const veilRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const running = useRef(false);

  const navigateWithVeil = useCallback(
    (to: string, origin?: Origin) => {
      const veil = veilRef.current;
      const disc = discRef.current;
      const reduceMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!veil || !disc || running.current || reduceMotion) {
        navigate(to);
        scrollToTopOnRouteChange();
        return;
      }

      running.current = true;

      const x = origin?.x ?? window.innerWidth / 2;
      const y = origin?.y ?? 0;
      // Reach the farthest corner so the disc is guaranteed to cover the viewport
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      veil.style.pointerEvents = 'auto';
      disc.style.background = veilColorFor(to);
      disc.style.width = `${radius * 2}px`;
      disc.style.height = `${radius * 2}px`;
      disc.style.left = `${x - radius}px`;
      disc.style.top = `${y - radius}px`;

      gsap.set(veil, { opacity: 1 });
      gsap.fromTo(
        disc,
        { scale: 0 },
        {
          scale: 1,
          duration: COVER_SECONDS,
          ease: 'power3.inOut',
          onComplete: () => {
            navigate(to);
            scrollToTopImmediate();
            // Two frames lets the incoming route mount and paint while hidden,
            // so the reveal never uncovers a half-built page mid-scroll
            requestAnimationFrame(() =>
              requestAnimationFrame(() => {
                scrollToTopOnRouteChange();
                gsap.to(veil, {
                  opacity: 0,
                  duration: REVEAL_SECONDS,
                  delay: 0.1,
                  ease: 'power2.out',
                  onComplete: () => {
                    scrollToTopImmediate();
                    veil.style.pointerEvents = 'none';
                    gsap.set(disc, { scale: 0 });
                    running.current = false;
                  },
                });
              }),
            );
          },
        },
      );
    },
    [navigate],
  );

  return (
    <PageTransitionContext.Provider value={{ navigateWithVeil }}>
      {children}
      <div
        ref={veilRef}
        aria-hidden
        className="fixed inset-0 z-[120] overflow-hidden pointer-events-none"
        style={{ opacity: 0 }}
      >
        <div
          ref={discRef}
          className="absolute rounded-full"
          style={{ transform: 'scale(0)', willChange: 'transform' }}
        />
      </div>
    </PageTransitionContext.Provider>
  );
}
