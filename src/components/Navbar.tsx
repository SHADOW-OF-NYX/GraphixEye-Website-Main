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
    onDarkRef.current = location.pathname === '/';
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
    const delayed = window.setTimeout(schedule, 80);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('site-scroll', schedule);
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule);
    document.addEventListener('loadeddata', schedule, true);

    return () => {
      window.cancelAnimationFrame(boot);
      window.clearTimeout(delayed);
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('site-scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('load', schedule);
      document.removeEventListener('loadeddata', schedule, true);
    };
  }, [location.pathname]);

  const text = onDark ? 'text-ll-white' : 'text-black';

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 px-5 md:px-8 py-5 transition-colors duration-500 ${text}`}
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center rounded-2xl bg-ll-white/95 px-2 py-1.5 shadow-sm">
          <BrandLogo className="h-11 md:h-12" />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`h-[42px] px-4 inline-flex items-center text-[16px] transition-colors ${
                location.pathname === link.path ? '' : 'opacity-90 hover:opacity-100'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/showcase"
            className={`h-[42px] px-4 inline-flex items-center text-[16px] transition-colors ${
              location.pathname === '/showcase' ? '' : 'opacity-90 hover:opacity-100'
            }`}
          >
            Works
          </Link>
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
