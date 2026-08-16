import React from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-dsc-dark min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80" 
            alt="Luxury home exterior at sunset with pool" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        
        <div className="relative z-10 flex flex-col items-center mt-20">
          <h1 className="text-5xl md:text-7xl font-serif text-white tracking-wide mb-6">
            Creating Personal<br />Resorts<sup className="text-2xl">&reg;</sup>
          </h1>
          <p className="text-sm tracking-[0.3em] uppercase text-gray-200 border-t border-b border-gray-400 py-3 px-8 mt-4">
            Desert Star Construction
          </p>
        </div>
        
        <div className="absolute bottom-10 z-10 animate-bounce">
          <ChevronDown className="w-8 h-8 text-dsc-accent" />
        </div>
      </section>

      {/* Vision Section */}
      <section className="max-w-7xl mx-auto px-8 py-32 flex flex-col md:flex-row items-center gap-16">
        <div className="w-full md:w-1/2">
          <img 
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Architectural detail" 
            className="w-full h-[600px] object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 md:pl-12">
          <h2 className="text-4xl md:text-5xl font-serif mb-8 text-white leading-tight">
            The Vision of the<br />Personal Resort
          </h2>
          <p className="text-dsc-gray text-lg mb-6 leading-relaxed">
            We do not merely build houses; we craft sanctuaries. A Personal Resort is an environment engineered for permanence, tranquility, and uncompromising luxury.
          </p>
          <p className="text-dsc-gray text-lg mb-10 leading-relaxed">
            By blending the precision of commercial structural engineering with the warmth of bespoke residential design, we create spaces that breathe, inspire, and endure.
          </p>
          <Link to="/experience" className="inline-flex items-center text-dsc-accent text-sm tracking-widest uppercase font-semibold border-b border-dsc-accent pb-1 hover:text-white hover:border-white transition-colors">
            Discover Our Approach <span className="ml-4 w-12 h-px bg-current"></span>
          </Link>
        </div>
      </section>

      {/* Featured Masterpieces */}
      <section className="bg-[#151515] py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12 border-b border-gray-800 pb-6">
            <div>
              <p className="text-dsc-accent text-xs tracking-widest uppercase mb-2">Selected Works</p>
              <h2 className="text-4xl md:text-5xl font-serif text-white">Featured Masterpieces</h2>
            </div>
            <Link to="/showcase" className="hidden md:flex items-center text-sm text-gray-300 hover:text-white transition-colors">
              View All Portfolio <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative group overflow-hidden h-[400px]">
              <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Camelback Sanctuary" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl font-serif text-white mb-1">Camelback Sanctuary</h3>
                <p className="text-gray-400 text-sm">Paradise Valley, AZ</p>
              </div>
            </div>
            <div className="relative group overflow-hidden h-[400px]">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Desert Pavilion" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl font-serif text-white mb-1">Desert Pavilion</h3>
                <p className="text-dsc-accent text-xs tracking-widest uppercase">Architecture</p>
              </div>
            </div>
            <div className="relative group overflow-hidden h-[400px]">
              <img src="https://images.unsplash.com/photo-1600607687644-aac4c15cecb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Oasis Courtyard" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl font-serif text-white mb-1">Oasis Courtyard</h3>
                <p className="text-dsc-accent text-xs tracking-widest uppercase">Landscape Integration</p>
              </div>
            </div>
            <div className="relative group overflow-hidden h-[400px]">
              <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="The Stone Ridge" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl font-serif text-white mb-1">The Stone Ridge</h3>
                <p className="text-gray-400 text-sm">Scottsdale, AZ</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      <section className="max-w-7xl mx-auto px-8 py-32 flex flex-col md:flex-row gap-16">
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-8 text-white">The DSC Legacy</h2>
          <p className="text-dsc-gray text-lg mb-12 leading-relaxed">
            For over four decades, we have partnered with visionary architects and discerning clients to execute the most complex and ambitious residential projects in the Southwest. Our foundation is built on an unwavering commitment to quality, transparency, and the pursuit of perfection.
          </p>
          
          <div className="flex gap-16">
            <div>
              <p className="text-5xl font-serif text-white mb-2 border-b border-gray-700 pb-4">40+</p>
              <p className="text-xs uppercase tracking-widest text-dsc-gray mt-4">Years of Excellence</p>
            </div>
            <div>
              <p className="text-5xl font-serif text-white mb-2 border-b border-gray-700 pb-4">Award</p>
              <p className="text-xs uppercase tracking-widest text-dsc-gray mt-4">Winning Execution</p>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2">
          <div className="w-full h-[500px] border border-gray-800 bg-[#161616] flex flex-col items-center justify-center text-dsc-gray">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4">
              <path d="M12 2L2 22h20L12 2z" />
              <circle cx="12" cy="16" r="2" />
            </svg>
            <p className="text-sm tracking-widest uppercase">Built For Generations</p>
          </div>
        </div>
      </section>
    </div>
  );
}
