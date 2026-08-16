import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#111] py-12 px-8 mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
        <div className="mb-6 md:mb-0">
          <Link to="/" className="text-4xl font-serif text-white tracking-widest block mb-2">
            DSC
          </Link>
          <p>&copy; 2024 Desert Star Construction. All Rights Reserved. Built for the Personal Resort.</p>
        </div>
        
        <div className="flex space-x-6">
          <Link to="/" className="hover:text-dsc-accent transition-colors">Privacy Policy</Link>
          <Link to="/" className="hover:text-dsc-accent transition-colors">Terms of Service</Link>
          <Link to="/" className="hover:text-dsc-accent transition-colors">Press Kit</Link>
          <Link to="/" className="hover:text-dsc-accent transition-colors">Careers</Link>
        </div>
      </div>
    </footer>
  );
}
