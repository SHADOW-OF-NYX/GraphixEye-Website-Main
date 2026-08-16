import React from 'react';

export default function Contact() {
  return (
    <div className="bg-dsc-darker min-h-screen pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row gap-20">
        
        {/* Left Side: Text and Info */}
        <div className="w-full md:w-1/2">
          <h1 className="text-5xl md:text-7xl font-serif text-white leading-tight mb-8">
            Begin the<br />Vision.
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-16 pr-12">
            Every Personal Resort begins with a conversation. Share your vision, and our team of master builders and architects will reach out to explore the possibilities.
          </p>
          
          <div className="border-t border-gray-800 pt-12 mb-12">
            <p className="text-dsc-accent text-xs tracking-widest uppercase font-semibold mb-4">Inquiries</p>
            <p className="text-4xl md:text-5xl font-serif text-white">480.555.0199</p>
          </div>
          
          <div>
            <p className="text-dsc-accent text-xs tracking-widest uppercase font-semibold mb-4">Headquarters</p>
            <address className="not-italic text-gray-300 text-lg leading-loose">
              8100 E. Camelback Road<br />
              Suite 100<br />
              Scottsdale, AZ 85251
            </address>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2">
          <div className="border border-gray-800 p-8 md:p-12 rounded-sm bg-[#121212]">
            <form className="flex flex-col gap-8">
              
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-400 font-semibold mb-3">Client Name</label>
                <input 
                  type="text" 
                  placeholder="First and Last Name" 
                  className="w-full bg-white text-black px-4 py-3 outline-none"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/2">
                  <label className="block text-xs tracking-widest uppercase text-gray-400 font-semibold mb-3">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="client@example.com" 
                    className="w-full bg-white text-black px-4 py-3 outline-none"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-xs tracking-widest uppercase text-gray-400 font-semibold mb-3">Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="(123) 456-7890" 
                    className="w-full bg-white text-black px-4 py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-400 font-semibold mb-3">Project Location</label>
                <input 
                  type="text" 
                  placeholder="City, State, or Area" 
                  className="w-full bg-white text-black px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-400 font-semibold mb-3">The Vision</label>
                <textarea 
                  rows={4} 
                  placeholder="Briefly describe the scope or inspiration for your Personal Resort..."
                  className="w-full bg-white text-black px-4 py-3 outline-none resize-none"
                ></textarea>
              </div>

              <div className="mt-4">
                <button 
                  type="button" 
                  className="bg-[#e0ab85] text-black text-xs font-bold tracking-widest uppercase px-8 py-4 hover:bg-white transition-colors"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
        
      </div>
    </div>
  );
}
