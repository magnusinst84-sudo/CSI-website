import { useInView } from '@/hooks/useInView';
import { Github, Linkedin, Twitter, Award, Star, Zap } from 'lucide-react';

const council = [
  { name: 'Arjun Sharma', role: 'Chairperson', tier: 'diamond', xp: 12500, badges: 12, avatar: '/images/grid-1.jpg' },
  { name: 'Priya Nair', role: 'Vice Chair', tier: 'diamond', xp: 11200, badges: 10, avatar: '/images/grid-2.jpg' },
  { name: 'Rohan Gupta', role: 'Technical Lead', tier: 'platinum', xp: 9800, badges: 9, avatar: '/images/grid-4.jpg' },
  { name: 'Sneha Patel', role: 'Events Head', tier: 'platinum', xp: 8900, badges: 8, avatar: '/images/grid-5.jpg' },
  { name: 'Karthik Raja', role: 'Design Lead', tier: 'gold', xp: 7200, badges: 7, avatar: '/images/grid-6.jpg' },
  { name: 'Meera Krishnan', role: 'Outreach Lead', tier: 'gold', xp: 6500, badges: 6, avatar: '/images/grid-7.jpg' },
];

const contributors = [
  { name: 'Alex Chen', commits: 342, streak: 45, avatar: '/images/grid-1.jpg' },
  { name: 'Divya R', commits: 298, streak: 38, avatar: '/images/grid-2.jpg' },
  { name: 'Vikram S', commits: 267, streak: 32, avatar: '/images/grid-4.jpg' },
  { name: 'Ananya K', commits: 245, streak: 28, avatar: '/images/grid-5.jpg' },
  { name: 'Rahul M', commits: 198, streak: 21, avatar: '/images/grid-6.jpg' },
];

const tierStyles: Record<string, string> = {
  diamond: 'from-cyan-400 to-blue-500 shadow-cyan-500/30',
  platinum: 'from-gray-300 to-gray-100 shadow-gray-400/30',
  gold: 'from-amber-400 to-yellow-500 shadow-amber-500/30',
};

const tierLabels: Record<string, string> = {
  diamond: 'Diamond',
  platinum: 'Platinum',
  gold: 'Gold',
};

export default function Community() {
  const { ref } = useInView(0.1);

  return (
    <section id="community" ref={ref} className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="badge-cyan mb-4 inline-block">The People Behind CSI</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Community Showcase
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-[#a1a1aa]">
            Meet the leaders, contributors, and changemakers who make our community exceptional.
          </p>
        </div>

        {/* Council Section */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <Award className="w-6 h-6 text-cyan-400" />
            Student Council 2025-26
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {council.map((member) => (
              <div
                key={member.name}
                className="glass rounded-2xl p-6 card-lift group spotlight-card relative overflow-hidden"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
                  e.currentTarget.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
                }}
              >
                {/* Tier glow */}
                <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br ${tierStyles[member.tier]} opacity-20 blur-xl`} />

                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br ${tierStyles[member.tier]} flex items-center justify-center`}>
                      <Star className="w-3 h-3 text-black" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{member.name}</h4>
                    <p className="text-sm text-[#a1a1aa]">{member.role}</p>
                    <span className={`text-xs font-medium bg-gradient-to-r ${tierStyles[member.tier]} bg-clip-text text-transparent`}>
                      {tierLabels[member.tier]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-white font-medium">{member.xp.toLocaleString()} XP</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-cyan-400" />
                    <span className="text-[#a1a1aa]">{member.badges} Badges</span>
                  </div>
                </div>

                {/* Social links - show on hover */}
                <div className="flex gap-3 mt-4 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 rounded-lg glass hover:bg-white/10 transition-colors">
                    <Github className="w-4 h-4 text-[#a1a1aa]" />
                  </button>
                  <button className="p-2 rounded-lg glass hover:bg-white/10 transition-colors">
                    <Linkedin className="w-4 h-4 text-[#a1a1aa]" />
                  </button>
                  <button className="p-2 rounded-lg glass hover:bg-white/10 transition-colors">
                    <Twitter className="w-4 h-4 text-[#a1a1aa]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Contributors */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <Github className="w-6 h-6 text-cyan-400" />
            Top Contributors
          </h3>

          <div className="glass rounded-2xl overflow-hidden">
            <div className="flex items-center gap-4 p-4 border-b border-white/5 text-xs text-[#a1a1aa] uppercase tracking-wider">
              <div className="w-8">#</div>
              <div className="flex-1">Member</div>
              <div className="w-24 text-right">Commits</div>
              <div className="w-24 text-right hidden sm:block">Streak</div>
              <div className="w-24 text-right hidden md:block">Level</div>
            </div>

            {contributors.map((c, i) => (
              <div
                key={c.name}
                className="flex items-center gap-4 p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group"
              >
                <div className="w-8 text-sm font-bold text-[#a1a1aa]">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-lg object-cover" />
                  <span className="text-sm font-medium text-white">{c.name}</span>
                </div>
                <div className="w-24 text-right text-sm text-cyan-400 font-medium">{c.commits}</div>
                <div className="w-24 text-right text-sm text-amber-400 hidden sm:block">{c.streak}d</div>
                <div className="w-24 text-right hidden md:block">
                  <div className="inline-flex px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-medium">
                    Lv.{Math.floor(c.commits / 50) + 10}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
