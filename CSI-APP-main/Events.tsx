import { useState, useEffect, useRef } from 'react';
import { useInView } from '@/hooks/useInView';
import { Calendar, Clock, Users, MapPin, Tag, ArrowRight, Bookmark, Search, Filter } from 'lucide-react';
import gsap from 'gsap';

const categories = ['All', 'Hackathon', 'Workshop', 'Speaker', 'Competition', 'Meetup'];

const events = [
  {
    id: 1,
    title: 'HackNova 2026',
    category: 'Hackathon',
    date: 'Mar 15-16, 2026',
    time: '48 Hours',
    location: 'VIT Chennai Campus',
    registrations: 1240,
    maxRegistrations: 1500,
    prizePool: '₹1,00,000',
    difficulty: 'Advanced',
    status: 'Registration Open',
    trending: true,
    image: '/images/carousel-6.jpg',
    tags: ['AI', 'Web3', 'Cloud', 'Open Innovation'],
    speakers: ['Industry Experts'],
  },
  {
    id: 2,
    title: 'DevSprint 2026',
    category: 'Workshop',
    date: 'Feb 20, 2026',
    time: '8 Hours',
    location: 'Online + Offline',
    registrations: 580,
    maxRegistrations: 800,
    prizePool: 'Certificates',
    difficulty: 'Beginner',
    status: 'Registration Open',
    trending: false,
    image: '/images/carousel-4.jpg',
    tags: ['Full Stack', 'Mentorship'],
    speakers: ['Senior Developers'],
  },
  {
    id: 3,
    title: 'Open Source Summit',
    category: 'Meetup',
    date: 'Apr 5, 2026',
    time: '6 Hours',
    location: 'VIT Chennai Auditorium',
    registrations: 320,
    maxRegistrations: 500,
    prizePool: 'Swags & Credits',
    difficulty: 'All Levels',
    status: 'Coming Soon',
    trending: true,
    image: '/images/carousel-1.jpg',
    tags: ['GitHub', 'OSS', 'Community'],
    speakers: ['Open Source Maintainers'],
  },
  {
    id: 4,
    title: 'AI Workshop Series',
    category: 'Workshop',
    date: 'Jan 25-30, 2026',
    time: '5 Days',
    location: 'Online',
    registrations: 890,
    maxRegistrations: 1000,
    prizePool: 'Projects',
    difficulty: 'Intermediate',
    status: 'Live',
    trending: true,
    image: '/images/carousel-3.jpg',
    tags: ['LLMs', 'PyTorch', 'GenAI'],
    speakers: ['AI Researchers'],
  },
  {
    id: 5,
    title: 'CyberSec Capture The Flag',
    category: 'Competition',
    date: 'Feb 14, 2026',
    time: '12 Hours',
    location: 'Online',
    registrations: 450,
    maxRegistrations: 600,
    prizePool: '₹25,000',
    difficulty: 'Advanced',
    status: 'Registration Open',
    trending: false,
    image: '/images/carousel-2.jpg',
    tags: ['CTF', 'Security', 'Networking'],
    speakers: ['Security Engineers'],
  },
  {
    id: 6,
    title: 'Cloud Native Conf',
    category: 'Speaker',
    date: 'May 10, 2026',
    time: 'Full Day',
    location: 'VIT Chennai',
    registrations: 210,
    maxRegistrations: 400,
    prizePool: 'Knowledge',
    difficulty: 'Intermediate',
    status: 'Coming Soon',
    trending: false,
    image: '/images/carousel-5.jpg',
    tags: ['K8s', 'DevOps', 'Cloud'],
    speakers: ['Cloud Architects'],
  },
];

export default function Events() {
  const { ref } = useInView(0.1);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = events.filter((e) => {
    const matchCat = activeCategory === 'All' || e.category === activeCategory;
    const matchSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        e.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.event-card');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' }
    );
  }, [activeCategory, searchQuery]);

  return (
    <section id="events" ref={ref} className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="badge-cyan mb-4 inline-block">Flagship Events</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Events Ecosystem
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-[#a1a1aa]">
            Discover, register, and participate in world-class tech events designed to push your limits.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a1a1aa]" />
            <input
              type="text"
              placeholder="Search events, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass rounded-xl text-white placeholder:text-[#a1a1aa] focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-[#a1a1aa] flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'glass text-[#a1a1aa] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event) => (
            <div
              key={event.id}
              className="event-card glass rounded-3xl overflow-hidden card-lift group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

                {/* Status badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {event.trending && (
                    <span className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-medium border border-amber-500/30">
                      Trending
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${
                    event.status === 'Live'
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : event.status === 'Registration Open'
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                      : 'bg-white/5 text-[#a1a1aa] border-white/10'
                  }`}>
                    {event.status}
                  </span>
                </div>

                {/* Bookmark */}
                <button className="absolute top-4 right-4 p-2 rounded-lg glass hover:bg-white/10 transition-colors">
                  <Bookmark className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-3 h-3 text-cyan-400" />
                  <span className="text-xs text-cyan-400 font-medium">{event.category}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {event.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-[#a1a1aa]">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#a1a1aa]">
                    <Clock className="w-4 h-4" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#a1a1aa]">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.tags.map((tag) => (
                    <span key={tag} className="skill-tag text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Registration bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-[#a1a1aa] mb-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {event.registrations} / {event.maxRegistrations}
                    </span>
                    <span>{Math.round((event.registrations / event.maxRegistrations) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all"
                      style={{ width: `${(event.registrations / event.maxRegistrations) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#a1a1aa]">Prize Pool</div>
                    <div className="text-sm font-semibold text-white">{event.prizePool}</div>
                  </div>
                  <button className="btn-primary px-5 py-2 rounded-full text-sm font-medium text-white flex items-center gap-2">
                    Register
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
