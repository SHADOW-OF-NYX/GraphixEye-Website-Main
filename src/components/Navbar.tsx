import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: 'Showcase', path: '/showcase' },
    { name: 'The Experience', path: '/experience' },
    { name: 'About Us', path: '/' },
    { name: 'Featured News', path: '/' },
  ];

  return (
    <nav className="absolute top-0 left-0 w-full z-50 px-8 py-6 text-white bg-transparent">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-serif tracking-wider font-semibold">
          DSC
        </Link>
        
        <div className="hidden md:flex space-x-8 text-sm font-medium tracking-wide">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`hover:text-dsc-accent transition-colors duration-300 ${location.pathname === link.path ? 'text-dsc-accent' : 'text-gray-200'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Link 
            to="/contact" 
            className="text-xs uppercase tracking-widest font-semibold hover:text-dsc-accent transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
