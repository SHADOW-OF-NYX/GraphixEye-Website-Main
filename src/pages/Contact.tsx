import React from 'react';
import { site } from '../data/site';

export default function Contact() {
  return (
    <div className="bg-ll-white min-h-screen pt-36 pb-24">
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 flex flex-col md:flex-row gap-20">
        <div className="w-full md:w-1/2">
          <h1 className="display-xl mb-8">
            Not Sure Where<br />to Start?
          </h1>
          <p className="text-black/55 text-[16px] leading-relaxed mb-16 max-w-md">
            {site.contactLead}
          </p>

          <div className="border-t border-ll-stroke pt-10 mb-10">
            <p className="text-[12px] tracking-widest uppercase text-black/40 mb-3">Inquiries</p>
            <p className="font-display text-4xl md:text-5xl">{site.phone}</p>
          </div>

          <div>
            <p className="text-[12px] tracking-widest uppercase text-black/40 mb-3">Factory</p>
            <address className="not-italic text-black/60 text-[16px] leading-loose">
              {site.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
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
                placeholder="Design, signage, print, packaging, or gifting..."
                className="w-full bg-ll-white text-black px-4 py-3 outline-none resize-none rounded-3xl"
              />
            </div>
            <button
              type="button"
              className="self-start pill bg-black text-ll-white h-[52px] px-8 text-[14px] hover:bg-ll-highlight transition-colors"
            >
              Submit inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
