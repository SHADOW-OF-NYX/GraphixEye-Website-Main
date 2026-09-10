import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandLogo } from './ui';
import { navLinks, site } from '../data/site';
import { isDarkBackdrop } from '../lib/backdropContrast';
import { preloadExpansions } from '../lib/particles/preloadExpansions';
import { preloadCareers } from '../lib/particles/preloadCareers';
import { preloadVendors } from '../lib/particles/preloadVendors';
import { preloadExperience } from '../lib/particles/preloadExperience';
import { usePageTransition } from './PageTransition';

/** Routes that sit on a dark backdrop directly beneath the nav on first paint. */
const DARK_BACKDROP_ROUTES = new Set(['/', '/careers', '/vendors', '/experience']);

/** Routes whose heavy chunks are worth warming the moment a link is hovered. */
const PRELOADERS: Record<string, () => void> = {
  '/expansions': preloadExpansions,
  '/careers': preloadCareers,
  '/vendors': preloadVendors,
  '/experience': preloadExperience,
};

function isActivePath(pathname: string, path: string) {
  return (
    pathname === path ||
    (path === '/services' && pathname.startsWith('/services')) ||
    (path === '/expansions' && pathname.startsWith('/expansions')) ||
    (path === '/vendors' && pathname.startsWith('/vendors'))
  );
}

export default function Navbar() {
  const location = useLocation();
  const { navigateWithVeil } = usePageTransition();
  const navRef = useRef<HTMLElement>(null);
  const onDarkRef = useRef(location.pathname === '/');
  const [onDark, setOnDark] = useState(location.pathname === '/');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

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
  const menuTone = onDark || menuOpen;

  // Let modified clicks (new tab, etc.) and same-page clicks behave normally
  const handleNav = (event: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    if (path === location.pathname) {
      setMenuOpen(false);
      return;
    }

    event.preventDefault();
    setMenuOpen(false);
    navigateWithVeil(path, { x: event.clientX, y: event.clientY });
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 px-5 md:px-8 pt-[max(1.25rem,env(safe-area-inset-top))] pb-5 transition-colors duration-500 ${
        menuOpen ? 'text-ll-white' : text
      }`}
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between relative z-[60]">
        <Link to="/" className="flex items-center" onClick={(e) => handleNav(e, '/')}>
          <BrandLogo className="h-10 sm:h-12 md:h-14" onDark={menuTone ? true : onDark} />
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
                isActivePath(location.pathname, link.path) ? '' : 'opacity-90 hover:opacity-100'
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

        <button
          type="button"
          className="md:hidden relative z-[60] w-11 h-11 -mr-1 inline-flex flex-col items-center justify-center gap-[6px]"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span
            className={`block w-6 h-[1.5px] transition-transform duration-300 origin-center ${
              menuOpen ? 'translate-y-[7.5px] rotate-45 bg-ll-white' : onDark ? 'bg-ll-white' : 'bg-black'
            }`}
          />
          <span
            className={`block w-6 h-[1.5px] transition-opacity duration-200 ${
              menuOpen ? 'opacity-0' : onDark ? 'bg-ll-white' : 'bg-black'
            }`}
          />
          <span
            className={`block w-6 h-[1.5px] transition-transform duration-300 origin-center ${
              menuOpen ? '-translate-y-[7.5px] -rotate-45 bg-ll-white' : onDark ? 'bg-ll-white' : 'bg-black'
            }`}
          />
        </button>
      </div>

      {/* Mobile full-screen menu */}
      <div
        className={`md:hidden fixed inset-0 z-[55] transition-[opacity,visibility] duration-400 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="absolute inset-0 bg-ll-ink" />
        <div
          className="relative h-full flex flex-col justify-between px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(6.5rem,calc(env(safe-area-inset-top)+5.5rem))]"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link, i) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => handleNav(e, link.path)}
                onTouchStart={PRELOADERS[link.path]}
                className={`font-display text-[clamp(1.75rem,8vw,2.5rem)] leading-[1.15] py-2 transition-opacity ${
                  isActivePath(location.pathname, link.path) ? 'text-ll-white' : 'text-ll-white/70'
                }`}
                style={{
                  transitionDelay: menuOpen ? `${80 + i * 40}ms` : '0ms',
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'translateY(0)' : 'translateY(12px)',
                  transitionProperty: 'opacity, transform',
                  transitionDuration: '400ms',
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div
            className="pb-2"
            style={{
              transitionDelay: menuOpen ? '280ms' : '0ms',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(12px)',
              transitionProperty: 'opacity, transform',
              transitionDuration: '400ms',
            }}
          >
            <Link
              to="/contact"
              onClick={(e) => handleNav(e, '/contact')}
              className="w-full h-[54px] pill bg-ll-white text-black inline-flex items-center justify-center text-[15px] hover:bg-ll-highlight hover:text-ll-white transition-colors"
            >
              {site.cta}
            </Link>
            <p className="mt-5 text-[13px] text-ll-white/40 tracking-[0.08em] uppercase">
              {site.tagline}
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
