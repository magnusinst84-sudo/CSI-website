"use client";

import { useState, useEffect, useRef } from 'react';
import { useInView } from '@/hooks/useInView';
import { Star, GitFork, ExternalLink, Search, Filter } from 'lucide-react';
import { GithubIcon } from '@/components/landing/BrandIcons';
import gsap from 'gsap';

const categories = ['All', 'AI/ML', 'Web App', 'Mobile', 'Blockchain', 'DevTools', 'IoT'];

const projectsData = [
  {
    id: 1,
    name: 'NexusChat AI',
    desc: 'Real-time AI chatbot with RAG pipeline, supporting multiple LLM providers.',
    stars: 234, forks: 45, category: 'AI/ML',
    stack: ['Next.js', 'Python', 'OpenAI', 'Redis'],
    demo: '#', repo: '#',
    contributors: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
    ],
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80',
    trending: true,
  },
  {
    id: 2,
    name: 'CryptoVault',
    desc: 'Decentralized escrow platform for secure peer-to-peer crypto transactions.',
    stars: 189, forks: 32, category: 'Blockchain',
    stack: ['Solidity', 'React', 'Ethers.js', 'Hardhat'],
    demo: '#', repo: '#',
    contributors: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'],
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80',
    trending: true,
  },
  {
    id: 3,
    name: 'CloudPilot',
    desc: 'Auto-scaling Kubernetes dashboard with real-time monitoring and alerts.',
    stars: 156, forks: 28, category: 'DevTools',
    stack: ['Go', 'React', 'Kubernetes', 'Prometheus'],
    demo: '#', repo: '#',
    contributors: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80'
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    trending: false,
  },
  {
    id: 4,
    name: 'MediConnect',
    desc: 'Healthcare appointment system with AI-powered symptom checker.',
    stars: 134, forks: 21, category: 'Web App',
    stack: ['React', 'Node.js', 'MongoDB', 'TensorFlow.js'],
    demo: '#', repo: '#',
    contributors: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'],
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
    trending: false,
  },
  {
    id: 5,
    name: 'SmartFarm IoT',
    desc: 'IoT-based smart agriculture monitoring with automated irrigation.',
    stars: 112, forks: 19, category: 'IoT',
    stack: ['Arduino', 'Python', 'MQTT', 'React'],
    demo: '#', repo: '#',
    contributors: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    ],
    image: 'https://images.unsplash.com/photo-1563741914-74607383376a?auto=format&fit=crop&w=600&q=80',
    trending: false,
  },
  {
    id: 6,
    name: 'DevMatch',
    desc: 'AI-powered teammate finder for hackathons based on skills and interests.',
    stars: 98, forks: 15, category: 'AI/ML',
    stack: ['Next.js', 'PostgreSQL', 'OpenAI', 'Prisma'],
    demo: '#', repo: '#',
    contributors: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    ],
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    trending: true,
  },
];

export default function Projects() {
  const { ref } = useInView(0.1);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const gridRef = useRef(null);

  const filtered = projectsData.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.stack.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.project-card');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' }
    );
  }, [activeCategory, searchQuery]);

  return (
    <section id="projects" ref={ref} className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="badge-cyan mb-4 inline-block">Open Source</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Project Showcase
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-[#a1a1aa]">
            Discover and contribute to amazing projects built by our community members.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a1a1aa]" />
            <input
              type="text"
              placeholder="Search projects, tech stack..."
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

        {/* Projects Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="project-card glass rounded-2xl overflow-hidden card-lift group"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                {project.trending && (
                  <span className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-medium border border-blue-500/30">
                    Trending
                  </span>
                )}
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <a href={project.demo} className="p-2 rounded-lg glass hover:bg-white/10 transition-colors" aria-label="Demo">
                    <ExternalLink className="w-4 h-4 text-white" />
                  </a>
                  <a href={project.repo} className="p-2 rounded-lg glass hover:bg-white/10 transition-colors" aria-label="Repo">
                    <GithubIcon className="w-4 h-4 text-white" />
                  </a>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {project.name}
                </h3>
                <p className="text-sm text-[#a1a1aa] mb-4 line-clamp-2">{project.desc}</p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.stack.map((tech) => (
                    <span key={tech} className="skill-tag text-xs py-0.5">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-[#a1a1aa]">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-cyan-400" />
                      {project.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-4 h-4 text-cyan-400" />
                      {project.forks}
                    </span>
                  </div>
                  <div className="flex -space-x-2">
                    {project.contributors.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=""
                        className="w-6 h-6 rounded-full border-2 border-[#0a0a0a] object-cover"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
