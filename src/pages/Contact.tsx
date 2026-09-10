import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { breadcrumbJsonLd, getPageSeo } from '../data/seo';
import { site } from '../data/site';
import { serviceHubs } from '../data/serviceHubs';

export default function Contact() {
  const seo = getPageSeo('/contact')!;

  return (
    <div className="bg-ll-white min-h-screen pt-36 pb-24">
      <Seo
        page={seo}
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 flex flex-col md:flex-row gap-20">
        <div className="w-full md:w-1/2">
          <p className="text-[12px] tracking-widest uppercase text-black/40 mb-3">Contact</p>
          <h1 className="display-xl mb-8">
            Contact GraphixEye<br />in Dammam
          </h1>
          <p className="text-black/55 text-[16px] leading-relaxed mb-6 max-w-md">
            Request a quote for one-stop printing, packaging, signage, corporate gifting, design, or AR/VR/MR projects
            across Saudi Arabia. {site.contactLead} We aim to respond within 24 hours.
          </p>
          <p className="text-black/45 text-[15px] leading-relaxed mb-8 max-w-md">
            GraphixEye is your one-stop printing and signage company in Dammam — visit the 2nd Industrial City factory
            or send a brief online.
          </p>
          <p className="mb-12">
            <Link to="/faq" className="text-[14px] underline underline-offset-4 hover:text-ll-highlight transition-colors">
              Read FAQs about our factory and services →
            </Link>
          </p>

          <div className="border-t border-ll-stroke pt-10 mb-10">
            <p className="text-[12px] tracking-widest uppercase text-black/40 mb-3">Inquiries</p>
            <p className="font-display text-4xl md:text-5xl">{site.phone}</p>
            <a href={`mailto:${site.email}`} className="block mt-3 text-[15px] hover:text-ll-highlight transition-colors">
              {site.email}
            </a>
          </div>

          <div className="mb-12">
            <p className="text-[12px] tracking-widest uppercase text-black/40 mb-3">Factory</p>
            <address className="not-italic text-black/60 text-[16px] leading-loose">
              {site.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>

          <div>
            <p className="text-[12px] tracking-widest uppercase text-black/40 mb-3">Services</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {serviceHubs.map((hub) => (
                <li key={hub.slug}>
                  <Link
                    to={`/services/${hub.slug}`}
                    className="text-[14px] underline underline-offset-4 hover:text-ll-highlight transition-colors"
                  >
                    {hub.slug}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <form className="bg-ll-sand card-r p-8 md:p-12 flex flex-col gap-7">
            <div>
              <label className="block text-[12px] tracking-widest uppercase text-black/40 mb-3">Client name</label>
              <input
                type="text"
                placeholder="First and last name"
                className="w-full bg-ll-white text-black px-4 py-3 outline-none pill"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2">
                <label className="block text-[12px] tracking-widest uppercase text-black/40 mb-3">Email</label>
                <input type="email" placeholder="client@example.com" className="w-full bg-ll-white text-black px-4 py-3 outline-none pill" />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-[12px] tracking-widest uppercase text-black/40 mb-3">Phone</label>
                <input type="tel" placeholder="+966" className="w-full bg-ll-white text-black px-4 py-3 outline-none pill" />
              </div>
            </div>
            <div>
              <label className="block text-[12px] tracking-widest uppercase text-black/40 mb-3">The vision</label>
              <textarea
                rows={4}
                placeholder="Design, signage, print, packaging, gifting, or AR/VR..."
                className="w-full bg-ll-white text-black px-4 py-3 outline-none resize-none rounded-3xl"
              />
            </div>
            <button
              type="button"
              className="self-start pill bg-black text-ll-white h-[52px] px-8 text-[14px] hover:bg-ll-highlight transition-colors"
            >
              Get a Free Quote in Dammam
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
