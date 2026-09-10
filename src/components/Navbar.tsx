import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandLogo } from './ui';
import { navLinks, site } from '../data/site';
import { isDarkBackdrop } from '../lib/backdropContrast';
import { preloadExpansions } from '../lib/particles/preloadExpansions';
import { preloadCareers } from '../lib/particles/preloadCareers';
import { usePageTransition } from './PageTransition';

/** Routes that sit on a dark backdrop directly beneath the nav on first paint. */
const DARK_BACKDROP_ROUTES = new Set(['/', '/careers', '/vendors', '/experience']);

/** Routes whose heavy chunks are worth warming the moment a link is hovered. */
const PRELOADERS: Record<string, () => void> = {
  '/expansions': preloadExpansions,
  '/careers': preloadCareers,
  '/vendors': preloadCareers,
  '/experience': preloadCareers,
};

export default function Navbar() {
  const location = useLocation();
  const { navigateWithVeil } = usePageTransition();
  const navRef = useRef<HTMLElement>(null);
  const onDarkRef = useRef(location.pathname === '/');
  const [onDark, setOnDark] = useState(location.pathname === '/');

  useEffect(() => {
    // Seed before the backdrop is measured. Expansions is a cream page, so
    // listing it here used to flash white nav text over the light background.
    onDarkRef.current = DARK_BACKDROP_ROUTES.has(location.pathname);
    setOnDark(onDarkRef.current);

    let frame = 0;

    const measure = () => {
      const nav = navRef.current;
      if (!nav) return;

      const next = isDarkBackdrop(nav);
      if (next === onDarkRef.current) return;
      onDarkRef.current = next;
      setOnDark(next);
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };

    const boot = window.requestAnimationFrame(schedule);
    const delayed = [80, 250, 800, 1600].map((ms) => window.setTimeout(schedule, ms));
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('site-scroll', schedule);
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule);
    document.addEventListener('loadeddata', schedule, true);
    document.addEventListener('playing', schedule, true);
    document.addEventListener('canplay', schedule, true);

    return () => {
      window.cancelAnimationFrame(boot);
      delayed.forEach((id) => window.clearTimeout(id));
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('site-scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('load', schedule);
      document.removeEventListener('loadeddata', schedule, true);
      document.removeEventListener('playing', schedule, true);
      document.removeEventListener('canplay', schedule, true);
    };
  }, [location.pathname]);

  const text = onDark ? 'text-ll-white' : 'text-black';

  // Let modified clicks (new tab, etc.) and same-page clicks behave normally
  const handleNav = (event: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    if (path === location.pathname) return;

    event.preventDefault();
    navigateWithVeil(path, { x: event.clientX, y: event.clientY });
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 px-5 md:px-8 py-5 transition-colors duration-500 ${text}`}
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center" onClick={(e) => handleNav(e, '/')}>
          <BrandLogo className="h-12 md:h-14" onDark={onDark} />
        </Link>

        <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onMouseEnter={PRELOADERS[link.path]}
              onFocus={PRELOADERS[link.path]}
              onClick={(e) => handleNav(e, link.path)}
              className={`h-[42px] px-2.5 lg:px-4 inline-flex items-center text-[14px] lg:text-[16px] whitespace-nowrap transition-colors ${
                location.pathname === link.path ||
                (link.path === '/services' && location.pathname.startsWith('/services')) ||
                (link.path === '/expansions' && location.pathname.startsWith('/expansions')) ||
                (link.path === '/vendors' && location.pathname.startsWith('/vendors'))
                  ? ''
                  : 'opacity-90 hover:opacity-100'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <Link
          to="/contact"
          onClick={(e) => handleNav(e, '/contact')}
          className={`hidden md:inline-flex items-center h-[44px] px-6 text-[14px] pill transition-all duration-300 ${
            onDark
              ? 'bg-ll-white text-black hover:bg-ll-highlight hover:text-ll-white'
              : 'bg-black text-ll-white hover:bg-ll-highlight'
          }`}
        >
          {site.cta}
        </Link>
      </div>
    </nav>
  );
}
