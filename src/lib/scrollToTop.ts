/**
 * Force the window to the top. Lenis, Safari, and SPA transitions each need
 * a slightly different knock — hit all of them.
 */

type LenisLike = {
  scrollTo: (value: number, opts?: { immediate?: boolean }) => void;
  scroll?: number;
};

declare global {
  interface Window {
    __lenis?: LenisLike | null;
  }
}

export function registerLenis(instance: LenisLike | null) {
  if (typeof window === 'undefined') return;
  window.__lenis = instance;
}

export function scrollToTopImmediate() {
  if (typeof window === 'undefined') return;

  try {
    window.__lenis?.scrollTo(0, { immediate: true });
  } catch {
    /* ignore */
  }

  window.scrollTo(0, 0);
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  window.dispatchEvent(new Event('site-scroll'));
}

/** Scroll now, then again after paint / layout (GSAP pins, sticky stages). */
export function scrollToTopOnRouteChange() {
  scrollToTopImmediate();

  requestAnimationFrame(() => {
    scrollToTopImmediate();
    requestAnimationFrame(scrollToTopImmediate);
  });

  // Safari sometimes restores scroll after the first paint
  window.setTimeout(scrollToTopImmediate, 50);
  window.setTimeout(scrollToTopImmediate, 200);
  window.setTimeout(scrollToTopImmediate, 450);
}
