"use client";

import { useEffect } from 'react';
import { useLenis } from '@/hooks/useLenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ParticleCanvas from '@/components/landing/ParticleCanvas';
import ScrollProgress from '@/components/landing/ScrollProgress';
import Navigation from '@/components/landing/Navigation';

import Hero from '@/components/landing/Hero';
import Partners from '@/components/landing/Partners';
import About from '@/components/landing/About';
import Domains from '@/components/landing/Domains';
import Events from '@/components/landing/Events';
import Hackathon from '@/components/landing/Hackathon';
import Community from '@/components/landing/Community';
import Projects from '@/components/landing/Projects';
import OpenSource from '@/components/landing/OpenSource';
import AITools from '@/components/landing/AITools';
import Gamification from '@/components/landing/Gamification';
import Gallery from '@/components/landing/Gallery';
import Testimonials from '@/components/landing/Testimonials';
import Blog from '@/components/landing/Blog';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  useLenis();

  useEffect(() => {
    // Register GSAP ScrollTrigger safely on the client
    gsap.registerPlugin(ScrollTrigger);

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
