import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo, Placeholder } from '../components/ui';
import { photos } from '../data/images';
import { journey } from '../data/site';

export default function Experience() {
  const [tab, setTab] = useState<'precision' | 'artisan'>('precision');

  return (
    <div className="bg-ll-white min-h-screen pt-28 pb-24">
      <div className="flex justify-center mb-10">
        <BrandLogo className="h-14" />
      </div>

      <section className="px-4 md:px-8 mb-20">
        <Placeholder src={photos.experienceExterior} label="Experience — exterior signage" className="w-full h-[70vh] card-r" />
      </section>

      <section className="max-w-[1600px] mx-auto px-6 md:px-8 grid md:grid-cols-2 gap-10 md:gap-16 mb-24 items-center">
        <div className="flex flex-col justify-center max-w-lg">
          <p className="font-display text-[18px] mb-8">The Experience</p>
          <p className="text-black/55 leading-relaxed text-[16px] mb-8">
            Visit the Dammam floor and see identity, signage, print, and finishing under one roof — a working factory
            we are proud to show.
          </p>
          <Link
            to="/contact"
            className="text-[13px] uppercase tracking-widest text-ll-highlight font-medium hover:text-black transition-colors"
          >
            Explore our approach →
          </Link>
        </div>
        <Placeholder src={photos.experiencePress} label="Experience — press floor" className="card-r h-[420px] md:h-[560px]" />
      </section>

      <section className="max-w-[1600px] mx-auto px-6 md:px-8 grid md:grid-cols-2 gap-0 card-r overflow-hidden bg-ll-sand mb-24">
        <Placeholder src={photos.silkScreen} label="Silk screen / UV finishing" className="h-[560px]" />
        <div className="p-10 md:p-14 flex flex-col justify-center">
          <div className="flex gap-6 mb-8 font-display text-[18px]">
            <button type="button" onClick={() => setTab('precision')} className={tab === 'precision' ? 'text-black' : 'text-black/35'}>
              Precision Production
            </button>
            <button type="button" onClick={() => setTab('artisan')} className={tab === 'artisan' ? 'text-black' : 'text-black/35'}>
              Artisan Finishes
            </button>
          </div>
          <p className="text-black/55 leading-relaxed text-[16px]">
            {tab === 'precision'
              ? 'Our commitment to quality extends beyond what is visible. Offset, digital, silk screen, and UV printing sit beside binding, lamination, die cutting, and hot stamping — so every GraphixEye piece is engineered for colour, durability, and a finish that lasts.'
              : 'Hot stamping, lamination, die cutting, and bindery are treated as part of the design, not afterthoughts. Finishes are written on the job sheet so reprints and other sites stay identical.'}
          </p>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-6 md:px-8">
        <h2 className="display-md mb-10">From first call to finished work</h2>
        <div className="grid md:grid-cols-5 gap-4">
          {journey.map((step, i) => (
            <article key={step.title} className="bg-ll-sand card-r p-6 hover:bg-black hover:text-ll-white transition-colors duration-500 group">
              <p className="text-[12px] text-black/35 group-hover:text-ll-white/40 mb-4">0{i + 1}</p>
              <h3 className="font-display text-[18px] mb-3">{step.title}</h3>
              <p className="text-[13px] leading-relaxed text-black/50 group-hover:text-ll-white/65">{step.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
