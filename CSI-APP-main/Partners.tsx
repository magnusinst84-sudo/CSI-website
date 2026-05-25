import { useInView } from '@/hooks/useInView';

const partners = [
  'Microsoft', 'Google', 'NVIDIA', 'GitHub', 'MongoDB', 'AWS', 'MLH',
  'Stripe', 'Twilio', 'Postman', 'Vercel', 'Figma',
];

export default function Partners() {
  const { ref, isInView } = useInView(0.3);

  return (
    <section ref={ref} className="py-20 overflow-hidden relative">
      <div className="text-center mb-12">
        <span className="badge-cyan">Trusted By Industry Leaders</span>
      </div>

      <div
        className={`transition-all duration-1000 ${
          isInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* First row - left scroll */}
        <div className="marquee mb-6">
          <div className="marquee-track">
            {[...partners, ...partners].map((name, i) => (
              <div
                key={`${name}-${i}`}
                className="flex items-center gap-3 px-8 py-4 glass rounded-xl transition-all duration-300 hover:bg-white/5 hover:scale-105 cursor-default group flex-shrink-0"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                  <span className="text-sm font-bold text-cyan-400">
                    {name[0]}
                  </span>
                </div>
                <span className="text-lg font-semibold text-white/40 group-hover:text-white transition-colors whitespace-nowrap">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Second row - right scroll */}
        <div className="marquee">
          <div
            className="marquee-track"
            style={{ animationDirection: 'reverse', animationDuration: '35s' }}
          >
            {[...partners.reverse(), ...partners].map((name, i) => (
              <div
                key={`r-${name}-${i}`}
                className="flex items-center gap-3 px-8 py-4 glass rounded-xl transition-all duration-300 hover:bg-white/5 hover:scale-105 cursor-default group flex-shrink-0"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                  <span className="text-sm font-bold text-amber-400">
                    {name[0]}
                  </span>
                </div>
                <span className="text-lg font-semibold text-white/40 group-hover:text-white transition-colors whitespace-nowrap">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gradient fades */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
    </section>
  );
}
