import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { TrendingUp, Target, Zap, Globe } from 'lucide-react';
import gsap from 'gsap';

const stats = [
  { icon: TrendingUp, target: 1200, suffix: '+', label: 'Community Members' },
  { icon: Zap, target: 52, suffix: '+', label: 'Events Conducted' },
  { icon: Target, target: 20, suffix: '+', label: 'Hackathons Hosted' },
  { icon: Globe, target: 350, suffix: '+', label: 'Projects Built' },
];

const milestones = [
  { year: '2021', title: 'Chapter Founded', desc: 'CSI NextGen was established at VIT Chennai with 50 founding members.' },
  { year: '2022', title: 'First Hackathon', desc: 'Hosted HackNova 2022 with 200+ participants from 10 colleges.' },
  { year: '2023', title: 'National Recognition', desc: 'Recognized as Top 10 CSI Student Chapters in India.' },
  { year: '2024', title: '1,000 Members', desc: 'Crossed 1,000 active members milestone with 40+ events.' },
  { year: '2025', title: 'Global Partnerships', desc: 'Partnered with Microsoft, Google, and NVIDIA for programs.' },
  { year: '2026', title: 'NextGen Platform', desc: 'Launched the most advanced student tech community platform.' },
];

function AnimatedCounter({ target, suffix, isInView }: { target: number; suffix: string; isInView: boolean }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      countRef.current = Math.floor(eased * target);
      setCount(countRef.current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isInView, target]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref, isInView } = useInView(0.2);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isInView || !timelineRef.current) return;

    const items = timelineRef.current.querySelectorAll('.timeline-item');
    gsap.fromTo(
      items,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, stagger: 0.15, duration: 0.6, ease: 'power2.out' }
    );
  }, [isInView]);

  return (
    <section id="about" ref={ref} className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6" ref={sectionRef}>
        {/* Header */}
        <div className="text-center mb-20">
          <span className="badge-cyan mb-4 inline-block">About CSI</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Building Future Innovators
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-[#a1a1aa] leading-relaxed">
            Computer Society of India is the largest professional body of computer professionals in India.
            Our NextGen chapter at VIT Chennai is redefining what a student tech community can be.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`glass rounded-3xl p-8 text-center card-lift transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <stat.icon className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter target={stat.target} suffix={stat.suffix} isInView={isInView} />
              </div>
              <div className="text-sm text-[#a1a1aa]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <div className="glass-strong rounded-3xl p-10 animated-border">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
            <p className="text-[#a1a1aa] leading-relaxed">
              To create the most vibrant, inclusive, and innovative student tech community that empowers 
              every member to become a world-class developer, entrepreneur, and leader through hands-on 
              learning, mentorship, and real-world projects.
            </p>
          </div>

          <div className="glass-strong rounded-3xl p-10 animated-border">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
            <p className="text-[#a1a1aa] leading-relaxed">
              To be the premier destination for student technologists in India — a launchpad for startups, 
              a hub for open source contributions, and a catalyst for the next generation of tech leaders 
              who will shape the digital future.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="text-center mb-12">
          <span className="badge-amber mb-4 inline-block">Our Journey</span>
          <h3 className="text-3xl font-bold text-white">Chapter Timeline</h3>
        </div>

        <div ref={timelineRef} className="relative max-w-4xl mx-auto">
          {/* Center line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-cyan-500/20 to-transparent" />

          {milestones.map((m, i) => (
            <div
              key={m.year}
              className={`timeline-item relative flex items-start gap-8 mb-12 ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Dot */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-400 border-4 border-[#0a0a0a] z-10" />

              {/* Content */}
              <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                <div className="glass rounded-2xl p-6 card-lift">
                  <span className="text-cyan-400 font-bold text-sm">{m.year}</span>
                  <h4 className="text-lg font-semibold text-white mt-1 mb-2">{m.title}</h4>
                  <p className="text-sm text-[#a1a1aa]">{m.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
