import { useEffect } from 'react';
import { useLenis } from '@/hooks/useLenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ParticleCanvas from '@/components/ParticleCanvas';
import ScrollProgress from '@/components/ScrollProgress';
import Navigation from '@/components/Navigation';

import Hero from '@/sections/Hero';
import Partners from '@/sections/Partners';
import About from '@/sections/About';
import Domains from '@/sections/Domains';
import Events from '@/sections/Events';
import Hackathon from '@/sections/Hackathon';
import Community from '@/sections/Community';
import Projects from '@/sections/Projects';
import OpenSource from '@/sections/OpenSource';
import AITools from '@/sections/AITools';
import Gamification from '@/sections/Gamification';
import Gallery from '@/sections/Gallery';
import Testimonials from '@/sections/Testimonials';
import Blog from '@/sections/Blog';
import Footer from '@/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useLenis();

  useEffect(() => {
    // Refresh ScrollTrigger after everything loads
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f4f4f5]">
      {/* Global Background Elements */}
      <ParticleCanvas />
      <div className="grid-bg" />
      <div className="noise-overlay" />
      <div className="aurora-orb aurora-orb-1" />
      <div className="aurora-orb aurora-orb-2" />
      <div className="aurora-orb aurora-orb-3" />

      {/* Scroll Progress */}
      <ScrollProgress />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main>
        <Hero />
        <Partners />
        <About />
        <Domains />
        <Events />
        <Hackathon />
        <Community />
        <Projects />
        <OpenSource />
        <AITools />
        <Gamification />
        <Gallery />
        <Testimonials />
        <Blog />
        <Footer />
      </main>
    </div>
  );
}

export default App;
