import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import SmoothScroll from './components/SmoothScroll';
import Home from './pages/Home';
import Showcase from './pages/Showcase';
import ServiceDetail from './pages/ServiceDetail';
import Experience from './pages/Experience';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import Expansions from './pages/Expansions';
import { preloadExpansions, scheduleExpansionsPreload } from './lib/particles/preloadExpansions';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppShell() {
  const { pathname } = useLocation();
  const isExpansions = pathname === '/expansions';
  const isCareers = pathname === '/careers';
  const isDark = isExpansions || isCareers;

  // If user navigates before idle preload finishes, prioritize immediately
  useEffect(() => {
    if (isExpansions) preloadExpansions();
  }, [isExpansions]);

  return (
    <div
      className={`font-sans min-h-screen ${
        isExpansions
          ? 'text-ll-white bg-[#080f18]'
          : isCareers
            ? 'text-ll-white bg-black'
            : 'text-black bg-ll-white'
      }`}
    >
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Showcase />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/showcase" element={<Navigate to="/services" replace />} />
          <Route path="/works" element={<Navigate to="/services" replace />} />
          <Route path="/works/:slug" element={<Navigate to="/services" replace />} />
          <Route path="/expansions" element={<Expansions />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
        </Routes>
      </main>
      {!isDark && <Footer />}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    scheduleExpansionsPreload();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <SmoothScroll />
      <Preloader />
      <AppShell />
    </BrowserRouter>
  );
}
