import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandLogo } from './ui';
import { navLinks, site } from '../data/site';
import { isDarkBackdrop } from '../lib/backdropContrast';

export default function Navbar() {
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const onDarkRef = useRef(location.pathname === '/');
  const [onDark, setOnDark] = useState(location.pathname === '/');

  useEffect(() => {
    onDarkRef.current = location.pathname === '/' || location.pathname === '/expansions';
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

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 px-5 md:px-8 py-5 transition-colors duration-500 ${text}`}
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <BrandLogo className="h-12 md:h-14" onDark={onDark} />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`h-[42px] px-4 inline-flex items-center text-[16px] transition-colors ${
                location.pathname === link.path ||
                (link.path === '/services' && location.pathname.startsWith('/services')) ||
                (link.path === '/expansions' && location.pathname.startsWith('/expansions'))
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
