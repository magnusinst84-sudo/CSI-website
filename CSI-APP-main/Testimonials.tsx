import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import gsap from 'gsap';

const testimonials = [
  {
    name: 'Aditya Krishnan',
    role: 'Software Engineer @ Google',
    batch: '2024 Batch',
    avatar: '/images/grid-2.jpg',
    text: 'CSI NextGen was the launchpad for my career. The hackathons pushed me to build real projects, and the mentorship from seniors helped me crack Google interviews. The community here genuinely cares about your growth.',
    rating: 5,
  },
  {
    name: 'Shruti Menon',
    role: 'Product Designer @ Microsoft',
    batch: '2023 Batch',
    avatar: '/images/grid-1.jpg',
    text: 'From being a shy first-year to leading design for national-level events, CSI transformed me completely. The UI/UX domain workshops and hands-on projects gave me a portfolio that impressed Microsoft recruiters.',
    rating: 5,
  },
  {
    name: 'Vikram Seth',
    role: 'Founder, TechStart',
    batch: '2022 Batch',
    avatar: '/images/grid-4.jpg',
    text: 'The entrepreneurial spirit at CSI is unmatched. I built my first startup prototype at HackNova, found my co-founder here, and got seed funding through the alumni network. This community breeds builders.',
    rating: 5,
  },
  {
    name: 'Ananya Desai',
    role: 'ML Engineer @ NVIDIA',
    batch: '2024 Batch',
    avatar: '/images/grid-5.jpg',
    text: 'The AI/ML domain at CSI is world-class. We had access to GPU resources, mentorship from industry researchers, and collaborative projects that went into real publications. I owe my NVIDIA role to this community.',
    rating: 5,
  },
  {
    name: 'Rohan Iyer',
    role: 'Security Researcher @ CrowdStrike',
    batch: '2023 Batch',
    avatar: '/images/grid-6.jpg',
    text: 'The cybersecurity track here is intense and practical. CTF competitions, red team exercises, and guest lectures from industry experts prepared me for a career in cybersecurity. Best decision I made in college.',
    rating: 5,
  },
];

export default function Testimonials() {
  const { ref } = useInView(0.1);
  const [current, setCurrent] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!carouselRef.current) return;
    gsap.to(carouselRef.current, {
      x: `-${current * 100}%`,
      duration: 0.6,
      ease: 'power2.inOut',
    });
  }, [current]);

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="badge-amber mb-4 inline-block">Success Stories</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            What Members Say
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-3xl">
            <div ref={carouselRef} className="flex" style={{ width: `${testimonials.length * 100}%` }}>
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="w-full flex-shrink-0 px-4"
                  style={{ width: `${100 / testimonials.length}%` }}
                >
                  <div className="glass-strong rounded-3xl p-8 md:p-12 text-center">
                    <Quote className="w-10 h-10 text-cyan-400/30 mx-auto mb-6" />
                    <p className="text-lg md:text-xl text-white leading-relaxed mb-8">
                      "{t.text}"
                    </p>
                    <div className="flex justify-center gap-1 mb-6">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="w-5 h-5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                      <div className="text-left">
                        <div className="font-bold text-white">{t.name}</div>
                        <div className="text-sm text-cyan-400">{t.role}</div>
                        <div className="text-xs text-[#a1a1aa]">{t.batch}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="p-3 rounded-full glass hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? 'w-8 bg-cyan-400' : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrent((prev) => (prev + 1) % testimonials.length)}
              className="p-3 rounded-full glass hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
