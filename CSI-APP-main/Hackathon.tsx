import { useState, useEffect, useRef } from 'react';
import { useInView } from '@/hooks/useInView';
import {
  Trophy, Users, Code2, Lightbulb, Calendar, ChevronRight,
  Target, Award, Zap, Star, Crown, Medal
} from 'lucide-react';
import gsap from 'gsap';

const tracks = [
  { icon: BrainIcon, name: 'AI & Machine Learning', desc: 'Build intelligent solutions using LLMs, computer vision, and generative AI.', prize: '₹30,000', color: 'from-purple-500 to-pink-500' },
  { icon: ShieldIcon, name: 'Cybersecurity', desc: 'Create security tools, CTF challenges, and defense mechanisms.', prize: '₹20,000', color: 'from-green-500 to-emerald-500' },
  { icon: GlobeIcon, name: 'Web3 & Blockchain', desc: 'Develop dApps, smart contracts, and decentralized solutions.', prize: '₹25,000', color: 'from-amber-500 to-orange-500' },
  { icon: CloudIcon, name: 'Cloud & DevOps', desc: 'Design scalable infrastructure and CI/CD pipelines.', prize: '₹15,000', color: 'from-cyan-500 to-blue-500' },
  { icon: HeartIcon, name: 'Social Impact', desc: 'Technology for social good — education, healthcare, sustainability.', prize: '₹10,000', color: 'from-rose-500 to-red-500' },
];

const prizes = [
  { rank: '1st', amount: '₹50,000', icon: Crown, color: 'text-amber-400', bg: 'from-amber-500/20 to-yellow-500/10' },
  { rank: '2nd', amount: '₹30,000', icon: Trophy, color: 'text-gray-300', bg: 'from-gray-500/20 to-gray-400/10' },
  { rank: '3rd', amount: '₹20,000', icon: Medal, color: 'text-orange-400', bg: 'from-orange-500/20 to-orange-400/10' },
];

const schedule = [
  { day: 'Day 1', time: '09:00 AM', event: 'Registration & Check-in' },
  { day: 'Day 1', time: '10:30 AM', event: 'Opening Ceremony' },
  { day: 'Day 1', time: '12:00 PM', event: 'Hacking Begins!' },
  { day: 'Day 1', time: '02:00 PM', event: 'Lunch & Networking' },
  { day: 'Day 1', time: '04:00 PM', event: 'Workshop: AI Integration' },
  { day: 'Day 1', time: '08:00 PM', event: 'Dinner & Games' },
  { day: 'Day 2', time: '12:00 AM', event: 'Midnight Snack' },
  { day: 'Day 2', time: '08:00 AM', event: 'Breakfast' },
  { day: 'Day 2', time: '12:00 PM', event: 'Hacking Ends' },
  { day: 'Day 2', time: '02:00 PM', event: 'Project Demos' },
  { day: 'Day 2', time: '05:00 PM', event: 'Awards Ceremony' },
];

const leaderboard = [
  { name: 'Team Neural', project: 'AI Study Assistant', track: 'AI & ML', score: 98 },
  { name: 'CyberSquad', project: 'Network Guardian', track: 'Cybersecurity', score: 95 },
  { name: 'BlockBuilders', project: 'DeFi Lending', track: 'Web3', score: 93 },
  { name: 'CloudNinjas', project: 'AutoScaler Pro', track: 'Cloud', score: 91 },
  { name: 'EcoDevs', project: 'Carbon Tracker', track: 'Social Impact', score: 89 },
];

function BrainIcon(props: any) { return <Code2 {...props} />; }
function ShieldIcon(props: any) { return <Target {...props} />; }
function GlobeIcon(props: any) { return <Globe2 {...props} />; }
function CloudIcon(props: any) { return <Zap {...props} />; }
function HeartIcon(props: any) { return <Lightbulb {...props} />; }
function Globe2(props: any) { return <GlobeIconReal {...props} />; }
import { Globe as GlobeIconReal } from 'lucide-react';

export default function Hackathon() {
  const { ref } = useInView(0.1);
  const [activeTab, setActiveTab] = useState<'tracks' | 'prizes' | 'schedule' | 'leaderboard'>('tracks');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const items = contentRef.current.querySelectorAll('.tab-content-item');
    gsap.fromTo(
      items,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.05, duration: 0.4, ease: 'power2.out' }
    );
  }, [activeTab]);

  const tabs = [
    { key: 'tracks' as const, label: 'Tracks', icon: Target },
    { key: 'prizes' as const, label: 'Prizes', icon: Trophy },
    { key: 'schedule' as const, label: 'Schedule', icon: Calendar },
    { key: 'leaderboard' as const, label: 'Leaderboard', icon: Award },
  ];

  return (
    <section id="hackathon" ref={ref} className="py-32 relative">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Hero Banner */}
        <div className="glass-strong rounded-3xl p-10 md:p-16 mb-16 text-center overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-amber-500/5" />
          <div className="relative z-10">
            <div className="badge-amber mb-6 inline-block">Flagship Event</div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
              HackNova <span className="text-cyan-400">2026</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-[#a1a1aa] mb-8">
              48 hours of innovation, mentorship, and breakthrough technology.
              Join 1,500+ hackers building the future.
            </p>

            <div className="flex flex-wrap justify-center gap-8 mb-10">
              {[
                { icon: Calendar, label: 'March 15-16, 2026' },
                { icon: Users, label: '1,500+ Hackers' },
                { icon: Trophy, label: '₹1L Prize Pool' },
                { icon: Code2, label: '5 Tracks' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-[#a1a1aa]">
                  <item.icon className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            <button className="btn-primary px-10 py-4 rounded-full text-lg font-semibold text-white">
              Register for HackNova 2026
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="glass rounded-2xl p-1.5 flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                  activeTab === tab.key
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div ref={contentRef}>
          {activeTab === 'tracks' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tracks.map((track) => (
                <div key={track.name} className="tab-content-item glass rounded-2xl p-6 card-lift group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${track.color} flex items-center justify-center mb-4`}>
                    <track.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{track.name}</h4>
                  <p className="text-sm text-[#a1a1aa] mb-4">{track.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-semibold">{track.prize}</span>
                    <ChevronRight className="w-4 h-4 text-[#a1a1aa] group-hover:text-cyan-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'prizes' && (
            <div className="grid md:grid-cols-3 gap-6">
              {prizes.map((prize) => (
                <div
                  key={prize.rank}
                  className={`tab-content-item glass rounded-2xl p-8 text-center bg-gradient-to-b ${prize.bg} card-lift`}
                >
                  <prize.icon className={`w-16 h-16 ${prize.color} mx-auto mb-4`} />
                  <div className="text-3xl font-bold text-white mb-1">{prize.rank} Place</div>
                  <div className="text-2xl font-bold text-cyan-400">{prize.amount}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="glass rounded-2xl p-6 max-w-3xl mx-auto">
              {schedule.map((item, i) => (
                <div
                  key={i}
                  className="tab-content-item flex items-center gap-6 py-4 border-b border-white/5 last:border-0"
                >
                  <div className="w-24 text-sm text-[#a1a1aa] font-medium">{item.time}</div>
                  <div className="w-20 text-xs text-cyan-400 uppercase tracking-wider">{item.day}</div>
                  <div className="flex-1 text-white font-medium">{item.event}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="glass rounded-2xl p-6 max-w-3xl mx-auto">
              <div className="flex items-center gap-4 py-3 border-b border-white/10 text-xs text-[#a1a1aa] uppercase tracking-wider">
                <div className="w-12">Rank</div>
                <div className="flex-1">Team</div>
                <div className="flex-1 hidden sm:block">Project</div>
                <div className="w-24 hidden sm:block">Track</div>
                <div className="w-20 text-right">Score</div>
              </div>
              {leaderboard.map((entry, i) => (
                <div
                  key={entry.name}
                  className="tab-content-item flex items-center gap-4 py-4 border-b border-white/5 last:border-0"
                >
                  <div className="w-12">
                    {i === 0 ? <Crown className="w-5 h-5 text-amber-400" /> :
                     i === 1 ? <Star className="w-5 h-5 text-gray-300" /> :
                     i === 2 ? <Medal className="w-5 h-5 text-orange-400" /> :
                     <span className="text-[#a1a1aa]">#{i + 1}</span>}
                  </div>
                  <div className="flex-1 font-semibold text-white">{entry.name}</div>
                  <div className="flex-1 hidden sm:block text-sm text-[#a1a1aa]">{entry.project}</div>
                  <div className="w-24 hidden sm:block text-xs text-cyan-400">{entry.track}</div>
                  <div className="w-20 text-right font-bold text-white">{entry.score}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
