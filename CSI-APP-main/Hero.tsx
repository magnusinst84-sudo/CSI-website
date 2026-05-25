import { useEffect, useRef, useState } from 'react';
import { ArrowDown, Play, Users, Calendar, Trophy } from 'lucide-react';
import gsap from 'gsap';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entry animation timeline
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 80, rotateX: -20 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1.2, ease: 'power4.out' }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.6'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(
          statsRef.current?.children || [],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
          '-=0.3'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient mesh */}
      <div
        className="absolute inset-0 opacity-30 transition-all duration-[2000ms]"
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(6,182,212,0.15) 0%, transparent 50%),
                       radial-gradient(circle at ${(1 - mousePos.x) * 100}% ${(1 - mousePos.y) * 100}%, rgba(245,158,11,0.08) 0%, transparent 50%)`,
        }}
      />

      {/* Floating geometric elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 border border-cyan-500/10 rounded-full animate-float"
          style={{ transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)` }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-48 h-48 border border-amber-500/10 rounded-full animate-float-delay"
          style={{ transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)` }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-32 h-32 border border-cyan-500/5 rotate-45 animate-float"
          style={{ transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px) rotate(45deg)` }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="badge-cyan mb-8 inline-flex mx-auto">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          CSI Student Chapter · VIT Chennai
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] mb-8"
          style={{ perspective: '1000px' }}
        >
          <span className="block text-white">The Future of</span>
          <span className="block bg-gradient-to-r from-cyan-400 via-cyan-300 to-amber-400 bg-clip-text text-transparent shimmer-text">
            Tech Communities
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="max-w-2xl mx-auto text-lg md:text-xl text-[#a1a1aa] leading-relaxed mb-10"
        >
          The next-generation ecosystem for developers, innovators, hackers, and creators.
          Join hackathons, build products, contribute to open source, learn AI, and shape the future.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={() => scrollTo('#events')}
            className="btn-primary px-8 py-4 rounded-full text-base font-semibold text-white flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Explore Ecosystem
          </button>
          <button
            onClick={() => scrollTo('#hackathon')}
            className="btn-secondary px-8 py-4 rounded-full text-base font-semibold text-white flex items-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            Join Hackathons
          </button>
        </div>

        {/* Hero stats */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {[
            { icon: Users, value: '1,200+', label: 'Members' },
            { icon: Calendar, value: '52+', label: 'Events' },
            { icon: Trophy, value: '20+', label: 'Hackathons' },
            { icon: Play, value: '350+', label: 'Projects' },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-4 text-center">
              <stat.icon className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-[#a1a1aa] uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-[#a1a1aa] uppercase tracking-widest">Scroll</span>
        <ArrowDown className="w-4 h-4 text-cyan-400" />
      </div>

      {/* Spline-like 3D element placeholder */}
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none hidden xl:block">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 rounded-full border border-cyan-500/10 animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-8 rounded-full border border-amber-500/10 animate-[spin_15s_linear_infinite_reverse]" />
          <div className="absolute inset-16 rounded-full border border-cyan-500/5 animate-[spin_30s_linear_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-cyan-400/20 glow-ring" />
        </div>
      </div>
    </section>
  );
}
