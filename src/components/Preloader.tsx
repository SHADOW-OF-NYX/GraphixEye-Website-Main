import React, { useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrandLogo } from './ui';

export default function Preloader() {
  const [gone, setGone] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setHide(true), 1700);
    const t2 = window.setTimeout(() => {
      setGone(true);
      ScrollTrigger.refresh();
    }, 2300);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ll-white transition-opacity duration-700 ${hide ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="flex flex-col items-center mb-10">
        <BrandLogo className="h-24" />
      </div>
      <div className="w-40 h-[2px] bg-ll-sand overflow-hidden">
        <div className="preloader-bar h-full origin-left bg-ll-highlight" />
      </div>
    </div>
  );
}
