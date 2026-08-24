import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from './ui';
import { site } from '../data/site';

export default function Footer() {
  return (
    <footer className="bg-ll-white text-black px-5 md:px-8 pt-16 pb-10">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-12 pb-16">
          <Link to="/" className="inline-flex items-center">
            <BrandLogo className="h-20" />
          </Link>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-16 gap-y-4 text-[15px]">
            <Link to="/services" className="hover:text-ll-highlight transition-colors">Services</Link>
            <Link to="/expansions" className="hover:text-ll-highlight transition-colors">Expansions</Link>
            <Link to="/experience" className="hover:text-ll-highlight transition-colors">Experience</Link>
            <Link to="/contact" className="hover:text-ll-highlight transition-colors">Contact</Link>
            <a href={`mailto:${site.email}`} className="hover:text-ll-highlight transition-colors">Email</a>
            <span className="text-black/50">Privacy Policy</span>
            <span className="text-black/50">Press kit</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 text-[13px] text-black/45 border-t border-ll-stroke pt-6">
          <p>© {new Date().getFullYear()} GraphixEye. {site.tagline}.</p>
          <p>{site.address.join(' · ')}</p>
        </div>
      </div>
    </footer>
  );
}
