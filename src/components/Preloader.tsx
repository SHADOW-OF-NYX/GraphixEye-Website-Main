import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrandLogo } from './ui';
import { onHeroReady, markHeroReady } from '../lib/heroReady';

const MIN_MS = 700;
const MAX_MS = 2800;
const FADE_MS = 700;

export default function Preloader() {
  const { pathname } = useLocation();
  const [gone, setGone] = useState(false);
  const [hide, setHide] = useState(false);
  const [barDone, setBarDone] = useState(false);

  useEffect(() => {
    let hideTimer = 0;
    let goneTimer = 0;
    let finished = false;
    const start = performance.now();

    const finish = () => {
      if (finished) return;
      finished = true;
      setBarDone(true);
      const wait = Math.max(0, MIN_MS - (performance.now() - start));
      hideTimer = window.setTimeout(() => {
        setHide(true);
        goneTimer = window.setTimeout(() => {
          setGone(true);
          ScrollTrigger.refresh();
        }, FADE_MS);
      }, wait);
    };

    // Only the home hero video gates the preloader
    const needsHero = pathname === '/';
    let unsub = () => undefined;
    let maxTimer = 0;

    if (needsHero) {
      unsub = onHeroReady(finish);
      maxTimer = window.setTimeout(() => {
        markHeroReady();
        finish();
      }, MAX_MS);
    } else {
      maxTimer = window.setTimeout(finish, MIN_MS);
    }

    return () => {
      unsub();
      window.clearTimeout(maxTimer);
      window.clearTimeout(hideTimer);
      window.clearTimeout(goneTimer);
    };
  }, [pathname]);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ll-white transition-opacity duration-700 ${hide ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="flex flex-col items-center mb-10">
        <BrandLogo className="h-24" />
      </div>
      <div className="w-40 h-[2px] bg-ll-sand overflow-hidden">
        <div
          className={`preloader-bar h-full origin-left bg-ll-highlight ${barDone ? 'preloader-bar--done' : ''}`}
        />
      </div>
    </div>
  );
}
