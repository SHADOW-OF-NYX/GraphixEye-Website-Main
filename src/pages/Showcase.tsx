import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Showcase() {
  return (
    <div className="bg-dsc-dark min-h-screen pt-32">
      {/* Hero Image */}
      <section className="w-full h-[70vh] mb-20 px-8">
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80" 
          alt="Luxury Desert Home" 
          className="w-full h-full object-cover"
        />
      </section>

      {/* Header and Filters */}
      <section className="max-w-7xl mx-auto px-8 mb-16 flex flex-col md:flex-row justify-between items-end border-b border-gray-800 pb-6">
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-6 md:mb-0">Selected Works</h1>
        <div className="flex flex-wrap gap-8 text-sm tracking-wide">
          <button className="text-white border-b border-white pb-1">All Projects</button>
          <button className="text-gray-400 hover:text-white transition-colors pb-1">Modernist</button>
          <button className="text-gray-400 hover:text-white transition-colors pb-1">Desert Contemporary</button>
          <button className="text-gray-400 hover:text-white transition-colors pb-1">Sustainable Luxury</button>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col gap-32">
          
          {/* Row 1 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-2/3">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                alt="Camelback Mountain Sanctuary" 
                className="w-full h-auto object-cover mb-6"
              />
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-serif text-white mb-2">Camelback Mountain Sanctuary</h2>
                  <p className="text-gray-400 text-sm">Paradise Valley, AZ</p>
                </div>
                <div className="border-l border-gray-700 pl-4">
                  <p className="text-dsc-accent text-xs tracking-widest uppercase w-32 leading-relaxed">Desert<br />Contemporary</p>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/3 mt-16 md:mt-48">
              <img 
                src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80" 
                alt="The Glass Pavilion" 
                className="w-full h-auto object-cover mb-6"
              />
              <h2 className="text-3xl font-serif text-white mb-2">The Glass Pavilion</h2>
              <p className="text-gray-400 text-sm">Scottsdale, AZ</p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                alt="Corten Estate" 
                className="w-full h-auto object-cover mb-6"
              />
              <h2 className="text-3xl font-serif text-white mb-2">Corten Estate</h2>
              <p className="text-gray-400 text-sm">Carefree, AZ</p>
            </div>
            
            <div className="w-full md:w-1/2 md:mt-32">
              <img 
                src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                alt="Oasis Redefined" 
                className="w-full h-auto object-cover mb-6"
              />
              <h2 className="text-3xl font-serif text-white mb-2">Oasis Redefined</h2>
              <p className="text-gray-400 text-sm">Phoenix, AZ</p>
            </div>
          </div>
          
        </div>

        {/* View Archive Button */}
        <div className="mt-32 flex justify-center">
          <button className="border border-gray-600 text-white px-8 py-4 flex items-center text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300">
            View Archive <ArrowRight className="ml-4 w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
