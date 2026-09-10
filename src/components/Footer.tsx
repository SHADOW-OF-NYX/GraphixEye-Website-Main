import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from './ui';
import { site } from '../data/site';

export default function Footer() {
  return (
    // z-10 keeps the footer above Expansions' fixed particle canvas
    <footer className="relative z-10 bg-ll-white text-black px-5 md:px-8 pt-16 pb-10">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-12 pb-16">
          <div>
            <Link to="/" className="inline-flex items-center">
              <BrandLogo className="h-20" />
            </Link>
            <p className="mt-6 text-[14px] text-black/55 max-w-xs leading-relaxed">
              One-stop design, printing, signage, packaging, gifting, and immersive production from Dammam across Saudi Arabia.
            </p>
            <address className="not-italic mt-6 text-[13px] leading-relaxed text-black/50">
              <p className="text-black/70 font-display text-[15px] mb-1">GraphixEye</p>
              <p>{site.address.join(', ')}</p>
              <p className="mt-2">
                <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="hover:text-ll-highlight transition-colors">
                  {site.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${site.email}`} className="hover:text-ll-highlight transition-colors">
                  {site.email}
                </a>
              </p>
            </address>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-16 gap-y-4 text-[15px]">
            <Link to="/services" className="hover:text-ll-highlight transition-colors">Services</Link>
            <Link to="/services/printing" className="hover:text-ll-highlight transition-colors">Printing</Link>
            <Link to="/services/signage" className="hover:text-ll-highlight transition-colors">Signage</Link>
            <Link to="/services/packaging" className="hover:text-ll-highlight transition-colors">Packaging</Link>
            <Link to="/services/design" className="hover:text-ll-highlight transition-colors">Design</Link>
            <Link to="/services/gifting" className="hover:text-ll-highlight transition-colors">Gifting</Link>
            <Link to="/services/ar-vr" className="hover:text-ll-highlight transition-colors">AR / VR</Link>
            <Link to="/services/ai" className="hover:text-ll-highlight transition-colors">AI</Link>
            <Link to="/experience" className="hover:text-ll-highlight transition-colors">Experience</Link>
            <Link to="/expansions" className="hover:text-ll-highlight transition-colors">Expansions</Link>
            <Link to="/about" className="hover:text-ll-highlight transition-colors">About</Link>
            <Link to="/faq" className="hover:text-ll-highlight transition-colors">FAQ</Link>
            <Link to="/careers" className="hover:text-ll-highlight transition-colors">Careers</Link>
            <Link to="/vendors" className="hover:text-ll-highlight transition-colors">Vendor Registration</Link>
            <Link to="/contact" className="hover:text-ll-highlight transition-colors">Contact</Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 text-[13px] text-black/45 border-t border-ll-stroke pt-6">
          <p>© {new Date().getFullYear()} GraphixEye. {site.tagline}.</p>
          <p>{site.address.join(' · ')} · {site.phone}</p>
        </div>
      </div>
    </footer>
  );
}
