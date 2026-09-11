import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import SmoothScroll from './components/SmoothScroll';
import { PageTransitionProvider } from './components/PageTransition';
import Home from './pages/Home';
import Showcase from './pages/Showcase';
import ServicePage from './pages/ServicePage';
import Experience from './pages/Experience';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import Vendors from './pages/Vendors';
import Expansions from './pages/Expansions';
import About from './pages/About';
import Faq from './pages/Faq';
import { DefaultSiteSeo } from './components/Seo';
import { preloadExpansions, scheduleExpansionsPreload } from './lib/particles/preloadExpansions';
import { scrollToTopImmediate, scrollToTopOnRouteChange } from './lib/scrollToTop';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    scrollToTopOnRouteChange();
    // Pins / morph tracks mount a beat later — refresh then re-clamp to top
    const refresh = window.setTimeout(() => {
      ScrollTrigger.refresh();
      scrollToTopImmediate();
    }, 120);
    return () => window.clearTimeout(refresh);
  }, [pathname]);

  return null;
}

function AppShell() {
  const { pathname } = useLocation();
  const isExpansions = pathname === '/expansions';
  const isCareers = pathname === '/careers';
  const isVendors = pathname === '/vendors';
  const isExperience = pathname === '/experience';
  const isDarkExperience = isCareers || isVendors || isExperience;

  // If user navigates before idle preload finishes, prioritize immediately
  useEffect(() => {
    if (isExpansions) preloadExpansions();
  }, [isExpansions]);

  return (
    <div
      className={`font-sans min-h-screen ${
        isDarkExperience
          ? `text-ll-white ${
              isVendors ? 'bg-ll-ink' : isExperience ? 'bg-[#0c100e]' : 'bg-black'
            }`
          : 'text-black bg-ll-white'
      }`}
    >
      <DefaultSiteSeo />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Showcase />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/showcase" element={<Navigate to="/services" replace />} />
          <Route path="/works" element={<Navigate to="/services" replace />} />
          <Route path="/works/:slug" element={<Navigate to="/services" replace />} />
          <Route path="/expansions" element={<Expansions />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/vendors" element={<Vendors />} />
        </Routes>
      </main>
      {!isDarkExperience && <Footer />}
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
      <PageTransitionProvider>
        <AppShell />
      </PageTransitionProvider>
    </BrowserRouter>
  );
}
