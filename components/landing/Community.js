"use client";

import { useInView } from '@/hooks/useInView';
import { Award, Star, Zap } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/landing/BrandIcons';

const council = [
  { name: 'Arjun Sharma', role: 'Chairperson', tier: 'diamond', xp: 12500, badges: 12, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80' },
  { name: 'Priya Nair', role: 'Vice Chair', tier: 'diamond', xp: 11200, badges: 10, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
  { name: 'Rohan Gupta', role: 'Technical Lead', tier: 'platinum', xp: 9800, badges: 9, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
  { name: 'Sneha Patel', role: 'Events Head', tier: 'platinum', xp: 8900, badges: 8, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
  { name: 'Karthik Raja', role: 'Design Lead', tier: 'gold', xp: 7200, badges: 7, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { name: 'Meera Krishnan', role: 'Outreach Lead', tier: 'gold', xp: 6500, badges: 6, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80' },
];

const contributors = [
  { name: 'Alex Chen', commits: 342, streak: 45, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' },
  { name: 'Divya R', commits: 298, streak: 38, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' },
  { name: 'Vikram S', commits: 267, streak: 32, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80' },
  { name: 'Ananya K', commits: 245, streak: 28, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80' },
  { name: 'Rahul M', commits: 198, streak: 21, avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&q=80' },
];

const tierStyles = {
  diamond: 'from-cyan-400 to-blue-500 shadow-cyan-500/30',
  platinum: 'from-gray-300 to-gray-100 shadow-gray-400/30',
  gold: 'from-sky-400 to-cyan-500 shadow-cyan-500/20',
};

const tierLabels = {
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
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span className="text-white font-medium">{member.xp.toLocaleString()} XP</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-cyan-400" />
                    <span className="text-[#a1a1aa]">{member.badges} Badges</span>
                  </div>
                </div>

                {/* Social links - show on hover */}
                <div className="flex gap-3 mt-4 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 rounded-lg glass hover:bg-white/10 transition-colors" aria-label="GitHub">
                    <GithubIcon className="w-4 h-4 text-[#a1a1aa]" />
                  </button>
                  <button className="p-2 rounded-lg glass hover:bg-white/10 transition-colors" aria-label="LinkedIn">
                    <LinkedinIcon className="w-4 h-4 text-[#a1a1aa]" />
                  </button>
                  <button className="p-2 rounded-lg glass hover:bg-white/10 transition-colors" aria-label="Twitter">
                    <TwitterIcon className="w-4 h-4 text-[#a1a1aa]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Contributors */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <GithubIcon className="w-6 h-6 text-cyan-400" />
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
                <div className="w-24 text-right text-sm text-cyan-400 hidden sm:block">{c.streak}d</div>
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
