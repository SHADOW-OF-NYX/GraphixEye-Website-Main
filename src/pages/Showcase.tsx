import React, { useMemo, useState } from 'react';
import { Placeholder } from '../components/ui';
import { photos } from '../data/images';
import { workFilters, works, type Work, type WorkCategory } from '../data/works';

export default function Showcase() {
  const [filter, setFilter] = useState<(typeof workFilters)[number]>('All Projects');

  const filtered = useMemo(() => {
    if (filter === 'All Projects') return works;
    return works.filter((work) => work.category === (filter as WorkCategory));
  }, [filter]);

  return (
    <div className="bg-ll-white min-h-screen pt-28 pb-24">
      <section className="px-4 md:px-8 mb-16">
        <Placeholder src={photos.showcaseHero} label="Selected Works — hero" className="w-full h-[70vh] card-r" />
      </section>

      <section className="max-w-[1600px] mx-auto px-6 md:px-8 mb-14 flex flex-col md:flex-row justify-between items-end gap-8">
        <h1 className="display-md">Selected Works</h1>
        <div className="flex flex-wrap gap-2">
          {workFilters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`h-10 px-4 pill text-[13px] transition-colors ${
                filter === item ? 'bg-black text-ll-white' : 'bg-ll-sand text-black hover:bg-black/10'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-6 md:px-8">
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((work: Work, i) => (
            <article
              key={work.slug}
              className={`relative card-r overflow-hidden min-h-[420px] group ${i % 3 === 0 ? 'md:min-h-[520px]' : ''}`}
            >
              <Placeholder src={work.image} label={work.title} className="absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-8 left-8 right-8 text-ll-white">
                <p className="text-[12px] tracking-widest uppercase opacity-70 mb-2">{work.category}</p>
                <h2 className="font-display text-3xl mb-1">{work.title}</h2>
                <p className="text-[14px] text-ll-white/70">{work.location}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
