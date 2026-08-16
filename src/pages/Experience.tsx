import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Experience() {
  return (
    <div className="bg-dsc-dark min-h-screen pt-32">
      <div className="flex justify-center mb-16">
        <p className="text-xs tracking-widest text-gray-400 uppercase border-b border-gray-700 pb-2">Desert Star Construction</p>
      </div>

      {/* Hero Image */}
      <section className="max-w-7xl mx-auto px-8 mb-32">
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80" 
          alt="Luxury Desert Home" 
          className="w-full h-[70vh] object-cover rounded-xl"
        />
      </section>

      {/* Approach Section */}
      <section className="max-w-7xl mx-auto px-8 flex flex-col-reverse md:flex-row justify-between items-end gap-16 mb-48">
        <div className="pb-4">
          <button className="text-xs uppercase tracking-widest text-dsc-accent font-semibold flex items-center hover:text-white transition-colors">
            Explore Our Approach <ArrowRight className="ml-3 w-4 h-4" />
          </button>
        </div>
        <div className="w-full md:w-1/2">
          <img 
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80" 
            alt="Architects working" 
            className="w-full h-auto object-cover rounded-xl"
          />
        </div>
      </section>

      {/* Precision Section */}
      <section className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center gap-16 mb-48 bg-[#181818] rounded-xl overflow-hidden">
        <div className="w-full md:w-1/2">
          <img 
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Detail of construction" 
            className="w-full h-[600px] object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 md:pr-16 p-8">
          <div className="flex gap-12 border-b border-gray-800 pb-6 mb-8 text-lg font-serif">
            <button className="text-white">Precision Engineering</button>
            <button className="text-gray-500 hover:text-white transition-colors">Artisan Finishes</button>
          </div>
          <p className="text-gray-400 leading-relaxed text-lg mb-8">
            Our commitment to quality extends beyond what is visible. The foundation of every Personal Resort relies on commercial-grade engineering practices, ensuring structural integrity that lasts generations. 
          </p>
        </div>
      </section>

      {/* Details Grid */}
      <section className="max-w-7xl mx-auto px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <img 
            src="https://images.unsplash.com/photo-1590674899484-d5640e854abe?ixlib=rb-4.0.3&auto=format&fit=crop&w=2067&q=80" 
            alt="Concrete detail" 
            className="w-full h-80 object-cover rounded-xl"
          />
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Sliding doors" 
            className="w-full h-80 object-cover rounded-xl"
          />
          <div className="w-full h-80 bg-[#222] rounded-xl flex items-center justify-center border border-gray-800">
            <div className="w-48 h-32 border-2 border-dsc-accent rounded-lg flex flex-col items-center justify-center text-dsc-accent relative">
              <span className="text-[10px] absolute top-2 uppercase tracking-widest">Smart Home</span>
              <span className="text-2xl mt-4">72&deg;</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
