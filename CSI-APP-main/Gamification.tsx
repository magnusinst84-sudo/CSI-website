import { useInView } from '@/hooks/useInView';
import {
  Zap, Award, Target, Flame, Crown, Star,
  TrendingUp, Gift, Trophy, Shield
} from 'lucide-react';

const badges = [
  { name: 'First Hack', icon: Zap, desc: 'Participate in your first hackathon', color: 'text-cyan-400', bg: 'from-cyan-500/20 to-blue-500/10' },
  { name: 'Code Streak', icon: Flame, desc: '30-day contribution streak', color: 'text-orange-400', bg: 'from-orange-500/20 to-red-500/10' },
  { name: 'Open Source', icon: Star, desc: 'First merged pull request', color: 'text-green-400', bg: 'from-green-500/20 to-emerald-500/10' },
  { name: 'Mentor', icon: Shield, desc: 'Mentor 5+ junior members', color: 'text-purple-400', bg: 'from-purple-500/20 to-pink-500/10' },
  { name: 'Top 10', icon: Crown, desc: 'Place top 10 in any competition', color: 'text-amber-400', bg: 'from-amber-500/20 to-yellow-500/10' },
  { name: 'Event Host', icon: Target, desc: 'Organize a community event', color: 'text-rose-400', bg: 'from-rose-500/20 to-red-500/10' },
];

const rankings = [
  { rank: 1, name: 'Arjun Sharma', xp: 12500, level: 25, badges: 12, avatar: '/images/grid-1.jpg' },
  { rank: 2, name: 'Priya Nair', xp: 11200, level: 22, badges: 10, avatar: '/images/grid-2.jpg' },
  { rank: 3, name: 'Rohan Gupta', xp: 9800, level: 20, badges: 9, avatar: '/images/grid-4.jpg' },
  { rank: 4, name: 'Sneha Patel', xp: 8900, level: 18, badges: 8, avatar: '/images/grid-5.jpg' },
  { rank: 5, name: 'Karthik Raja', xp: 7200, level: 15, badges: 7, avatar: '/images/grid-6.jpg' },
];

const challenges = [
  { name: 'Weekly Coding Challenge', reward: '500 XP', participants: 234, daysLeft: 3 },
  { name: 'Open Source Sprint', reward: '1000 XP', participants: 156, daysLeft: 7 },
  { name: 'Design Challenge', reward: '750 XP', participants: 89, daysLeft: 5 },
];

export default function Gamification() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref} className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="badge-amber mb-4 inline-block">Gamification</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Level Up Your Journey
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-[#a1a1aa]">
            Earn XP, collect badges, maintain streaks, and climb the leaderboard as you learn and contribute.
          </p>
        </div>

        {/* XP Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="glass rounded-2xl p-8 text-center animated-border">
            <TrendingUp className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
            <div className="text-4xl font-bold text-white mb-2">2.4M+</div>
            <div className="text-sm text-[#a1a1aa]">Total XP Earned</div>
          </div>
          <div className="glass rounded-2xl p-8 text-center animated-border">
            <Trophy className="w-10 h-10 text-amber-400 mx-auto mb-4" />
            <div className="text-4xl font-bold text-white mb-2">1,850+</div>
            <div className="text-sm text-[#a1a1aa]">Badges Awarded</div>
          </div>
          <div className="glass rounded-2xl p-8 text-center animated-border">
            <Gift className="w-10 h-10 text-purple-400 mx-auto mb-4" />
            <div className="text-4xl font-bold text-white mb-2">500+</div>
            <div className="text-sm text-[#a1a1aa]">Challenges Completed</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Badges */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-400" />
              Achievement Badges
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {badges.map((badge, i) => (
                <div
                  key={badge.name}
                  className={`glass rounded-2xl p-5 flex items-start gap-4 card-lift transition-all duration-500 ${
                    isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${i * 75}ms` }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${badge.bg} flex items-center justify-center flex-shrink-0`}>
                    <badge.icon className={`w-6 h-6 ${badge.color}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{badge.name}</h4>
                    <p className="text-sm text-[#a1a1aa]">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Challenges */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" />
              Active Challenges
            </h3>
            <div className="space-y-4">
              {challenges.map((c, i) => (
                <div
                  key={c.name}
                  className={`glass rounded-2xl p-5 transition-all duration-500 ${
                    isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${(i + 6) * 75}ms` }}
                >
                  <h4 className="font-semibold text-white mb-2">{c.name}</h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-cyan-400 font-medium">{c.reward}</span>
                    <span className="text-[#a1a1aa]">{c.participants} participants</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-[#a1a1aa] mb-1">
                      <span>{c.daysLeft} days left</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                        style={{ width: `${Math.max(10, 100 - c.daysLeft * 10)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rankings */}
        <div className="mt-16">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            Seasonal Leaderboard
          </h3>
          <div className="glass rounded-2xl overflow-hidden">
            <div className="flex items-center gap-4 p-4 border-b border-white/5 text-xs text-[#a1a1aa] uppercase tracking-wider">
              <div className="w-12">Rank</div>
              <div className="flex-1">Member</div>
              <div className="w-20 text-right hidden sm:block">Level</div>
              <div className="w-20 text-right hidden sm:block">Badges</div>
              <div className="w-24 text-right">XP</div>
            </div>
            {rankings.map((user, i) => (
              <div
                key={user.name}
                className="flex items-center gap-4 p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
              >
                <div className="w-12 text-center font-bold">
                  {i === 0 ? <Crown className="w-5 h-5 text-amber-400 mx-auto" /> :
                   i === 1 ? <Star className="w-5 h-5 text-gray-300 mx-auto" /> :
                   i === 2 ? <Award className="w-5 h-5 text-orange-400 mx-auto" /> :
                   <span className="text-[#a1a1aa]">#{user.rank}</span>}
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-lg object-cover" />
                  <span className="text-sm font-medium text-white">{user.name}</span>
                </div>
                <div className="w-20 text-right hidden sm:block">
                  <span className="px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-medium">
                    Lv.{user.level}
                  </span>
                </div>
                <div className="w-20 text-right text-sm text-[#a1a1aa] hidden sm:block">{user.badges}</div>
                <div className="w-24 text-right text-sm font-bold text-white">{user.xp.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
